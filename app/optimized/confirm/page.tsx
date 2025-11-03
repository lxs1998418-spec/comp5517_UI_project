'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OptimizedConfirm() {
  const router = useRouter();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const startTime = sessionStorage.getItem('optimized_startTime');
    const endTime = new Date().toISOString();
    
    if (startTime) {
      // 这里应该调用API保存结果，但为了演示先生成确认码
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setConfirmationCode(code);
      sessionStorage.setItem('optimized_confirmationCode', code);
      sessionStorage.setItem('optimized_endTime', endTime);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    router.push('/optimized/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">提交成功</h1>
          <p className="text-black">您的数据已成功提交</p>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-black mb-2">确认码</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-2xl font-bold text-green-700 font-mono">
              {confirmationCode}
            </code>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            继续问卷
          </button>
          <button
            onClick={() => router.push('/optimized/search')}
            className="w-full py-2 text-black hover:text-black"
          >
            返回目录
          </button>
        </div>
      </div>
    </div>
  );
}

