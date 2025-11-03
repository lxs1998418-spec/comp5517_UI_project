'use client';

import { useState } from 'react';

interface NASA_TLXProps {
  onSubmit: (scores: {
    mentalDemand: number;
    physicalDemand: number;
    temporalDemand: number;
    performance: number;
    effort: number;
    frustration: number;
  }) => void;
}

export default function NASA_TLX({ onSubmit }: NASA_TLXProps) {
  const [scores, setScores] = useState({
    mentalDemand: 0,
    physicalDemand: 0,
    temporalDemand: 0,
    performance: 0,
    effort: 0,
    frustration: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scores);
  };

  const updateScore = (key: keyof typeof scores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  // 星星评分组件
  const StarRating = ({
    label,
    question,
    value,
    onChange,
    anchors,
  }: {
    label: string;
    question: string;
    value: number;
    onChange: (value: number) => void;
    anchors: { left: string; right: string };
  }) => {
    // 将分值转换为星星数量：0=1颗星, 25=2颗星, 50=3颗星, 75=4颗星, 100=5颗星
    const valueToStars = (score: number): number => {
      if (score === 0) return 1;
      if (score === 25) return 2;
      if (score === 50) return 3;
      if (score === 75) return 4;
      if (score === 100) return 5;
      return 1; // 默认1颗星
    };

    // 将星星数量转换为分值：1颗星=0, 2颗星=25, 3颗星=50, 4颗星=75, 5颗星=100
    const starsToValue = (stars: number): number => {
      if (stars === 1) return 0;
      if (stars === 2) return 25;
      if (stars === 3) return 50;
      if (stars === 4) return 75;
      if (stars === 5) return 100;
      return 0;
    };

    const currentStars = valueToStars(value);
    const values = [0, 25, 50, 75, 100];
    const starLabels = ['0', '25', '50', '75', '100'];

    return (
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <label className="block text-lg font-semibold mb-2 text-black">{label}</label>
        <p className="text-black mb-4">{question}</p>
        
        {/* 锚点标签 */}
        <div className="flex justify-between text-sm text-black mb-4">
          <span>{anchors.left}</span>
          <span>{anchors.right}</span>
        </div>

        {/* 星星评分 - 累加式显示：1颗星=0, 2颗星=25, 3颗星=50, 4颗星=75, 5颗星=100 */}
        <div className="flex justify-center items-center gap-3 mb-4">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const starValue = starsToValue(starNum); // 0, 25, 50, 75, 100
            // 如果当前星星数大于等于这颗星的编号，就显示为选中
            const isSelected = currentStars >= starNum;
            
            return (
              <div key={starNum} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange(starValue)}
                  className={`text-5xl transition-all hover:scale-125 focus:outline-none ${
                    isSelected ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  aria-label={`选择${starValue}分`}
                >
                  ★
                </button>
                <span className={`text-xs ${value === starValue ? 'font-bold text-blue-600' : 'text-black'}`}>
                  {starLabels[starNum - 1]}
                </span>
              </div>
            );
          })}
        </div>

        {/* 当前选中值 */}
        <div className="text-center mt-3">
          <span className="text-lg font-bold text-blue-600">当前值: {value}</span>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">NASA-TLX 工作负荷评估</h2>
      
      <StarRating
        label="1. 心理需求 (Mental Demand)"
        question="整体来看，完成本次任务所需的思考、注意、决策与记忆负担有多大？"
        value={scores.mentalDemand}
        onChange={(val) => updateScore('mentalDemand', val)}
        anchors={{ left: '非常低', right: '非常高' }}
      />

      <StarRating
        label="2. 体力需求 (Physical Demand)"
        question="整体来看，鼠标/手指操作等体力负担有多大？"
        value={scores.physicalDemand}
        onChange={(val) => updateScore('physicalDemand', val)}
        anchors={{ left: '非常低', right: '非常高' }}
      />

      <StarRating
        label="3. 时间压力 (Temporal Demand)"
        question="整体而言，您是否感到时间紧迫或节奏过快？"
        value={scores.temporalDemand}
        onChange={(val) => updateScore('temporalDemand', val)}
        anchors={{ left: '非常从容', right: '极度紧迫' }}
      />

      <StarRating
        label="4. 自身表现 (Performance)"
        question="整体而言，您对自己的完成质量有多满意？（分数越高代表越不满意）"
        value={scores.performance}
        onChange={(val) => updateScore('performance', val)}
        anchors={{ left: '非常满意', right: '非常不满意' }}
      />

      <StarRating
        label="5. 努力程度 (Effort)"
        question="整体而言，为达到当前的任务完成水平，您付出了多大努力？"
        value={scores.effort}
        onChange={(val) => updateScore('effort', val)}
        anchors={{ left: '非常低', right: '非常高' }}
      />

      <StarRating
        label="6. 挫败感 (Frustration)"
        question="整体而言，您感到多沮丧、焦虑、烦躁或受挫？"
        value={scores.frustration}
        onChange={(val) => updateScore('frustration', val)}
        anchors={{ left: '非常平静、满足', right: '极度沮丧、烦躁' }}
      />

      <div className="text-center mt-8">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          提交问卷
        </button>
      </div>
    </form>
  );
}

