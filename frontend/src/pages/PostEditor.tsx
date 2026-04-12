import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, ArrowLeft, Eye, Edit3 } from 'lucide-react';
import { GetPost, UpdatePost, PublishPost } from '../../wailsjs/go/main/App';
import { models } from '../../wailsjs/go/models';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<models.PostResponse | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
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

  if (!post) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isSaving ? '저장 중...' : '저장하기'}</span>
          </button>
          <button 
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Send size={18} />
            <span>발행하기</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col min-h-[70vh]">
        <div className="p-6 border-b border-slate-700">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold outline-none focus:placeholder-transparent"
            placeholder="포스팅 제목을 입력하세요..."
          />
          <div className="flex items-center mt-2 space-x-4 text-xs text-slate-500">
            <span>플랫폼: <span className="text-slate-300">{post.platform}</span></span>
            <span>상태: <span className="text-amber-400 font-bold uppercase">{post.status}</span></span>
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
              {/* Simple Markdown preview simulation */}
              <div className="whitespace-pre-wrap font-sans text-slate-300">
                {content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
