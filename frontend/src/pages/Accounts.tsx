import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { GetAccounts, AddAccount, DeleteAccount } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<models.AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState<models.AccountRequest>(new models.AccountRequest({
    platform: 'Tistory',
    account_name: '',
    site_url: '',
    access_token: '',
    app_password: ''
  }));

  const platforms = ['Tistory', 'WordPress', 'Naver', 'Blogger'];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await GetAccounts();
      setAccounts(data || []);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AddAccount(newAccount);
      setShowAddModal(false);
      setNewAccount(new models.AccountRequest({
        platform: 'Tistory',
        account_name: '',
        site_url: '',
        access_token: '',
        app_password: ''
      }));
      fetchAccounts();
    } catch (err) {
      alert('계정 추가 실패: ' + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await DeleteAccount(id);
        fetchAccounts();
      } catch (err) {
        alert('삭제 실패: ' + err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">블로그 계정 목록</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={18} />
          <span>계정 추가</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl relative group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                acc.platform === 'Tistory' ? 'bg-orange-900 text-orange-200' :
                acc.platform === 'WordPress' ? 'bg-blue-900 text-blue-200' :
                'bg-slate-700 text-slate-200'
              }`}>
                {acc.platform}
              </span>
              <button 
                onClick={() => handleDelete(acc.id)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h4 className="text-lg font-bold mb-1">{acc.account_name}</h4>
            <p className="text-slate-400 text-sm truncate mb-4">{acc.site_url}</p>
            <div className="flex items-center text-xs text-blue-400 hover:underline cursor-pointer">
              <ExternalLink size={14} className="mr-1" />
              블로그 바로가기
            </div>
          </div>
        ))}
        
        {accounts.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            연동된 계정이 없습니다. 새로운 계정을 추가해 보세요.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold">새 블로그 계정 추가</h3>
            </div>
            <form onSubmit={handleAddAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">플랫폼 선택</label>
                <select 
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount(new models.AccountRequest({...newAccount, platform: e.target.value as models.Platform}))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">계정 별칭 (관리용)</label>
                <input 
                  type="text"
                  required
                  placeholder="예: 티스토리 메인"
                  value={newAccount.account_name}
                  onChange={(e) => setNewAccount(new models.AccountRequest({...newAccount, account_name: e.target.value}))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">블로그 URL / ID</label>
                <input 
                  type="text"
                  required
                  placeholder="티스토리: 블로그이름, 워드프레스: 도메인"
                  value={newAccount.site_url}
                  onChange={(e) => setNewAccount(new models.AccountRequest({...newAccount, site_url: e.target.value}))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Access Token / API Key</label>
                <input 
                  type="password"
                  required
                  value={newAccount.access_token}
                  onChange={(e) => setNewAccount(new models.AccountRequest({...newAccount, access_token: e.target.value}))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              {newAccount.platform === 'WordPress' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">App Password</label>
                  <input 
                    type="password"
                    value={newAccount.app_password}
                    onChange={(e) => setNewAccount(new models.AccountRequest({...newAccount, app_password: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
