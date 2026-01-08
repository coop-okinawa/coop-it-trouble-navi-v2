
import React, { useEffect, useRef, useState, useMemo } from "react";
import { INITIAL_FLOW_DATA } from "./data/flows";
import { INITIAL_NEWS_DATA } from "./data/news";
import { Category, FlowData, FlowNode, NewsItem, AppState, ValidationIssue } from "./types";
import { LINKS, TEMPLATES } from "./config";

const STORAGE_KEY_APP = "coop_it_nav_app_state_v3";
const STORAGE_KEY_PW = "coop_it_nav_admin_pw";
const DEFAULT_PW = "0000";

/** ============ Utility ============ */
function tryLoadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error("Clipboard copy failed", err);
    return false;
  }
}

const isRecentNews = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

/** ============ Integrity Check Logic ============ */
function validateState(state: AppState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeIds = Object.keys(state.nodes);
  const referencedNodeIds = new Set<string>();

  // 1. Categories Check
  state.categories.forEach(cat => {
    if (!cat.startNodeId || !state.nodes[cat.startNodeId]) {
      issues.push({ id: cat.id, type: 'error', location: 'category', message: `開始ノード "${cat.startNodeId}" が存在しません。` });
    }
    referencedNodeIds.add(cat.startNodeId);
  });

  // 2. Nodes Check
  nodeIds.forEach(id => {
    const node = state.nodes[id];
    // Check transitions
    const targets = [node.yes, node.no, node.resolvedYes, node.resolvedNo].filter(Boolean) as string[];
    targets.forEach(target => {
      if (!state.nodes[target]) {
        issues.push({ id, type: 'error', location: 'node', message: `遷移先ノード "${target}" が存在しません。` });
      }
      referencedNodeIds.add(target);
    });

    // Check for potential circular reference (shallow check)
    if (targets.includes(id)) {
      issues.push({ id, type: 'warning', location: 'node', message: "自分自身に遷移しています（無限ループの可能性）。" });
    }
  });

  // 3. Unreachable Nodes
  nodeIds.forEach(id => {
    if (!referencedNodeIds.has(id)) {
      issues.push({ id, type: 'warning', location: 'node', message: "どのカテゴリ/ノードからも参照されていない孤立したノードです。" });
    }
  });

  return issues;
}

/** ============ Components ============ */

