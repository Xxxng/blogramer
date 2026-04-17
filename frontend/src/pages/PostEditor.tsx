import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, ArrowLeft, Eye, Edit3 } from 'lucide-react';
import { GetPost, UpdatePost, PublishPost, AddSchedule, GetScheduleByPostID, CancelSchedule } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';
import { Calendar, X } from 'lucide-react';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<models.PostResponse | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [currentSchedule, setCurrentSchedule] = useState<models.ScheduleResponse | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
      fetchSchedule(Number(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      const data = await GetPost(postId);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      alert('포스팅을 불러오지 못했습니다: ' + err);
      navigate('/posts');
    }
  };

  const fetchSchedule = async (postId: number) => {
    try {
      const data = await GetScheduleByPostID(postId);
      setCurrentSchedule(data);
      if (data && data.scheduled_at) {
        // Convert display format back to datetime-local format (YYYY-MM-DDTHH:mm)
        const date = new Date(data.scheduled_at.replace(' ', 'T'));
        if (!isNaN(date.getTime())) {
          const localStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setScheduleTime(localStr);
        }
      }
    } catch (err) {
      // Normal if not scheduled
      setCurrentSchedule(null);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await UpdatePost(Number(id), title, content);
      alert('저장 완료!');
    } catch (err) {
      alert('저장 실패: ' + err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    if (confirm('수정된 내용을 저장하고 즉시 발행하시겠습니까?')) {
      try {
        await UpdatePost(Number(id), title, content);
        await PublishPost(Number(id));
        alert('발행 완료!');
        navigate('/posts');
      } catch (err) {
        alert('발행 실패: ' + err);
      }
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !scheduleTime) return;

    try {
      await UpdatePost(Number(id), title, content);
      await AddSchedule(Number(id), scheduleTime);
      alert('예약 완료!');
      navigate('/posts');
    } catch (err) {
      alert('예약 실패: ' + err);
    }
  };

  const handleCancelSchedule = async () => {
    if (!currentSchedule) return;
    if (confirm('예약을 취소하시겠습니까?')) {
      try {
        await CancelSchedule(currentSchedule.id);
        alert('예약 취소 완료!');
        setCurrentSchedule(null);
        fetchPost(Number(id!));
      } catch (err) {
        alert('취소 실패: ' + err);
      }
    }
  };

  if (!post) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;

  return (
    <div className="space-y-6 w-full h-full flex flex-col px-4">
      <div className="flex justify-between items-center shrink-0">
        <button 
          onClick={() => navigate('/posts')}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          목록으로 돌아가기
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
            <span>{isPreview ? '편집하기' : '미리보기'}</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isSaving ? '저장 중...' : '저장하기'}</span>
          </button>
          
          {currentSchedule ? (
            <button 
              onClick={handleCancelSchedule}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Calendar size={18} />
              <span>예약 취소 ({currentSchedule.scheduled_at})</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Calendar size={18} />
              <span>예약 발행</span>
            </button>
          )}

          <button 
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Send size={18} />
            <span>즉시 발행</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="p-6 border-b border-slate-700 shrink-0">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold outline-none focus:placeholder-transparent"
            placeholder="포스팅 제목을 입력하세요..."
          />
          <div className="flex items-center mt-2 space-x-4 text-xs text-slate-500">
            <span>플랫폼: <span className="text-slate-300">{post.platform}</span></span>
            <span>상태: <span className={`font-bold uppercase ${
              post.status === 'scheduled' ? 'text-blue-400' : 
              post.status === 'published' ? 'text-green-400' : 'text-amber-400'
            }`}>{post.status}</span></span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {!isPreview ? (
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-transparent p-8 outline-none resize-none font-mono text-slate-300 leading-relaxed"
              placeholder="마크다운 형식으로 본문을 작성하세요..."
            />
          ) : (
            <div className="w-full h-full p-8 prose prose-invert max-w-none overflow-auto">
              <div className="whitespace-pre-wrap font-sans text-slate-300">
                {content}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">발행 예약 설정</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">예약 시간 선택</label>
                <input 
                  type="datetime-local"
                  required
                  value={scheduleTime}
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  선택한 시간에 자동으로 포스팅이 발행됩니다. 앱이 종료되어 시간을 놓친 경우, 다음 날 동일한 시간으로 자동 연기됩니다.
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  예약 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
