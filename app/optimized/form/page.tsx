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

export default function OptimizedForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
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
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('optimized_detailStudent');
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

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = '姓名必填';
      if (!formData.studentId) newErrors.studentId = '学号必填';
    } else if (step === 2) {
      if (!formData.major) newErrors.major = '专业必填';
      if (!formData.grade) newErrors.grade = '成绩必填';
      if (!formData.enrollmentYear) newErrors.enrollmentYear = '入学年份必填';
    } else if (step === 3) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
      if (!formData.phone || !/^\d{11}$/.test(formData.phone)) {
        newErrors.phone = '请输入11位手机号码';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowPreview(true);
      }
    }
  };

  const handleSubmit = () => {
    // 存储表单数据
    sessionStorage.setItem('optimized_formData', JSON.stringify(formData));
    router.push('/optimized/confirm');
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">预览摘要</h2>
          <div className="space-y-2 mb-6 text-black">
            <p><strong>姓名:</strong> {formData.name}</p>
            <p><strong>学号:</strong> {formData.studentId}</p>
            <p><strong>专业:</strong> {formData.major}</p>
            <p><strong>成绩:</strong> {formData.grade}</p>
            <p><strong>邮箱:</strong> {formData.email}</p>
            <p><strong>电话:</strong> {formData.phone}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg"
            >
              返回修改
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              确认提交
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-black">
            <span>基础字段</span>
            <span>学术信息</span>
            <span>联系确认</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Step 1: 基础字段</h2>
              <div>
                <label className="block text-sm font-medium mb-1">姓名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
                <p className="text-xs text-black mt-1">请输入学生姓名</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">学号 *</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.studentId && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Step 2: 学术信息</h2>
              <div>
                <label className="block text-sm font-medium mb-1">专业 *</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => updateField('major', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.major && (
                  <p className="text-red-500 text-sm mt-1">{errors.major}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">成绩 *</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => updateField('grade', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.grade && (
                  <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">入学年份 *</label>
                <input
                  type="number"
                  value={formData.enrollmentYear}
                  onChange={(e) => updateField('enrollmentYear', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.enrollmentYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.enrollmentYear && (
                  <p className="text-red-500 text-sm mt-1">{errors.enrollmentYear}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Step 3: 联系与确认</h2>
              <div>
                <label className="block text-sm font-medium mb-1">邮箱 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-black mt-1">请输入有效的邮箱地址</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">电话 *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-black mt-1">请输入11位手机号码</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {currentStep === 3 ? '预览' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

