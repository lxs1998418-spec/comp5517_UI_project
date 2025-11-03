'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentData } from '@/types';

interface FormData {
  name: string;
  studentId: string;
  major: string;
  grade: string;
  email: string;
  phone: string;
  address: string;
  enrollmentYear: string;
  gpa: string;
  status: string;
}

export default function FeatureForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    studentId: '',
    major: '',
    grade: '',
    email: '',
    phone: '',
    address: '',
    enrollmentYear: '',
    gpa: '',
    status: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('feature_detailStudent');
    if (stored) {
      const student: StudentData = JSON.parse(stored);
      setFormData({
        name: student.name || '',
        studentId: student.studentId || '',
        major: student.major || '',
        grade: student.grade || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        enrollmentYear: student.enrollmentYear?.toString() || '',
        gpa: student.gpa?.toString() || '',
        status: student.status || '',
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!formData.name) validationErrors.push('姓名字段为必填项，请输入学生姓名');
    if (!formData.studentId) validationErrors.push('学号字段为必填项，请输入学生学号');
    if (!formData.major) validationErrors.push('专业字段为必填项，请选择或输入专业名称');
    if (!formData.grade) validationErrors.push('成绩等级字段为必填项，请选择成绩等级');
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push('电子邮箱地址格式不正确，请检查输入');
    }
    if (!formData.phone || !/^\d{11}$/.test(formData.phone)) {
      validationErrors.push('手机号码格式不正确，请输入11位数字');
    }
    if (!formData.enrollmentYear) validationErrors.push('入学年份字段为必填项');
    if (!formData.gpa) validationErrors.push('GPA字段为必填项');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      alert('表单验证失败：\n' + validationErrors.join('\n'));
      return;
    }

    setErrors([]);
    sessionStorage.setItem('feature_formData', JSON.stringify(formData));
    router.push('/feature/confirm');
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">学生信息录入表单</h1>
          <p className="text-black mb-6">
            请填写以下所有字段。带*号的字段为必填项。高级选项默认可见。
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-black">基本信息部分</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    学生姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, name: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="请输入学生姓名"
                  />
                  <p className="text-xs text-black mt-1">此字段用于标识学生的唯一姓名信息</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    学生学号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, studentId: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="请输入学号"
                  />
                  <p className="text-xs text-black mt-1">学号格式：数字或字母数字组合</p>
                </div>
              </div>
            </section>

            {/* 学术信息 */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-black">学术成绩与学籍信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    专业名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, major: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="例如：计算机科学"
                  />
                  <p className="text-xs text-black mt-1">学生所属的专业或学科领域</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    成绩等级 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, grade: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  >
                    <option value="">请选择</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    入学年份 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.enrollmentYear}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, enrollmentYear: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="例如：2021"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    平均绩点 (GPA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.gpa}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, gpa: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="例如：3.8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    学籍状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, status: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  >
                    <option value="active">在读</option>
                    <option value="graduated">已毕业</option>
                    <option value="suspended">已停学</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 联系方式 */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-black">联系方式信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    电子邮箱地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, email: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="example@email.com"
                  />
                  <p className="text-xs text-black mt-1">请输入有效的电子邮箱地址格式</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    手机号码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, phone: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="11位手机号码"
                  />
                  <p className="text-xs text-black mt-1">请输入11位数字手机号码</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">
                    居住地址
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, address: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="请输入详细地址"
                  />
                </div>
              </div>
            </section>

            {/* 高级选项 - 默认可见 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">高级配置选项</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-black mb-2">高级选项区域（默认可见）</p>
                <p className="text-xs text-black">
                  此区域包含额外的配置选项和高级设置，可根据需要进行调整。
                </p>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                提交表单
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

