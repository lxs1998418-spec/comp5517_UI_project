import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ExperimentResult } from '@/types';

interface Stats {
  count: number;
  avgDuration: number; // 分钟
  avgMentalDemand: number;
  avgPhysicalDemand: number;
  avgTemporalDemand: number;
  avgPerformance: number;
  avgEffort: number;
  avgFrustration: number;
  minDuration: number;
  maxDuration: number;
  medianDuration: number;
}

interface Comparison {
  metric: string;
  optimized: number;
  feature: number;
  difference: number;
  differencePercent: number;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateStats(results: ExperimentResult[]): Stats | null {
  if (results.length === 0) return null;

  // 过滤掉无效的数据（没有 nasatlx 或 nasatlx 不完整）
  const validResults = results.filter(
    (r) => r.nasatlx && 
    typeof r.nasatlx.mentalDemand === 'number' &&
    typeof r.nasatlx.physicalDemand === 'number' &&
    typeof r.nasatlx.temporalDemand === 'number' &&
    typeof r.nasatlx.performance === 'number' &&
    typeof r.nasatlx.effort === 'number' &&
    typeof r.nasatlx.frustration === 'number'
  );

  if (validResults.length === 0) return null;

  const durations = validResults.map((r) => r.duration / 1000 / 60); // 转换为分钟
  const mentalDemands = validResults.map((r) => r.nasatlx!.mentalDemand);
  const physicalDemands = validResults.map((r) => r.nasatlx!.physicalDemand);
  const temporalDemands = validResults.map((r) => r.nasatlx!.temporalDemand);
  const performances = validResults.map((r) => r.nasatlx!.performance);
  const efforts = validResults.map((r) => r.nasatlx!.effort);
  const frustrations = validResults.map((r) => r.nasatlx!.frustration);

  return {
    count: validResults.length,
    avgDuration: calculateAverage(durations),
    avgMentalDemand: calculateAverage(mentalDemands),
    avgPhysicalDemand: calculateAverage(physicalDemands),
    avgTemporalDemand: calculateAverage(temporalDemands),
    avgPerformance: calculateAverage(performances),
    avgEffort: calculateAverage(efforts),
    avgFrustration: calculateAverage(frustrations),
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    medianDuration: calculateMedian(durations),
  };
}

function calculateComparison(
  optimizedStats: Stats,
  featureStats: Stats
): Comparison[] {
  const comparisons: Comparison[] = [];

  // 平均完成时间
  comparisons.push({
    metric: '平均完成时间（分钟）',
    optimized: optimizedStats.avgDuration,
    feature: featureStats.avgDuration,
    difference: optimizedStats.avgDuration - featureStats.avgDuration,
    differencePercent:
      featureStats.avgDuration !== 0
        ? ((optimizedStats.avgDuration - featureStats.avgDuration) /
            featureStats.avgDuration) *
          100
        : 0,
  });

  // NASA-TLX 各项指标
  comparisons.push({
    metric: '心理需求',
    optimized: optimizedStats.avgMentalDemand,
    feature: featureStats.avgMentalDemand,
    difference: optimizedStats.avgMentalDemand - featureStats.avgMentalDemand,
    differencePercent: 0,
  });

  comparisons.push({
    metric: '体力需求',
    optimized: optimizedStats.avgPhysicalDemand,
    feature: featureStats.avgPhysicalDemand,
    difference: optimizedStats.avgPhysicalDemand - featureStats.avgPhysicalDemand,
    differencePercent: 0,
  });

  comparisons.push({
    metric: '时间压力',
    optimized: optimizedStats.avgTemporalDemand,
    feature: featureStats.avgTemporalDemand,
    difference: optimizedStats.avgTemporalDemand - featureStats.avgTemporalDemand,
    differencePercent: 0,
  });

  comparisons.push({
    metric: '自身表现',
    optimized: optimizedStats.avgPerformance,
    feature: featureStats.avgPerformance,
    difference: optimizedStats.avgPerformance - featureStats.avgPerformance,
    differencePercent: 0,
  });

  comparisons.push({
    metric: '努力程度',
    optimized: optimizedStats.avgEffort,
    feature: featureStats.avgEffort,
    difference: optimizedStats.avgEffort - featureStats.avgEffort,
    differencePercent: 0,
  });

  comparisons.push({
    metric: '挫败感',
    optimized: optimizedStats.avgFrustration,
    feature: featureStats.avgFrustration,
    difference: optimizedStats.avgFrustration - featureStats.avgFrustration,
    differencePercent: 0,
  });

  return comparisons;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ui_experiment');
    const results = await db
      .collection('results')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log('Total results from DB:', results.length);
    if (results.length > 0) {
      console.log('Sample result structure:', JSON.stringify(results[0], null, 2));
    }

    // 转换为 ExperimentResult 类型，并过滤掉无效数据
    const experimentResults: ExperimentResult[] = results
      .filter((r: any) => {
        // 调试：检查每条记录的结构
        const hasNasatlx = !!r.nasatlx;
        const nasatlxKeys = r.nasatlx ? Object.keys(r.nasatlx) : [];
        
        // 检查字段名可能是驼峰或下划线格式
        const hasMentalDemand = r.nasatlx && (
          typeof r.nasatlx.mentalDemand === 'number' ||
          typeof r.nasatlx.mental_demand === 'number'
        );
        
        if (!hasNasatlx) {
          console.log('Missing nasatlx:', r._id);
          return false;
        }
        
        if (!hasMentalDemand) {
          console.log('Missing mentalDemand, nasatlx keys:', nasatlxKeys, 'for record:', r._id);
        }

        // 只保留有完整 nasatlx 数据和有效 duration 的记录
        // 支持驼峰和下划线两种命名方式
        const nasatlx = r.nasatlx || {};
        const mentalDemand = nasatlx.mentalDemand ?? nasatlx.mental_demand;
        const physicalDemand = nasatlx.physicalDemand ?? nasatlx.physical_demand;
        const temporalDemand = nasatlx.temporalDemand ?? nasatlx.temporal_demand;
        const performance = nasatlx.performance;
        const effort = nasatlx.effort;
        const frustration = nasatlx.frustration;

        const isValid = (
          typeof mentalDemand === 'number' &&
          typeof physicalDemand === 'number' &&
          typeof temporalDemand === 'number' &&
          typeof performance === 'number' &&
          typeof effort === 'number' &&
          typeof frustration === 'number' &&
          r.duration &&
          r.duration > 0 &&
          r.startTime &&
          r.endTime
        );

        if (!isValid) {
          console.log('Invalid record:', r._id, {
            hasNasatlx,
            mentalDemand: typeof mentalDemand,
            physicalDemand: typeof physicalDemand,
            temporalDemand: typeof temporalDemand,
            performance: typeof performance,
            effort: typeof effort,
            frustration: typeof frustration,
            duration: r.duration,
            startTime: !!r.startTime,
            endTime: !!r.endTime,
          });
        }

        return isValid;
      })
      .map((r: any) => {
        // 支持驼峰和下划线两种命名方式
        const nasatlx = r.nasatlx || {};
        return {
          _id: r._id?.toString() || '',
          version: r.version || 'feature',
          startTime: new Date(r.startTime),
          endTime: new Date(r.endTime),
          duration: r.duration,
          confirmationCode: r.confirmationCode || '',
          nasatlx: {
            mentalDemand: nasatlx.mentalDemand ?? nasatlx.mental_demand ?? 0,
            physicalDemand: nasatlx.physicalDemand ?? nasatlx.physical_demand ?? 0,
            temporalDemand: nasatlx.temporalDemand ?? nasatlx.temporal_demand ?? 0,
            performance: nasatlx.performance ?? 0,
            effort: nasatlx.effort ?? 0,
            frustration: nasatlx.frustration ?? 0,
          },
          createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
        };
      });

    console.log('Filtered results count:', experimentResults.length);

    // 按版本分组
    const optimizedResults = experimentResults.filter(
      (r) => r.version === 'optimized'
    );
    const featureResults = experimentResults.filter(
      (r) => r.version === 'feature'
    );

    // 计算统计数据
    const optimizedStats = calculateStats(optimizedResults);
    const featureStats = calculateStats(featureResults);

    // 计算对比分析
    let comparison: Comparison[] = [];
    if (optimizedStats && featureStats) {
      comparison = calculateComparison(optimizedStats, featureStats);
    }

    // 总体统计
    const totalStats = calculateStats(experimentResults);

    // 返回数据，包括调试信息
    const response = {
      success: true,
      data: {
        total: {
          count: experimentResults.length,
          stats: totalStats,
        },
        optimized: {
          count: optimizedResults.length,
          stats: optimizedStats,
          results: optimizedResults,
        },
        feature: {
          count: featureResults.length,
          stats: featureStats,
          results: featureResults,
        },
        comparison,
      },
      debug: {
        totalFromDB: results.length,
        filteredCount: experimentResults.length,
        optimizedCount: optimizedResults.length,
        featureCount: featureResults.length,
      },
    };

    console.log('Analytics response:', {
      totalFromDB: results.length,
      filteredCount: experimentResults.length,
      optimizedCount: optimizedResults.length,
      featureCount: featureResults.length,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

