import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">연동된 계정</h3>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">발행된 포스트</h3>
          <p className="text-3xl font-bold mt-2">128</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">발행 대기중</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
      </div>
      
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 min-h-[400px]">
        <h3 className="text-xl font-semibold mb-6">최근 발행 현황</h3>
        <p className="text-slate-500 italic">최근 활동 내역이 없습니다.</p>
      </div>
    </div>
  );
};

export default Dashboard;
