import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  Timestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { Camera, Plus, X, ArrowLeft, Trash2, Save } from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDKz_8qTTVMyUclluzdwSHl6SY52tlLwNw",
  authDomain: "portfolio-14bec.firebaseapp.com",
  projectId: "portfolio-14bec",
  storageBucket: "portfolio-14bec.firebasestorage.app",
  messagingSenderId: "103527425480",
  appId: "1:103527425480:web:509f2651574e594df9ccfd",
  measurementId: "G-2S2X4FJBHY"
};

// --- Initialization ---
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "portfolio-site"; // データ保存用の識別ID

// --- Components ---

// 記事詳細モーダル
const ReportDetail = ({ report, onClose, onDelete }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative">
        <button 
          onClick={onClose}
          className="fixed top-6 left-6 md:top-10 md:left-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        
        {onDelete && (
          <button 
            onClick={() => onDelete(report.id)}
            className="fixed top-6 right-6 md:top-10 md:right-10 p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        <article className="mt-10">
          <header className="mb-12 text-center">
            <span className="block text-xs font-serif tracking-widest text-gray-500 mb-4">
              EXPERIMENT REPORT #{report.number || '000'}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 leading-tight mb-6">
              {report.title}
            </h1>
            <time className="text-xs text-gray-400 font-sans tracking-wider">
              {report.date ? new Date(report.date.seconds * 1000).toLocaleDateString('ja-JP') : ''}
            </time>
          </header>

          {report.imageUrl && (
            <div className="mb-16 shadow-sm">
              <img 
                src={report.imageUrl} 
                alt={report.title} 
                className="w-full h-auto max-h-[80vh] object-contain mx-auto bg-gray-50"
              />
            </div>
          )}

          <div className="prose prose-stone prose-lg mx-auto font-serif leading-loose text-gray-800 whitespace-pre-wrap">
            {report.content}
          </div>
        </article>
      </div>
    </div>
  );
};

// 投稿用モーダル
const EditorModal = ({ onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, imageUrl, number });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-serif mb-8 text-center tracking-widest">新規レポート作成</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
             <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">No.</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black font-serif transition-colors"
                placeholder="001"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black font-serif text-lg transition-colors"
                placeholder="タイトルを入力"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">IMAGE URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black font-serif text-sm transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">CONTENT</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-200 p-4 h-64 focus:outline-none focus:border-black font-serif resize-none leading-loose"
              placeholder="思考や観察の記録..."
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>記録する</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// メインアプリケーション
export default function App() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 匿名認証
  useEffect(() => {
    signInAnonymously(auth).catch((error) => console.error("Auth Error:", error));
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // 2. データ取得（リアルタイム更新）
  useEffect(() => {
    if (!user) return;

    // 'artifacts' > appId > 'public' > 'data' > 'experiment_reports'
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'experiment_reports')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // 新しい順にソート
        data.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
        setReports(data);
      },
      (error) => console.error("Firestore Error:", error)
    );

    return () => unsubscribe();
  }, [user]);

  // レポート追加処理
  const handleAddReport = async ({ title, content, imageUrl, number }) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'experiment_reports'), {
        title,
        content,
        imageUrl,
        number,
        date: Timestamp.now(),
        authorId: user.uid
      });
      setIsEditorOpen(false);
    } catch (e) {
      console.error("Add Error: ", e);
      alert("投稿に失敗しました。権限設定などを確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // レポート削除処理
  const handleDeleteReport = async (id) => {
    if (!user || !confirm('このレポートを削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'experiment_reports', id));
      setSelectedReport(null);
    } catch (e) {
      console.error("Delete Error: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-sans selection:bg-gray-200">
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-6 py-4 md:px-10 md:py-6 transition-all duration-300">
        <div className="flex flex-col">
          <h1 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase">
            Experiment Reports
          </h1>
          <span className="text-[10px] text-gray-400 mt-1 tracking-wider">
            DAILY OBSERVATIONS & THOUGHTS
          </span>
        </div>
        
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="group flex items-center gap-2 px-4 py-2 text-xs tracking-widest hover:bg-gray-100 transition-all rounded-sm"
        >
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
          <span className="hidden md:inline text-gray-400 group-hover:text-black transition-colors">NEW REPORT</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 md:px-10 max-w-[1600px] mx-auto">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-300">
            <Camera className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-serif tracking-widest text-sm">NO DATA ACCUMULATED</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {reports.map((report) => (
              <article 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="group cursor-pointer flex flex-col gap-4 animate-fade-in-up"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 w-full">
                  {report.imageUrl ? (
                    <img 
                      src={report.imageUrl} 
                      alt={report.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                      <span className="font-serif text-4xl italic opacity-20">#{report.number}</span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                {/* Text */}
                <div className="flex flex-col items-start gap-2 pr-4">
                  <div className="flex items-baseline gap-3 w-full border-t border-gray-200 pt-4">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                      #{report.number}
                    </span>
                    <time className="text-[10px] text-gray-400 uppercase tracking-wider ml-auto">
                      {report.date ? new Date(report.date.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </time>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-serif font-medium leading-snug group-hover:text-gray-600 transition-colors">
                    {report.title}
                  </h2>
                  
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-serif w-11/12 opacity-80">
                    {report.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-100 mt-auto">
        <p className="text-[10px] tracking-[0.2em] text-gray-300">
          © {new Date().getFullYear()} ARCHIVE. ALL RIGHTS RESERVED.
        </p>
      </footer>

      {/* Modals */}
      {selectedReport && (
        <ReportDetail 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
          onDelete={handleDeleteReport}
        />
      )}

      {isEditorOpen && (
        <EditorModal 
          onClose={() => setIsEditorOpen(false)} 
          onSubmit={handleAddReport}
          isSubmitting={isSubmitting}
        />
      )}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;500&family=Noto+Sans+JP:wght@300;400;500&display=swap');
        
        .font-serif {
          font-family: 'Noto Serif JP', serif;
        }
        .font-sans {
          font-family: 'Noto Sans JP', sans-serif;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}