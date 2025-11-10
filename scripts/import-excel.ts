import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';
import { OptionalId, Document } from 'mongodb';
import { MongoClient } from 'mongodb';
import { ExperimentResult } from '../types';

// 加载环境变量
config({ path: path.join(process.cwd(), '.env.local') });

async function importExcelToMongoDB() {
  try {
    // 读取Excel文件
    const excelPath = path.join(process.cwd(), '5517-project-测试数据.xlsx');
    
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Excel文件不存在: ${excelPath}`);
    }

    console.log('正在读取Excel文件...');
    const workbook = XLSX.readFile(excelPath);
    
    // 获取第一页（sheet1）
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    console.log(`正在读取工作表: ${firstSheetName}`);
    
    // 将工作表转换为JSON数组
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      raw: false, // 保持原始值，不进行类型转换
      defval: null // 空单元格使用null
    });
    
    console.log(`读取到 ${data.length} 条数据`);
    
    if (data.length === 0) {
      console.log('Excel文件中没有数据');
      return;
    }
    
    // 打印第一条数据作为示例
    console.log('第一条原始数据示例:');
    console.log(JSON.stringify(data[0], null, 2));
    
    // 连接MongoDB
    console.log('正在连接MongoDB...');
    if (!process.env.MONGODB_URI) {
      throw new Error('请设置MONGODB_URI环境变量或创建.env.local文件');
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('ui_experiment');
    
    const collectionName = 'results';
    const collection = db.collection(collectionName);
    
    // 将Excel数据转换为ExperimentResult格式
    const documents: Omit<ExperimentResult, '_id'>[] = data
      .filter((row: any) => {
        // 过滤掉空行或无效数据
        return row['版本'] && row['开始时间'] && row['完成时间'];
      })
      .map((row: any) => {
        // 映射版本：对照版 -> feature, 优化版 -> optimized
        const versionMap: Record<string, 'optimized' | 'feature'> = {
          '对照版': 'feature',
          '优化版': 'optimized',
          'feature': 'feature',
          'optimized': 'optimized',
        };
        const version = versionMap[row['版本']?.trim()] || 'feature';
        
        // 解析开始时间
        let startTime: Date;
        try {
          const startTimeStr = row['开始时间'];
          if (typeof startTimeStr === 'string') {
            // 处理不同的日期格式：11/3/25 14:15 或 2025/11/3 14:18
            startTime = new Date(startTimeStr);
            if (isNaN(startTime.getTime())) {
              // 如果解析失败，尝试其他格式
              const parts = startTimeStr.split(/[\s\/:]/);
              if (parts.length >= 3) {
                const year = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
                const month = parts[1].padStart(2, '0');
                const day = parts[2].padStart(2, '0');
                const hour = parts[3] || '0';
                const minute = parts[4] || '0';
                startTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
              } else {
                startTime = new Date();
              }
            }
          } else {
            startTime = new Date();
          }
        } catch {
          startTime = new Date();
        }
        
        // 解析完成时间
        let endTime: Date;
        try {
          const endTimeStr = row['完成时间'];
          if (typeof endTimeStr === 'string') {
            endTime = new Date(endTimeStr);
            if (isNaN(endTime.getTime())) {
              const parts = endTimeStr.split(/[\s\/:]/);
              if (parts.length >= 3) {
                const year = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
                const month = parts[1].padStart(2, '0');
                const day = parts[2].padStart(2, '0');
                const hour = parts[3] || '0';
                const minute = parts[4] || '0';
                endTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
              } else {
                endTime = new Date();
              }
            }
          } else {
            endTime = new Date();
          }
        } catch {
          endTime = new Date();
        }
        
        // 计算duration（毫秒）
        let duration: number;
        if (row['耗时(分)']) {
          const minutes = parseFloat(String(row['耗时(分)']));
          duration = isNaN(minutes) ? endTime.getTime() - startTime.getTime() : minutes * 60 * 1000;
        } else {
          duration = endTime.getTime() - startTime.getTime();
        }
        
        // 确认码
        const confirmationCode = String(row['确认码'] || '').trim();
        
        // NASA-TLX 数据
        const nasatlx = {
          mentalDemand: parseFloat(String(row['心理需求'] || 0)) || 0,
          physicalDemand: parseFloat(String(row['体力需求'] || 0)) || 0,
          temporalDemand: parseFloat(String(row['时间压力'] || 0)) || 0,
          performance: parseFloat(String(row['自身表现'] || 0)) || 0,
          effort: parseFloat(String(row['努力程度'] || 0)) || 0,
          frustration: parseFloat(String(row['挫败感'] || 0)) || 0,
        };
        
        // 构建ExperimentResult对象
        const result: Omit<ExperimentResult, '_id'> = {
          version,
          startTime,
          endTime,
          duration,
          confirmationCode,
          nasatlx,
          createdAt: new Date(),
        };
        
        return result;
      });
    
    console.log(`转换后数据条数: ${documents.length}`);
    if (documents.length > 0) {
      console.log('第一条转换后数据示例:');
      console.log(JSON.stringify(documents[0], null, 2));
    }
    
    // 插入数据
    console.log(`正在插入 ${documents.length} 条数据到集合 ${collectionName}...`);
    const result = await collection.insertMany(documents as OptionalId<Document>[]);
    
    console.log(`成功插入 ${result.insertedCount} 条数据`);
    console.log('插入的文档ID:');
    Object.values(result.insertedIds).forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });
    
    // 关闭连接
    await client.close();
    console.log('数据导入完成！');
    
  } catch (error) {
    console.error('导入数据时出错:', error);
    process.exit(1);
  }
}

// 运行导入函数
importExcelToMongoDB();

