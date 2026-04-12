import React, { useState, useEffect } from 'react';
import { Save, Key } from 'lucide-react';
// @ts-ignore
import { GetSetting, SetSetting } from '../../wailsjs/go/main/App';

const Settings: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [preferredAI, setPreferredAI] = useState('gemini');
  const [textModel, setTextModel] = useState('gemini-2.5-flash');
  const [imageModel, setImageModel] = useState('gemini-2.5-flash-image');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const oKey = await GetSetting('openai_api_key');
      const gKey = await GetSetting('gemini_api_key');
      const cKey = await GetSetting('claude_api_key');
      const pref = await GetSetting('preferred_ai');
      const tMod = await GetSetting('text_model');
      const iMod = await GetSetting('image_model');
      
      setOpenAIKey(oKey || '');
      setGeminiKey(gKey || '');
      setClaudeKey(cKey || '');
      setPreferredAI(pref || 'gemini');
      setTextModel(tMod || 'gemini-2.5-flash');
      setImageModel(iMod || 'gemini-2.5-flash-image');
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await SetSetting('openai_api_key', openAIKey);
      await SetSetting('gemini_api_key', geminiKey);
      await SetSetting('claude_api_key', claudeKey);
      await SetSetting('preferred_ai', preferredAI);
      await SetSetting('text_model', textModel);
      await SetSetting('image_model', imageModel);
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
          <h3 className="text-xl font-bold">AI 엔진 및 모델 설정</h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">기본 AI 엔진</label>
              <select 
                value={preferredAI}
                onChange={(e) => setPreferredAI(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="claude">Anthropic Claude</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">텍스트 모델명</label>
              <input 
                type="text"
                value={textModel}
                onChange={(e) => setTextModel(e.target.value)}
                placeholder="예: gemini-2.0-flash"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">이미지 생성 모델명</label>
            <input 
              type="text"
              value={imageModel}
              onChange={(e) => setImageModel(e.target.value)}
              placeholder="예: dall-e-3 또는 gemini-2.0-flash-image"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-700 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">OpenAI API Key</label>
              <input 
                type="password"
                placeholder="sk-..."
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Gemini API Key</label>
              <input 
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Claude API Key</label>
              <input 
                type="password"
                placeholder="sk-ant-..."
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>
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
