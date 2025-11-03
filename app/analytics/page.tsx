'use client';

import { useState, useEffect } from 'react';
import { ExperimentResult } from '@/types';

export default function Analytics() {
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/results');
      const data = await response.json();
      if (data.success) {
        setResults(data.results || []);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      setError('获取数据时发生错误');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const optimizedResults = results.filter((r) => r.version === 'optimized');
  const featureResults = results.filter((r) => r.version === 'feature');

  const calculateAverage = (values: number[]) => {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const calculateStats = (results: ExperimentResult[]) => {
    if (results.length === 0) return null;

    return {
      count: results.length,
      avgDuration: calculateAverage(results.map((r) => r.duration / 1000 / 60)), // 分钟
      avgMentalDemand: calculateAverage(results.map((r) => r.nasatlx.mentalDemand)),
      avgPhysicalDemand: calculateAverage(results.map((r) => r.nasatlx.physicalDemand)),
      avgTemporalDemand: calculateAverage(results.map((r) => r.nasatlx.temporalDemand)),
      avgPerformance: calculateAverage(results.map((r) => r.nasatlx.performance)),
      avgEffort: calculateAverage(results.map((r) => r.nasatlx.effort)),
      avgFrustration: calculateAverage(results.map((r) => r.nasatlx.frustration)),
    };
  };

  const optimizedStats = calculateStats(optimizedResults);
  const featureStats = calculateStats(featureResults);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">数据分析页面</h1>
          <p className="text-black">实验数据统计与分析</p>
          <button
            onClick={fetchResults}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            刷新数据
          </button>
        </div>

        {/* 总览统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">优化版 (Optimized-UI)</h2>
            {optimizedStats ? (
              <div className="space-y-2">
                <p><strong>样本数:</strong> {optimizedStats.count}</p>
                <p><strong>平均完成时间:</strong> {optimizedStats.avgDuration.toFixed(2)} 分钟</p>
                <p><strong>平均心理需求:</strong> {optimizedStats.avgMentalDemand.toFixed(1)}</p>
                <p><strong>平均体力需求:</strong> {optimizedStats.avgPhysicalDemand.toFixed(1)}</p>
                <p><strong>平均时间压力:</strong> {optimizedStats.avgTemporalDemand.toFixed(1)}</p>
                <p><strong>平均自身表现:</strong> {optimizedStats.avgPerformance.toFixed(1)}</p>
                <p><strong>平均努力程度:</strong> {optimizedStats.avgEffort.toFixed(1)}</p>
                <p><strong>平均挫败感:</strong> {optimizedStats.avgFrustration.toFixed(1)}</p>
              </div>
            ) : (
              <p className="text-black">暂无数据</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">对照版 (Feature-UI)</h2>
            {featureStats ? (
              <div className="space-y-2">
                <p><strong>样本数:</strong> {featureStats.count}</p>
                <p><strong>平均完成时间:</strong> {featureStats.avgDuration.toFixed(2)} 分钟</p>
                <p><strong>平均心理需求:</strong> {featureStats.avgMentalDemand.toFixed(1)}</p>
                <p><strong>平均体力需求:</strong> {featureStats.avgPhysicalDemand.toFixed(1)}</p>
                <p><strong>平均时间压力:</strong> {featureStats.avgTemporalDemand.toFixed(1)}</p>
                <p><strong>平均自身表现:</strong> {featureStats.avgPerformance.toFixed(1)}</p>
                <p><strong>平均努力程度:</strong> {featureStats.avgEffort.toFixed(1)}</p>
                <p><strong>平均挫败感:</strong> {featureStats.avgFrustration.toFixed(1)}</p>
              </div>
            ) : (
              <p className="text-black">暂无数据</p>
            )}
          </div>
        </div>

        {/* 对比分析 */}
        {optimizedStats && featureStats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">对比分析</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left">指标</th>
                    <th className="border p-3 text-left">优化版</th>
                    <th className="border p-3 text-left">对照版</th>
                    <th className="border p-3 text-left">差异</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-medium text-black">平均完成时间（分钟）</td>
                    <td className="border p-3 text-black">{optimizedStats.avgDuration.toFixed(2)}</td>
                    <td className="border p-3 text-black">{featureStats.avgDuration.toFixed(2)}</td>
                    <td className="border p-3 text-black">
                      {((optimizedStats.avgDuration - featureStats.avgDuration) / featureStats.avgDuration * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">心理需求</td>
                    <td className="border p-3 text-black">{optimizedStats.avgMentalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgMentalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgMentalDemand - featureStats.avgMentalDemand).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">体力需求</td>
                    <td className="border p-3 text-black">{optimizedStats.avgPhysicalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgPhysicalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgPhysicalDemand - featureStats.avgPhysicalDemand).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">时间压力</td>
                    <td className="border p-3 text-black">{optimizedStats.avgTemporalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgTemporalDemand.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgTemporalDemand - featureStats.avgTemporalDemand).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">自身表现</td>
                    <td className="border p-3 text-black">{optimizedStats.avgPerformance.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgPerformance.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgPerformance - featureStats.avgPerformance).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">努力程度</td>
                    <td className="border p-3 text-black">{optimizedStats.avgEffort.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgEffort.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgEffort - featureStats.avgEffort).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">挫败感</td>
                    <td className="border p-3 text-black">{optimizedStats.avgFrustration.toFixed(1)}</td>
                    <td className="border p-3 text-black">{featureStats.avgFrustration.toFixed(1)}</td>
                    <td className="border p-3 text-black">
                      {(optimizedStats.avgFrustration - featureStats.avgFrustration).toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 详细数据列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">详细数据记录</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">版本</th>
                  <th className="border p-2 text-left">开始时间</th>
                  <th className="border p-2 text-left">完成时间</th>
                  <th className="border p-2 text-left">耗时（分钟）</th>
                  <th className="border p-2 text-left">确认码</th>
                  <th className="border p-2 text-left">心理需求</th>
                  <th className="border p-2 text-left">体力需求</th>
                  <th className="border p-2 text-left">时间压力</th>
                  <th className="border p-2 text-left">自身表现</th>
                  <th className="border p-2 text-left">努力程度</th>
                  <th className="border p-2 text-left">挫败感</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.version === 'optimized' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {result.version === 'optimized' ? '优化版' : '对照版'}
                      </span>
                    </td>
                    <td className="border p-2 text-black">
                      {new Date(result.startTime).toLocaleString('zh-CN')}
                    </td>
                    <td className="border p-2 text-black">
                      {new Date(result.endTime).toLocaleString('zh-CN')}
                    </td>
                    <td className="border p-2 text-black">
                      {(result.duration / 1000 / 60).toFixed(2)}
                    </td>
                    <td className="border p-2 font-mono text-xs text-black">
                      {result.confirmationCode}
                    </td>
                    <td className="border p-2 text-black">{result.nasatlx.mentalDemand}</td>
                    <td className="border p-2 text-black">{result.nasatlx.physicalDemand}</td>
                    <td className="border p-2 text-black">{result.nasatlx.temporalDemand}</td>
                    <td className="border p-2 text-black">{result.nasatlx.performance}</td>
                    <td className="border p-2 text-black">{result.nasatlx.effort}</td>
                    <td className="border p-2 text-black">{result.nasatlx.frustration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 hover:underline"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}

