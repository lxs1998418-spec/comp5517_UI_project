'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeatureWelcome() {
  const router = useRouter();
  const [startTime] = useState(new Date());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('feature_startTime', startTime.toISOString());
    }
  }, [startTime]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto mt-8">
        {/* 多信息面板 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
            <div className="flex items-center mb-2">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">最新更新</span>
              <span className="text-xs text-black">2024-01-15</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">系统版本更新</h3>
            <p className="text-xs text-black">系统已更新至v2.0，新增多项功能...</p>
          </div>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
            <div className="flex items-center mb-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded mr-2">系统公告</span>
              <span className="text-xs text-black">重要</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">维护通知</h3>
            <p className="text-xs text-black">系统将于本周末进行维护，请提前保存数据...</p>
          </div>
          
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
            <div className="flex items-center mb-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">技巧</span>
              <span className="text-xs text-black">新手指南</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">使用技巧</h3>
            <p className="text-xs text-black">点击右上角设置可自定义界面布局...</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-black mb-4 text-center">欢迎使用实验系统</h1>
          <p className="text-black mb-8 text-center">
            欢迎参与本次实验。请按照提示完成各项任务。
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">实验说明</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>请按照提示完成各项任务</li>
              <li>所有操作将被记录用于数据分析</li>
              <li>如有疑问请联系实验管理员</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/feature/search')}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-lg"
            >
              开始实验
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