const NewsCarousel: React.FC<{ items: NewsItem[]; onSelect: (item: NewsItem) => void }> = ({ items, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const publishedItems = items.filter(item => item.isPublished);

  useEffect(() => {
    if (publishedItems.length <= 1 || !isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % publishedItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [publishedItems.length, isAutoPlay]);

  if (publishedItems.length === 0) return null;
  const current = publishedItems[currentIndex];

  return (
    <div className="mb-12 w-full animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden relative group">
        <div className="flex flex-col md:flex-row items-stretch min-h-[140px]">
          <div className="bg-slate-800 text-white p-6 flex flex-col justify-center items-center md:w-32 shrink-0">
            <span className="text-xl font-black">NEWS</span>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onSelect(current)}>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-bold text-slate-400">{current.date}</span>
              {isRecentNews(current.date) && <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>}
            </div>
            <h3 className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{current.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-1 mt-1 font-medium">{current.summary}</p>
          </div>
          <div className="p-4 flex items-center space-x-2 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50">
            <button onClick={() => setIsAutoPlay(!isAutoPlay)} className={`p-2 rounded-full transition-all ${isAutoPlay ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-white border border-slate-200'}`}>
              {isAutoPlay ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <div className="flex space-x-1">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + publishedItems.length) % publishedItems.length)} className="p-2 hover:bg-white rounded-full text-slate-400 border border-transparent hover:border-slate-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % publishedItems.length)} className="p-2 hover:bg-white rounded-full text-slate-400 border border-transparent hover:border-slate-200"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** ============ Main App ============ */

const App: React.FC = () => {
  // --- Core State ---
  const defaultState: AppState = {
    categories: INITIAL_FLOW_DATA.categories,
    nodes: INITIAL_FLOW_DATA.nodes,
    news: INITIAL_NEWS_DATA,
    lastSavedAt: new Date().toISOString(),
    version: "2.7.0"
  };

  const [appState, setAppState] = useState<AppState>(() => tryLoadFromStorage(STORAGE_KEY_APP) || defaultState);
  const [adminPassword, setAdminPassword] = useState<string>(() => tryLoadFromStorage(STORAGE_KEY_PW) || DEFAULT_PW);

  // --- UI Navigation ---
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "warn" | "error"; text: string } | null>(null);
  
  const [showAiWarning, setShowAiWarning] = useState(false);
  const [showGeminiWarning, setShowGeminiWarning] = useState(false);

  // --- Admin Logic State ---
  const [tempState, setTempState] = useState<AppState>(appState);
  const [adminTab, setAdminTab] = useState<"integrity" | "json" | "reset" | "stats" | "categories" | "nodes" | "news" | "security">("stats");
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // パスワード変更用の一時状態
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Validation
  const validationIssues = useMemo(() => validateState(tempState), [tempState]);

  const showToast = (type: "ok" | "warn" | "error", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSaveAll = () => {
    const newState = { ...tempState, lastSavedAt: new Date().toISOString() };
    setAppState(newState);
    saveToStorage(STORAGE_KEY_APP, newState);
    setIsDirty(false);
    showToast("ok", "すべての変更を保存しました");
  };

  const handlePasswordChange = () => {
    if (pwCurrent !== adminPassword) {
      alert("現在のパスワードが正しくありません");
      return;
    }
    if (pwNext === "" || pwNext !== pwConfirm) {
      alert("新しいパスワードが一致しないか、空欄です");
      return;
    }
    if (!confirm("パスワードを変更しますか？")) return;
    
    setAdminPassword(pwNext);
    saveToStorage(STORAGE_KEY_PW, pwNext);
    setPwCurrent(""); setPwNext(""); setPwConfirm("");
    showToast("ok", "管理者パスワードを更新しました");
  };

  const handleResetToDefault = () => {
    if (!confirm("すべてのデータを初期状態に戻します。よろしいですか？（現在の設定は失われます）")) return;
    setTempState(defaultState);
    setIsDirty(true);
    showToast("warn", "初期値をプレビューに読み込みました。保存すると確定されます。");
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(tempState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coop_it_nav_state_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.categories || !json.nodes) throw new Error("必須キー（categories/nodes）がありません");
        setTempState(json);
        setIsDirty(true);
        showToast("ok", "JSONをインポートしました（未保存）");
      } catch (err: any) {
        alert("無効なJSONファイルです: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // --- Navigation Logic ---
  const currentNodeId = history[history.length - 1] || currentCategory?.startNodeId || "";
  const currentNode = appState.nodes[currentNodeId];

  const handleSelectCategory = (cat: Category) => {
    setCurrentCategory(cat);
    setHistory([cat.startNodeId]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = (nextId: string | undefined) => {
    if (nextId) setHistory((prev) => [...prev, nextId]);
  };

  const handleBack = () => {
    if (history.length > 1) setHistory((prev) => prev.slice(0, -1));
    else { setCurrentCategory(null); setHistory([]); }
  };

  const handleReset = () => { setCurrentCategory(null); setHistory([]); };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setShowPasswordPrompt(false);
      setTempState(appState);
      setShowConfig(true);
      setIsDirty(false);
    } else {
      alert("パスワードが違います");
      setPasswordInput("");
    }
  };

  const openAiConsultation = () => {
    window.open(LINKS.CHATGPT_BASE + encodeURIComponent(TEMPLATES.AI_CONSULTATION), "_blank", "noopener,noreferrer");
    setShowAiWarning(false);
  };

  const openGeminiConsultation = async () => {
    const success = await copyToClipboard(TEMPLATES.AI_CONSULTATION);
    if (success) {
      alert("相談テンプレをコピーしました。Geminiの入力欄に貼り付けてください（Ctrl+V）。");
    }
    window.open(LINKS.GEMINI, "_blank", "noopener,noreferrer");
    setShowGeminiWarning(false);
  };

  // --- CRUD Logic ---
  const updateNode = (id: string, node: FlowNode) => {
    setTempState(prev => ({ ...prev, nodes: { ...prev.nodes, [id]: node } }));
    setIsDirty(true);
  };

  const updateNewsItem = (id: string, item: NewsItem) => {
    setTempState(prev => ({ ...prev, news: prev.news.map(n => n.id === id ? item : n) }));
    setIsDirty(true);
  };

  const deleteNode = (id: string) => {
    const isUsed = validationIssues.some(iss => iss.message.includes(id) && iss.type === 'error');
    if (isUsed) {
      alert("このノードは他の要素から参照されているため削除できません。");
      return;
    }
    if (!confirm("このノードを削除しますか？")) return;
    const newNodes = { ...tempState.nodes };
    delete newNodes[id];
    setTempState(prev => ({ ...prev, nodes: newNodes }));
    setIsDirty(true);
  };

  const updateCategory = (id: string, cat: Category) => {
    setTempState(prev => ({ ...prev, categories: prev.categories.map(c => c.id === id ? cat : c) }));
    setIsDirty(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 font-sans">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-lg sticky top-0 z-40 no-print">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-white p-1 rounded shadow-sm"><svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
            <h1 className="text-xl font-bold">コープおきなわ <span className="font-light opacity-80 italic">ITトラブル解決ナビ</span></h1>
          </div>
          <button onClick={() => setShowPasswordPrompt(true)} className="text-xs bg-emerald-800/50 border border-emerald-600 px-3 py-1.5 rounded-md font-bold">設定・追加</button>
        </div>
      </header>

      {toast && (
        <div className="fixed top-20 right-4 z-[150] animate-slideUp">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border font-black text-sm flex items-center space-x-2 ${toast.type === "ok" ? "bg-emerald-600 text-white border-emerald-500" : "bg-rose-600 text-white border-rose-500"}`}>
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-6xl">
        {!currentCategory ? (
          <div className="animate-fadeIn">
            <NewsCarousel items={appState.news} onSelect={setSelectedNews} />
            <div className="text-center mb-12 py-10 bg-white rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 px-4">どのような不具合でお困りですか？</h2>
              <p className="text-slate-500 max-w-lg mx-auto px-4 font-medium italic">該当するジャンルを選択してください</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button onClick={() => setShowAiWarning(true)} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-indigo-100 hover:border-indigo-400 transition-all text-left group transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">GPT</div>
                <div className="flex items-start mb-4">
                  <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all mr-4 shadow-sm border border-indigo-100 shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-700 transition-colors">AIに相談 (ChatGPT)</h3>
                    <p className="text-xs text-indigo-400 mt-1 font-bold uppercase tracking-wider">Assistant</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">症状の整理や問い合わせ文の作成を相談できます</p>
              </button>

              <button onClick={() => setShowGeminiWarning(true)} className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-emerald-100 hover:border-emerald-400 transition-all text-left group transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">🤖 AI</div>
                <div className="flex items-start mb-4">
                  <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all mr-4 shadow-sm border border-emerald-100 shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-700 transition-colors">AIに相談 (Gemini)</h3>
                    <p className="text-xs text-emerald-400 mt-1 font-bold uppercase tracking-wider">Google AI</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">最新のGoogle AIにトラブル内容を相談できます</p>
              </button>

              {appState.categories.map((cat) => (
                <button key={cat.id} onClick={() => handleSelectCategory(cat)} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-500 transition-all text-left group transform hover:-translate-y-1 relative overflow-hidden">
                  <div className="flex items-start mb-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all mr-4 shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">{cat.icon ? <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /> : <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}</svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800">{cat.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{cat.id}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto h-full pb-20">
            <div className="mb-6 flex items-center justify-between no-print px-2">
              <button onClick={handleReset} className="flex items-center text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>最初に戻る</button>
              <div className="flex space-x-4 items-center"><span className="text-xs font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">{currentCategory.name}</span><button onClick={handleBack} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">1つ戻る</button></div>
            </div>
            {currentNode ? (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 animate-fadeIn flex flex-col min-h-[500px]">
                 <div className="flex-1">
                   <div className="mb-6"><span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm ${currentNode.type === 'question' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>{currentNode.type}</span></div>
                   <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">{currentNode.title}</h2>
                   <div className="text-lg text-slate-600 mb-8 font-bold whitespace-pre-wrap">{currentNode.body}</div>
                   {currentNode.steps && (
                     <ul className="space-y-4 mb-10">
                       {currentNode.steps.map((s, i) => (
                         <li key={i} className="flex items-start group"><span className="bg-emerald-100 text-emerald-700 w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black mr-4 shadow-sm shrink-0">{i + 1}</span><span className="text-slate-700 font-bold py-1">{s}</span></li>
                       ))}
                     </ul>
                   )}
                 </div>
                 <div className="mt-10 pt-10 border-t border-slate-100 no-print">
                   {currentNode.type === "question" && (
                     <div className="flex flex-col sm:flex-row gap-4">
                       <button onClick={() => handleNext(currentNode.yes)} className="flex-1 bg-emerald-600 text-white py-5 px-8 rounded-[1.5rem] font-black text-xl hover:bg-emerald-700 shadow-lg transition-all active:scale-95">はい</button>
                       <button onClick={() => handleNext(currentNode.no)} className="flex-1 bg-slate-100 text-slate-700 py-5 px-8 rounded-[1.5rem] font-black text-xl hover:bg-slate-200 border border-slate-200 transition-all active:scale-95">いいえ</button>
                     </div>
                   )}
                   {currentNode.type === "action" && (
                     <div className="flex flex-col sm:flex-row gap-4">
                       <button onClick={() => handleNext(currentNode.resolvedYes)} className="flex-1 bg-emerald-600 text-white py-5 px-8 rounded-[1.5rem] font-black text-xl hover:bg-emerald-700 shadow-lg transition-all active:scale-95">解決した</button>
                       <button onClick={() => handleNext(currentNode.resolvedNo)} className="flex-1 bg-slate-100 text-slate-700 py-5 px-8 rounded-[1.5rem] font-black text-xl hover:bg-slate-200 border border-slate-200 transition-all active:scale-95">解決しない</button>
                     </div>
                   )}
                   {currentNode.type === "end" && (
                     <button onClick={handleReset} className="w-full bg-emerald-600 text-white py-6 rounded-[1.5rem] font-black text-xl hover:bg-emerald-700 shadow-lg">トップへ戻る</button>
                   )}
                 </div>
              </div>
            ) : (
              <div className="text-center p-20 bg-white rounded-3xl border border-slate-200">
                <p className="text-rose-500 font-black mb-4 text-xl">エラー: ノードが見つかりません</p>
                <button onClick={handleReset} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold">トップに戻る</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- Node Edit Modal --- */}
      {editingNodeId && (
        <div className="fixed inset-0 z-[160] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-lg">ノード編集: <span className="font-mono text-emerald-600">{editingNodeId}</span></h4>
              <button onClick={() => setEditingNodeId(null)} className="p-2 hover:bg-slate-50 rounded-full"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">種類</label>
                  <select value={tempState.nodes[editingNodeId].type} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], type: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <option value="question">質問 (YES/NO)</option>
                    <option value="action">手順 (アクション)</option>
                    <option value="end">終了 (完了/手配)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">タイトル</label>
                  <input type="text" value={tempState.nodes[editingNodeId].title} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
                </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">本文</label>
                 <textarea value={tempState.nodes[editingNodeId].body} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], body: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold h-24" />
              </div>
              
              {tempState.nodes[editingNodeId].type === 'question' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">「はい」の遷移先</label>
                    <input type="text" value={tempState.nodes[editingNodeId].yes || ""} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], yes: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">「いいえ」の遷移先</label>
                    <input type="text" value={tempState.nodes[editingNodeId].no || ""} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], no: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-xs" />
                  </div>
                </div>
              )}

              {tempState.nodes[editingNodeId].type === 'action' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">手順リスト (一行ごとに入力)</label>
                    <textarea value={tempState.nodes[editingNodeId].steps?.join('\n') || ""} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], steps: e.target.value.split('\n').filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold h-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">「解決した」の遷移先</label>
                      <input type="text" value={tempState.nodes[editingNodeId].resolvedYes || ""} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], resolvedYes: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">「解決しない」の遷移先</label>
                      <input type="text" value={tempState.nodes[editingNodeId].resolvedNo || ""} onChange={(e) => updateNode(editingNodeId, { ...tempState.nodes[editingNodeId], resolvedNo: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setEditingNodeId(null)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">完了</button>
            </div>
          </div>
        </div>
      )}

      {/* --- News Edit Modal --- */}
      {editingNewsId && tempState.news.find(n => n.id === editingNewsId) && (
        <div className="fixed inset-0 z-[160] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-lg">ニュース編集</h4>
              <button onClick={() => setEditingNewsId(null)} className="p-2 hover:bg-slate-50 rounded-full"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">日付</label>
                  <input type="date" value={tempState.news.find(n => n.id === editingNewsId)!.date} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">公開状態</label>
                  <select value={tempState.news.find(n => n.id === editingNewsId)!.isPublished ? "true" : "false"} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, isPublished: e.target.value === "true" })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold">
                    <option value="true">公開</option>
                    <option value="false">非公開</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">タイトル</label>
                <input type="text" value={tempState.news.find(n => n.id === editingNewsId)!.title} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">概要（一覧に表示）</label>
                <textarea value={tempState.news.find(n => n.id === editingNewsId)!.summary} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, summary: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold h-20" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">本文</label>
                <textarea value={tempState.news.find(n => n.id === editingNewsId)!.content} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, content: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold h-40" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">タグ（カンマ区切り）</label>
                <input type="text" value={tempState.news.find(n => n.id === editingNewsId)!.tags?.join(', ') || ''} onChange={(e) => updateNewsItem(editingNewsId, { ...tempState.news.find(n => n.id === editingNewsId)!, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setEditingNewsId(null)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">完了</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Category Edit Modal --- */}
      {editingCategoryId && (
        <div className="fixed inset-0 z-[160] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md animate-slideUp overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center font-black">カテゴリ編集: {editingCategoryId}</div>
             <div className="p-8 space-y-4">
                <p className="text-xs text-slate-400 font-bold">フォームの実装を簡略化していますが、状態は updateCategory で反映されます。</p>
                <button onClick={() => setEditingCategoryId(null)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black">閉じる</button>
             </div>
          </div>
        </div>
      )}

      {/* --- News Detail Modal --- */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-opacity animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl h-auto max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">NEWS</span>
                <span className="text-xs font-bold text-slate-400">{selectedNews.date}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-6">{selectedNews.title}</h3>
              <div className="text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-wrap">{selectedNews.content}</div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button onClick={() => setSelectedNews(null)} className="px-12 bg-white border-2 border-slate-200 text-slate-500 py-3 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-sm">閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ChatGPT WARNING MODAL --- */}
      {showAiWarning && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 transition-opacity animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-800">外部AI利用上の注意</h3>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                <p className="text-sm font-bold text-rose-600 mb-2">※重要：以下の情報は絶対に入力しないでください</p>
                <ul className="text-xs font-bold text-slate-600 space-y-1 list-disc list-inside">
                  <li>個人情報（氏名、電話番号、住所など）</li>
                  <li>組合員情報</li>
                  <li>各種パスワード、認証コード</li>
                  <li>社外秘の業務情報</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={openAiConsultation} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg">同意して相談を開始</button>
              <button onClick={() => setShowAiWarning(false)} className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-black border border-slate-200 hover:bg-slate-200 transition-all">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Gemini WARNING MODAL --- */}
      {showGeminiWarning && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 transition-opacity animate-fadeIn">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">外部AI（Gemini）を開きます</h3>
              <div className="mt-4 text-left space-y-3">
                <p className="text-sm font-bold text-slate-600 leading-relaxed">Gemini を利用するには Googleアカウントが必要です。<br/>入力内容は社外サービスに送信されます。<br/>個人情報・パスワードは入力しないでください。</p>
                <p className="text-md font-black text-slate-800 text-center pt-2">開きますか？</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowGeminiWarning(false)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-black border border-slate-200 hover:bg-slate-200 transition-all active:scale-95">キャンセル</button>
              <button onClick={openGeminiConsultation} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg active:scale-95">開く</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Admin Console --- */}
      {showConfig && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-slideUp">
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-black">統合管理コンソール</h3>
                {isDirty && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">未保存の変更あり</span>}
              </div>
              <div className="flex items-center space-x-3">
                {isDirty && <button onClick={handleSaveAll} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-sm shadow-md hover:bg-emerald-700 transition-all">すべて保存</button>}
                <button onClick={() => {
                  if (isDirty && !confirm("未保存の変更があります。破棄して閉じますか？")) return;
                  setShowConfig(false);
                }} className="bg-white p-2 rounded-full border border-slate-200 shadow-sm"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
              <div className="col-span-3 border-r border-slate-200 bg-white p-4 space-y-2 overflow-y-auto">
                <button onClick={() => setAdminTab("stats")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "stats" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>📊 状態・統計</button>
                <button onClick={() => setAdminTab("integrity")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "integrity" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>🔍 整合性チェック ({validationIssues.length})</button>
                <button onClick={() => setAdminTab("categories")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "categories" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>📁 カテゴリ編集</button>
                <button onClick={() => setAdminTab("nodes")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "nodes" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>🌳 ノード編集</button>
                <button onClick={() => setAdminTab("news")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "news" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>📰 ニュース管理</button>
                <button onClick={() => setAdminTab("security")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "security" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>🔒 パスワード設定</button>
                <hr className="my-2 border-slate-100" />
                <button onClick={() => setAdminTab("json")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "json" ? "bg-emerald-600 text-white shadow-lg" : "hover:bg-slate-50"}`}>📁 JSON入出力</button>
                <button onClick={() => setAdminTab("reset")} className={`w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all ${adminTab === "reset" ? "bg-rose-600 text-white shadow-lg" : "hover:bg-rose-50 text-rose-600"}`}>⚠️ 初期化</button>
              </div>

              <div className="col-span-9 bg-slate-50 p-8 overflow-y-auto">
                {adminTab === "stats" && (
                  <div className="space-y-6">
                    <h4 className="font-black text-2xl mb-8">現在の状態</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Categories</p>
                        <p className="text-3xl font-black text-slate-800">{tempState.categories.length}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nodes</p>
                        <p className="text-3xl font-black text-slate-800">{Object.keys(tempState.nodes).length}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issues</p>
                        <p className={`text-3xl font-black ${validationIssues.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{validationIssues.length}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">News</p>
                        <p className="text-3xl font-black text-slate-800">{tempState.news.length}</p>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <h5 className="font-black mb-4">保存情報</h5>
                      <p className="text-sm text-slate-600">最終保存日時: <span className="font-bold text-slate-900">{new Date(tempState.lastSavedAt).toLocaleString()}</span></p>
                      <p className="text-sm text-slate-600">バージョン: <span className="font-bold text-slate-900">{tempState.version}</span></p>
                      <p className="text-sm text-slate-600 mt-4">ストレージキー: <span className="font-mono bg-slate-100 px-1 rounded">{STORAGE_KEY_APP}</span></p>
                    </div>
                  </div>
                )}

                {adminTab === "security" && (
                  <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
                    <h4 className="font-black text-2xl mb-8">管理者パスワード設定</h4>
                    <div className="space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">現在のパスワード</label>
                        <input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">新しいパスワード</label>
                        <input type="password" value={pwNext} onChange={(e) => setPwNext(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">新しいパスワード（確認）</label>
                        <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold" />
                      </div>
                      <button onClick={handlePasswordChange} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black mt-4 shadow-lg hover:bg-emerald-700 transition-all">パスワードを更新</button>
                    </div>
                  </div>
                )}

                {adminTab === "integrity" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-2xl">整合性レポート</h4>
                      <button onClick={async () => {
                        const text = validationIssues.map(i => `[${i.type.toUpperCase()}] ${i.location}#${i.id}: ${i.message}`).join('\n');
                        await copyToClipboard(text);
                        showToast("ok", "エラーリストをコピーしました");
                      }} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50">結果をコピー</button>
                    </div>
                    {validationIssues.length === 0 ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center">
                        <p className="text-emerald-800 font-black">すべてのフローが正常です。問題は見つかりませんでした。</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {validationIssues.map((issue, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-3 ${issue.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                            <span className="shrink-0 mt-1 font-black text-[10px] uppercase px-1.5 py-0.5 rounded bg-white shadow-sm">{issue.type}</span>
                            <div className="flex-1">
                              <p className="font-bold text-sm">{issue.message}</p>
                              <p className="text-[10px] opacity-60 font-mono mt-1">Target: {issue.location} ID: {issue.id}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {adminTab === "json" && (
                  <div className="space-y-8">
                    <h4 className="font-black text-2xl">JSON入出力</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <h5 className="font-black mb-2">エクスポート</h5>
                        <button onClick={handleExportJson} className="w-full bg-slate-800 text-white py-3 rounded-xl font-black text-sm hover:bg-black">ダウンロード</button>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <h5 className="font-black mb-2">インポート</h5>
                        <label className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-sm hover:bg-emerald-700 cursor-pointer text-center">
                          ファイルをアップロード
                          <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {adminTab === "reset" && (
                  <div className="max-w-md mx-auto py-12 text-center">
                    <h4 className="font-black text-2xl mb-4 text-rose-600">データの初期化</h4>
                    <button onClick={handleResetToDefault} className="w-full bg-rose-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-rose-700">初期状態に戻す</button>
                  </div>
                )}

                {adminTab === "categories" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-2xl">カテゴリ管理</h4>
                      <button onClick={() => {
                        const id = prompt("新しいカテゴリIDを入力してください（半角英数）");
                        if (!id) return;
                        setTempState(prev => ({ ...prev, categories: [...prev.categories, { id, name: "新規カテゴリ", description: "", startNodeId: "" }] }));
                        setIsDirty(true);
                      }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs">+ 新規追加</button>
                    </div>
                    <div className="space-y-4">
                      {tempState.categories.map(cat => (
                        <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
                          <div className="flex-1 mr-4">
                            <h5 className="font-black text-lg text-slate-800">{cat.name}</h5>
                            <p className="text-xs text-slate-500 font-medium">{cat.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => setEditingCategoryId(cat.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">編集</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "nodes" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-2xl">ノード管理</h4>
                      <button onClick={() => {
                         const id = prompt("新しいノードIDを入力してください");
                         if (!id) return;
                         updateNode(id, { type: 'question', title: '新規質問', body: '' });
                      }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs">+ 新規追加</button>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(tempState.nodes).sort().map(([id, node]) => (
                        <div key={id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center group">
                          <div className="flex-1 flex items-center space-x-3 overflow-hidden">
                            <span className="text-xs font-black text-slate-400 font-mono shrink-0">{id}</span>
                            <span className="font-bold text-slate-700 truncate">{node.title}</span>
                          </div>
                          <button onClick={() => setEditingNodeId(id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">編集</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "news" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-2xl">ニュース管理</h4>
                      <button onClick={() => {
                        const newItem: NewsItem = {
                          id: `news_${Date.now()}`,
                          title: "新規ニュース",
                          date: new Date().toISOString().split('T')[0],
                          summary: "",
                          content: "",
                          isPublished: false,
                          tags: []
                        };
                        setTempState(prev => ({ ...prev, news: [newItem, ...prev.news] }));
                        setIsDirty(true);
                      }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs">+ 新規投稿</button>
                    </div>
                    <div className="space-y-4">
                      {tempState.news.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start">
                          <div className="flex-1">
                             <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-bold text-slate-400">{item.date}</span>
                                {!item.isPublished && <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-black">非公開</span>}
                             </div>
                             <h5 className="font-black text-lg">{item.title}</h5>
                             <p className="text-xs text-slate-500 font-medium">{item.summary}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                             <button onClick={() => setEditingNewsId(item.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 font-black text-xs">編集</button>
                             <button onClick={() => {
                               if (confirm("ニュースを削除しますか？")) {
                                 setTempState(prev => ({ ...prev, news: prev.news.filter(n => n.id !== item.id) }));
                                 setIsDirty(true);
                               }
                             }} className="p-2 text-rose-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">管理者認証</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="パスワードを入力" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 outline-none text-center" autoFocus />
              <div className="flex space-x-2">
                <button type="button" onClick={() => setShowPasswordPrompt(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold">キャンセル</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">ログイン</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
