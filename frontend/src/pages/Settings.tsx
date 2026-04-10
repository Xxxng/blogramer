import React, { useState, useEffect } from 'react';
import { Save, Key } from 'lucide-react';
// @ts-ignore
import { GetSetting, SetSetting } from '../../wailsjs/go/main/App';

const Settings: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const key = await GetSetting('openai_api_key');
      setOpenAIKey(key || '');
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await SetSetting('openai_api_key', openAIKey);
      alert('설정이 저장되었습니다.');
    } catch (err) {
      alert('저장 실패: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center space-x-3">
          <Key className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold">API 설정</h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">OpenAI API Key</label>
            <input 
              type="password"
              placeholder="sk-..."
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
            <p className="mt-2 text-xs text-slate-500">
              글 생성 및 주제 분석을 위해 OpenAI API 키가 필요합니다. 키는 로컬 데이터베이스에만 저장됩니다.
            </p>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{saving ? '저장 중...' : '설정 저장하기'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
        <h3 className="text-lg font-bold mb-4">애플리케이션 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-400">버전</span>
            <span>0.1.0 Beta</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-400">데이터베이스</span>
            <span>SQLite 3 (Local)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">프레임워크</span>
            <span>Wails v2 (Go + React)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
