import React, { useState, useEffect } from 'react';
import { Save, Key } from 'lucide-react';
// @ts-ignore
import { GetSetting, SetSetting } from '../../wailsjs/go/main/App';

const Settings: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  
  const [textProvider, setTextProvider] = useState('gemini');
  const [textModel, setTextModel] = useState('gemini-2.5-flash');
  
  const [imageProvider, setImageProvider] = useState('gemini');
  const [imageModel, setImageModel] = useState('gemini-2.5-flash-image');
  
  const [saving, setSaving] = useState(false);

  const textModels: Record<string, string[]> = {
    openai: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini'],
    gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash-preview', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview'],
    claude: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest']
  };

  const imageModels: Record<string, string[]> = {
    openai: ['dall-e-3', 'dall-e-2'],
    gemini: ['gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image-preview']
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [oKey, gKey, cKey, tProv, tMod, iProv, iMod] = await Promise.all([
        GetSetting('openai_api_key'),
        GetSetting('gemini_api_key'),
        GetSetting('claude_api_key'),
        GetSetting('preferred_ai'),
        GetSetting('text_model'),
        GetSetting('image_provider'),
        GetSetting('image_model')
      ]);
      
      setOpenAIKey(oKey || '');
      setGeminiKey(gKey || '');
      setClaudeKey(cKey || '');
      
      const currentTProv = tProv || 'gemini';
      setTextProvider(currentTProv);
      // 저장된 모델이 유효하지 않으면 엔진별 기본 모델 선택
      const validTextModels = textModels[currentTProv] || textModels['gemini'];
      setTextModel(tMod && validTextModels.includes(tMod) ? tMod : validTextModels[0]);
      
      const currentIProv = iProv || 'gemini';
      setImageProvider(currentIProv);
      const validImageModels = imageModels[currentIProv] || imageModels['gemini'];
      setImageModel(iMod && validImageModels.includes(iMod) ? iMod : validImageModels[0]);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        SetSetting('openai_api_key', openAIKey),
        SetSetting('gemini_api_key', geminiKey),
        SetSetting('claude_api_key', claudeKey),
        SetSetting('preferred_ai', textProvider),
        SetSetting('text_model', textModel),
        SetSetting('image_provider', imageProvider),
        SetSetting('image_model', imageModel)
      ]);
      alert('설정이 저장되었습니다.');
    } catch (err) {
      alert('저장 실패: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 pb-12">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex items-center space-x-3">
          <Key className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold">AI 엔진 및 모델 설정</h3>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Text AI Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider">텍스트 생성 (본문 작성)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">엔진 선택</label>
                <select 
                  value={textProvider}
                  onChange={(e) => {
                    setTextProvider(e.target.value);
                    setTextModel(textModels[e.target.value][0]);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Anthropic Claude</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">모델 선택</label>
                <select 
                  value={textModel}
                  onChange={(e) => setTextModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono"
                >
                  {textModels[textProvider].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image AI Section */}
          <div className="space-y-4 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider">이미지 생성 (헤더 이미지)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">엔진 선택</label>
                <select 
                  value={imageProvider}
                  onChange={(e) => {
                    setImageProvider(e.target.value);
                    setImageModel(imageModels[e.target.value][0]);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                >
                  <option value="openai">OpenAI (DALL-E)</option>
                  <option value="gemini">Google Gemini (Imagen)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">모델 선택</label>
                <select 
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none text-white font-mono"
                >
                  {imageModels[imageProvider].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700 space-y-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">API 인증 정보</h4>
            <div className="space-y-4">
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
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
