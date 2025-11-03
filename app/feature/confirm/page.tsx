'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeatureConfirm() {
  const router = useRouter();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const startTime = sessionStorage.getItem('feature_startTime');
    const endTime = new Date().toISOString();
    
    if (startTime) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setConfirmationCode(code);
      sessionStorage.setItem('feature_confirmationCode', code);
      sessionStorage.setItem('feature_endTime', endTime);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    router.push('/feature/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 多个信息面板 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">提交状态</h3>
              <p className="text-sm text-blue-800">您的数据已成功提交到系统数据库</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">处理状态</h3>
              <p className="text-sm text-green-800">数据正在处理中，预计1-2分钟完成</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b">
            <h1 className="text-3xl font-bold mb-4">提交完成</h1>
            <p className="text-black mb-4">
              您的表单数据已成功提交。以下是您的确认信息：
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-black mb-2">确认码</p>
              <div className="flex items-center gap-2">
                <code className="text-xl font-mono bg-white px-4 py-2 rounded border">
                  {confirmationCode}
                </code>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold mb-3">后续操作建议</h3>
            <ul className="space-y-2 text-sm text-black">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>请保存您的确认码，以便后续查询使用</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>您可以通过确认码在系统中查询提交的数据</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>如有任何问题，请联系系统管理员</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              继续完成问卷
            </button>
            <button
              onClick={() => router.push('/feature/search')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              返回目录
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

