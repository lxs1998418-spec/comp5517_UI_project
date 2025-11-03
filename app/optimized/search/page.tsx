'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudentData } from '@/lib/data';
import { StudentData } from '@/types';

export default function OptimizedSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const majors = Array.from(new Set(mockStudentData.map((s) => s.major)));
  const grades = Array.from(new Set(mockStudentData.map((s) => s.grade)));

  const filteredStudents = useMemo(() => {
    return mockStudentData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm);
      const matchesMajor = !selectedMajor || student.major === selectedMajor;
      const matchesGrade = !selectedGrade || student.grade === selectedGrade;
      return matchesSearch && matchesMajor && matchesGrade;
    });
  }, [searchTerm, selectedMajor, selectedGrade]);

  const activeFilters = [
    selectedMajor && { label: `专业: ${selectedMajor}`, onRemove: () => setSelectedMajor('') },
    selectedGrade && { label: `成绩: ${selectedGrade}`, onRemove: () => setSelectedGrade('') },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">学生信息检索</h1>
        
        {/* 搜索框 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="搜索姓名或学号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧筛选 */}
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-3">基本筛选</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-black mb-1">专业</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">全部</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-black mb-1">成绩</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">全部</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                {showAdvanced ? '收起' : '更多筛选'} ▼
              </button>
            </div>
          </div>

          {/* 右侧列表 */}
          <div className="flex-1">
            {/* 结果统计和筛选标签 */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-black">
                找到 <strong>{filteredStudents.length}</strong> 条结果
              </span>
              {activeFilters.map((filter, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {filter.label}
                  <button
                    onClick={filter.onRemove}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* 学生卡片列表 */}
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    sessionStorage.setItem('optimized_selectedStudent', JSON.stringify(student));
                    router.push(`/optimized/detail/${student.id}`);
                  }}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-black text-sm mt-1">
                        学号: {student.studentId} | 专业: {student.major} | 成绩: {student.grade}
                      </p>
                    </div>
                    <span className="text-xs text-black">查看详情 →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

