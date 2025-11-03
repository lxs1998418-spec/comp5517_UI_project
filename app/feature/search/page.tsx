'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockStudentData } from '@/lib/data';
import { StudentData } from '@/types';

export default function FeatureSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEnrollmentYear, setSelectedEnrollmentYear] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewDensity, setViewDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const majors = Array.from(new Set(mockStudentData.map((s) => s.major)));
  const grades = Array.from(new Set(mockStudentData.map((s) => s.grade)));
  const statuses = Array.from(new Set(mockStudentData.map((s) => s.status)));
  const enrollmentYears = Array.from(new Set(mockStudentData.map((s) => s.enrollmentYear))).sort((a, b) => b - a);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = mockStudentData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm);
      const matchesMajor = !selectedMajor || student.major === selectedMajor;
      const matchesGrade = !selectedGrade || student.grade === selectedGrade;
      const matchesStatus = !selectedStatus || student.status === selectedStatus;
      const matchesYear = !selectedEnrollmentYear || student.enrollmentYear.toString() === selectedEnrollmentYear;
      return matchesSearch && matchesMajor && matchesGrade && matchesStatus && matchesYear;
    });

    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof StudentData];
      let bVal: any = b[sortBy as keyof StudentData];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedMajor, selectedGrade, selectedStatus, selectedEnrollmentYear, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'bg-yellow-100 text-yellow-800';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-800';
    if (grade.includes('C')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-black';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">学生信息检索与管理</h1>
        
        {/* 顶部工具条 */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="搜索姓名或学号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-black">排序:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="name">姓名</option>
                <option value="studentId">学号</option>
                <option value="gpa">GPA</option>
                <option value="enrollmentYear">入学年份</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-black">视图密度:</label>
              <select
                value={viewDensity}
                onChange={(e) => setViewDensity(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="compact">紧凑</option>
                <option value="comfortable">舒适</option>
                <option value="spacious">宽松</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧多层过滤器 - 全部展开 */}
          <div className="w-80 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-3 text-lg">筛选条件</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">专业分类</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">全部专业</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">成绩等级</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">全部等级</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">学籍状态</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">全部状态</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === 'active' ? '在读' : status === 'graduated' ? '已毕业' : '已停学'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">入学年份</label>
                  <select
                    value={selectedEnrollmentYear}
                    onChange={(e) => setSelectedEnrollmentYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">全部年份</option>
                    {enrollmentYears.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}年
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧表格型列表 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <span className="text-black">
                  共找到 <strong className="text-black">{filteredAndSortedStudents.length}</strong> 条记录
                </span>
              </div>
              <div className={`overflow-x-auto ${viewDensity === 'compact' ? 'p-2' : viewDensity === 'comfortable' ? 'p-4' : 'p-6'}`}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold text-black">姓名</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">学号</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">专业</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">成绩</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">GPA</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">状态</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">入学年份</th>
                      <th className="text-left py-2 px-3 font-semibold text-black">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedStudent(student);
                          sessionStorage.setItem('feature_selectedStudent', JSON.stringify(student));
                          router.push(`/feature/detail/${student.id}`);
                        }}
                      >
                        <td className={`py-2 px-3 text-black ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          {student.name}
                        </td>
                        <td className={`py-2 px-3 text-black ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          {student.studentId}
                        </td>
                        <td className={`py-2 px-3 ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {student.major}
                          </span>
                        </td>
                        <td className={`py-2 px-3 ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          <span className={`px-2 py-1 rounded text-xs ${getGradeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-black ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          {student.gpa}
                        </td>
                        <td className={`py-2 px-3 ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(student.status)}`}>
                            {student.status === 'active' ? '在读' : student.status === 'graduated' ? '已毕业' : '已停学'}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-black ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          {student.enrollmentYear}
                        </td>
                        <td className={`py-2 px-3 ${viewDensity === 'spacious' ? 'py-3' : ''}`}>
                          <button className="text-blue-600 hover:underline text-sm">查看详情</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

