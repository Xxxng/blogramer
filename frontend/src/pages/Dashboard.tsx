import React, { useState, useEffect } from 'react';
import { GetDashboardStats } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<models.DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await GetDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">연동된 계정</h3>
          <p className="text-3xl font-bold mt-2">{stats?.account_count || 0}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">발행된 포스트</h3>
          <p className="text-3xl font-bold mt-2">{stats?.published_count || 0}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium">발행 대기중</h3>
          <p className="text-3xl font-bold mt-2">{stats?.draft_count || 0}</p>
        </div>
      </div>
      
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 min-h-[400px]">
        <h3 className="text-xl font-semibold mb-6">최근 발행 현황</h3>
        {stats?.recent_posts && stats.recent_posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">제목</th>
                  <th className="px-4 py-3">플랫폼</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {stats.recent_posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4 font-medium truncate max-w-xs">{post.title}</td>
                    <td className="px-4 py-4 text-sm text-slate-400">{post.platform}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        post.status === 'published' ? 'bg-green-900 text-green-200' :
                        post.status === 'draft' ? 'bg-amber-900 text-amber-200' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-400">{post.published_at || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 italic">최근 활동 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
