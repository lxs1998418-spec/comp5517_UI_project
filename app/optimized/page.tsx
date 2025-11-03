'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OptimizedWelcome() {
  const router = useRouter();
  const [startTime] = useState(new Date());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('optimized_startTime', startTime.toISOString());
    }
  }, [startTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">欢迎</h1>
        <p className="text-black mb-8">
          欢迎参与本次实验。请按照提示完成一系列任务。
        </p>
        <button
          onClick={() => router.push('/optimized/search')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          开始
        </button>
      </div>
    </div>
  );
}

