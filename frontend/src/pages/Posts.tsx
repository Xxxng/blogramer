import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Eye, Trash2, Clock } from 'lucide-react';
import { GetAccounts, GeneratePost, PublishPost, GetPosts, DeletePost } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

const Posts: React.FC = () => {
  const [accounts, setAccounts] = useState<models.AccountResponse[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState<models.PostResponse[]>([]);

  useEffect(() => {
    fetchAccounts();
    fetchPosts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await GetAccounts();
      setAccounts(data || []);
      if (data && data.length > 0) setSelectedAccount(data[0].id);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await GetPosts();
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedAccount || !keyword) {
      alert('계정과 키워드를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      await GeneratePost(1, selectedAccount); 
      alert('포스팅 생성 완료!');
      setKeyword('');
      fetchPosts();
    } catch (err) {
      alert('생성 실패: ' + err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await DeletePost(id);
        fetchPosts();
      } catch (err) {
        alert('삭제 실패: ' + err);
      }
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await PublishPost(id);
      alert('발행 완료!');
      fetchPosts();
    } catch (err) {
      alert('발행 실패: ' + err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">포스팅 관리</h3>
        <div className="flex space-x-3">
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>계정 선택</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>[{acc.platform}] {acc.account_name}</option>
            ))}
          </select>
          <div className="relative">
            <input 
              type="text"
              placeholder="생성할 키워드 입력..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              isGenerating 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20'
            }`}
          >
            <Sparkles size={18} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'AI 생성 중...' : 'AI 포스팅 생성'}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">제목</th>
              <th className="px-6 py-4">플랫폼</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4">발행일</th>
              <th className="px-6 py-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{post.platform}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      post.status === 'published' ? 'bg-green-900 text-green-200' :
                      post.status === 'draft' ? 'bg-amber-900 text-amber-200' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{post.published_at || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 transition-colors" title="미리보기 및 편집">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handlePublish(post.id)}
                      className="p-2 hover:bg-blue-600/20 rounded-lg text-blue-400 transition-colors" 
                      title="즉시 발행"
                    >
                      <Send size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors" 
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                  생성된 포스팅이 없습니다. 상단의 AI 생성 버튼을 눌러 시작하세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posts;
