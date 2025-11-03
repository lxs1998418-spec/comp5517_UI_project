'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockStudentData } from '@/lib/data';
import { StudentData } from '@/types';

export default function OptimizedDetail() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('optimized_selectedStudent');
    if (stored) {
      setStudent(JSON.parse(stored));
    } else {
      const found = mockStudentData.find((s) => s.id === params.id);
      if (found) setStudent(found);
    }
  }, [params.id]);

  if (!student) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← 返回列表
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">{student.name}</h1>

          {/* 基本信息 */}
          <section className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold mb-4 text-black">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-black">学号:</span>
                <span className="ml-2 font-medium text-black">{student.studentId}</span>
              </div>
              <div>
                <span className="text-black">专业:</span>
                <span className="ml-2 font-medium text-black">{student.major}</span>
              </div>
              <div>
                <span className="text-black">成绩:</span>
                <span className="ml-2 font-medium text-black">{student.grade}</span>
              </div>
              <div>
                <span className="text-black">入学年份:</span>
                <span className="ml-2 font-medium text-black">{student.enrollmentYear}</span>
              </div>
            </div>
          </section>

          {/* 学籍/成绩信息 */}
          <section className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold mb-4 text-black">学籍与成绩</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-black">GPA:</span>
                <span className="ml-2 font-medium text-black">{student.gpa}</span>
              </div>
              <div>
                <span className="text-black">状态:</span>
                <span className="ml-2 font-medium text-black">{student.status}</span>
              </div>
            </div>
          </section>

          {/* 联系方式 */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">联系方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-black">邮箱:</span>
                <span className="ml-2 font-medium text-black">{student.email}</span>
              </div>
              <div>
                <span className="text-black">电话:</span>
                <span className="ml-2 font-medium text-black">{student.phone}</span>
              </div>
              {showMore && (
                <div className="md:col-span-2">
                  <span className="text-black">地址:</span>
                  <span className="ml-2 font-medium text-black">{student.address}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-4 text-blue-600 hover:underline text-sm"
            >
              {showMore ? '收起更多' : '展开更多'}
            </button>
          </section>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sessionStorage.setItem('optimized_detailStudent', JSON.stringify(student));
              router.push('/optimized/form');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            填写表单
          </button>
        </div>
      </div>
    </div>
  );
}

