import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-black">
          UI Optimization Experiment
        </h1>
        <p className="text-lg text-black">
          选择实验版本
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/optimized"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            优化版 (Optimized-UI)
          </Link>
          <Link
            href="/feature"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            对照版 (Feature-UI)
          </Link>
          <Link
            href="/analytics"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            数据分析
          </Link>
        </div>
      </div>
    </div>
  );
}

