'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NASA_TLX from '@/components/NASA-TLX';

export default function OptimizedQuestionnaire() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (scores: {
    mentalDemand: number;
    physicalDemand: number;
    temporalDemand: number;
    performance: number;
    effort: number;
    frustration: number;
  }) => {
    const startTime = sessionStorage.getItem('optimized_startTime');
    const endTime = sessionStorage.getItem('optimized_endTime') || new Date().toISOString();
    
    if (startTime) {
      try {
        const response = await fetch('/api/experiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            version: 'optimized',
            startTime,
            endTime,
            nasatlx: scores,
          }),
        });

        if (response.ok) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Failed to submit:', error);
        alert('提交失败，请重试');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">感谢参与</h1>
          <p className="text-black mb-6">
            您的问卷已成功提交。感谢您参与本次实验！
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <NASA_TLX onSubmit={handleSubmit} />
    </div>
  );
}

