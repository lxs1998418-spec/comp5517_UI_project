'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockStudentData } from '@/lib/data';
import { StudentData } from '@/types';

export default function FeatureDetail() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('feature_selectedStudent');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'graduated': return 'bg-blue-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'bg-yellow-500';
    if (grade.includes('B')) return 'bg-blue-500';
    if (grade.includes('C')) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← 返回列表
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h1 className="text-4xl font-bold">{student.name}</h1>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(student.status)}`}>
                {student.status === 'active' ? '在读' : student.status === 'graduated' ? '已毕业' : '已停学'}
              </span>
              <span className={`px-3 py-1 rounded text-white text-sm ${getGradeColor(student.grade)}`}>
                {student.grade}
              </span>
            </div>
          </div>

          {/* 完整信息表格同时展示 */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <label className="block text-xs text-blue-600 mb-1 font-medium">学号</label>
                <p className="text-lg font-bold text-black">{student.studentId}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <label className="block text-xs text-green-600 mb-1 font-medium">专业</label>
                <p className="text-lg font-bold text-black">{student.major}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <label className="block text-xs text-yellow-600 mb-1 font-medium">成绩等级</label>
                <p className="text-lg font-bold text-black">{student.grade}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <label className="block text-xs text-purple-600 mb-1 font-medium">GPA</label>
                <p className="text-lg font-bold text-black">{student.gpa}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left font-semibold text-black">信息类别</th>
                    <th className="border p-3 text-left font-semibold text-black">详细内容</th>
                    <th className="border p-3 text-left font-semibold text-black">标签分类</th>
                    <th className="border p-3 text-left font-semibold text-black">备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-medium text-black">基本信息</td>
                    <td className="border p-3 text-black">{student.name}</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">个人</span>
                    </td>
                    <td className="border p-3 text-sm text-black">学生姓名</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">学籍信息</td>
                    <td className="border p-3 text-black">{student.enrollmentYear}年入学</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">学籍</span>
                    </td>
                    <td className="border p-3 text-sm text-black">入学年份</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">学术成绩</td>
                    <td className="border p-3 text-black">GPA: {student.gpa}</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">成绩</span>
                    </td>
                    <td className="border p-3 text-sm text-black">平均绩点</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">联系方式</td>
                    <td className="border p-3 text-black">{student.email}</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">联系</span>
                    </td>
                    <td className="border p-3 text-sm text-black">电子邮箱地址</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">联系方式</td>
                    <td className="border p-3 text-black">{student.phone}</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">联系</span>
                    </td>
                    <td className="border p-3 text-sm text-black">手机号码</td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium text-black">地址信息</td>
                    <td className="border p-3 text-black">{student.address}</td>
                    <td className="border p-3">
                      <span className="px-2 py-1 bg-gray-100 text-black rounded text-xs">地址</span>
                    </td>
                    <td className="border p-3 text-sm text-black">居住地址</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sessionStorage.setItem('feature_detailStudent', JSON.stringify(student));
              router.push('/feature/form');
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            填写表单
          </button>
        </div>
      </div>
    </div>
  );
}

