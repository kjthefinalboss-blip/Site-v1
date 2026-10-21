import { useEffect, useState, useCallback } from 'react';
import {
  LogOut, Lock, Loader2, Check, Edit3, Eye, Trash2, Send, RefreshCw,
  FileText, Clock, CheckCircle2, Calendar, Tag, Mail, Users, Bell,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { type BlogPost, blogCategories, formatDate } from '@/lib/blog';
import { channelInfo } from '@/lib/content';

type View = 'login' | 'dashboard' | 'edit';

export default function AdminPanel() {
  const [view, setView] = useState<View>('login');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const checkSession = useCallback(async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setView('dashboard');
      void loadData();
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const loadData = async () => {
    if (!supabase) return;
    setLoadingData(true);
    try {
      const [{ data: postData }, { data: subData }] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('id, email, created_at').order('created_at', { ascending: false }),
      ]);
      setPosts((postData ?? []) as BlogPost[]);
      setSubscribers((subData ?? []) as { id: string; email: string; created_at: string }[]);
    } catch {
      // ignore
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setView('dashboard');
      void loadData();
    } catch {
      setAuthError('Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setView('login');
    setPosts([]);
    setSubscribers([]);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenResult('');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-blog`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to generate drafts.');
      const created = result.results?.filter((r: { status: string }) => r.status === 'created').length ?? 0;
      const skipped = result.results?.filter((r: { status: string }) => r.status === 'skipped').length ?? 0;
      const errors = result.results?.filter((r: { status: string }) => r.status?.startsWith('error')).length ?? 0;
      setGenResult(`Checked ${result.checked} videos: ${created} new drafts created, ${skipped} already existed, ${errors} errors.`);
      void loadData();
    } catch {
      setGenResult('Unable to generate drafts right now. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (post: BlogPost) => {
    if (!supabase) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', post.id);
      if (error) throw error;
      void loadData();
      // Notify subscribers
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-subscribers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id, contentType: 'blog' }),
      });
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async (post: BlogPost) => {
    if (!supabase) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'draft', published_at: null })
        .eq('id', post.id);
      if (error) throw error;
      void loadData();
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!supabase) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
      if (error) throw error;
      void loadData();
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async (updated: BlogPost) => {
    if (!supabase) return;
    setActionLoading(true);
    setSaveMessage('');
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: updated.title,
          excerpt: updated.excerpt,
          content: updated.content,
          category: updated.category,
          destination: updated.destination,
          thumbnail: updated.thumbnail,
          seo_description: updated.seo_description,
          seo_keywords: updated.seo_keywords,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updated.id);
      if (error) throw error;
      setSaveMessage('Saved successfully.');
      void loadData();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Unable to save. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Login view
  if (view === 'login') {
    return (
      <div className="pt-32 pb-32 max-w-md mx-auto section-padding">
        <div className="rounded-3xl glass p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold font-display text-ink-900 dark:text-white">Owner Login</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Sign in to review and publish blog drafts.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                placeholder="Your password"
              />
            </div>
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <button type="submit" disabled={authLoading} className="btn-primary w-full">
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Edit view
  if (view === 'edit' && editingPost) {
    return (
      <div className="pt-24 pb-32 max-w-3xl mx-auto section-padding">
        <button
          onClick={() => { setView('dashboard'); setEditingPost(null); setSaveMessage(''); }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-3 transition-all mb-6"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          Back to Dashboard
        </button>

        <div className="rounded-3xl glass p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Edit3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xl font-bold font-display text-ink-900 dark:text-white">Edit Article</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              editingPost.status === 'published'
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                : 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300'
            }`}>
              {editingPost.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>

          {editingPost.thumbnail && (
            <img src={editingPost.thumbnail} alt="" className="w-full aspect-video object-cover rounded-xl mb-6" />
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Title</label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Category</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                  {blogCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Destination</label>
                <input
                  type="text"
                  value={editingPost.destination}
                  onChange={(e) => setEditingPost({ ...editingPost, destination: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="e.g. Dubai, UAE"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Excerpt</label>
              <textarea
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">
                Content (Markdown)
              </label>
              <textarea
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                rows={16}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 font-mono resize-y leading-relaxed"
              />
              <p className="mt-1.5 text-xs text-ink-400">Use ## for headings, - for lists, **bold** for emphasis.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">Thumbnail URL</label>
              <input
                type="text"
                value={editingPost.thumbnail}
                onChange={(e) => setEditingPost({ ...editingPost, thumbnail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">SEO Description</label>
                <input
                  type="text"
                  value={editingPost.seo_description}
                  onChange={(e) => setEditingPost({ ...editingPost, seo_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-ink-500 dark:text-ink-400 mb-2">SEO Keywords</label>
                <input
                  type="text"
                  value={editingPost.seo_keywords}
                  onChange={(e) => setEditingPost({ ...editingPost, seo_keywords: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-ink-200 dark:border-ink-700">
              <button onClick={() => handleSave(editingPost)} disabled={actionLoading} className="btn-primary">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save Changes
              </button>
              {editingPost.status === 'draft' && (
                <button onClick={() => { handleSave(editingPost); handlePublish(editingPost); }} disabled={actionLoading} className="btn-gold">
                  <Send className="w-4 h-4" />
                  Save & Publish
                </button>
              )}
              {editingPost.status === 'published' && (
                <button onClick={() => handleUnpublish(editingPost)} disabled={actionLoading} className="btn-outline">
                  Unpublish
                </button>
              )}
              {saveMessage && <span className="self-center text-sm text-brand-600 dark:text-brand-400">{saveMessage}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto section-padding">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-white">Blog Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Review AI-generated drafts, edit, and publish.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleGenerate} disabled={generating} className="btn-primary">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Generate New Drafts
          </button>
          <button onClick={handleLogout} className="btn-outline !px-4 !py-3">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {genResult && (
        <div className="mb-6 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/80 dark:bg-brand-900/20 p-4 text-sm text-brand-700 dark:text-brand-300">
          {genResult}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Drafts', value: draftCount, icon: Clock, color: 'text-gold-600 dark:text-gold-400' },
          { label: 'Published', value: publishedCount, icon: CheckCircle2, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Subscribers', value: subscribers.length, icon: Users, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Total Posts', value: posts.length, icon: FileText, color: 'text-ink-600 dark:text-ink-300' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl glass-card p-4">
            <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold font-display text-ink-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-ink-500 dark:text-ink-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Drafts section */}
      {loadingData ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {posts.filter((p) => p.status === 'draft').length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-gold-600 dark:text-gold-400 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Needs Review ({posts.filter((p) => p.status === 'draft').length})
              </h2>
              <div className="space-y-3">
                {posts.filter((p) => p.status === 'draft').map((post) => (
                  <PostRow key={post.id} post={post} onEdit={() => { setEditingPost(post); setView('edit'); }} onPublish={() => handlePublish(post)} onDelete={() => handleDelete(post)} actionLoading={actionLoading} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Published ({posts.filter((p) => p.status === 'published').length})
            </h2>
            {posts.filter((p) => p.status === 'published').length === 0 ? (
              <p className="text-sm text-ink-400 dark:text-ink-500 py-4">No published articles yet.</p>
            ) : (
              <div className="space-y-3">
                {posts.filter((p) => p.status === 'published').map((post) => (
                  <PostRow key={post.id} post={post} onEdit={() => { setEditingPost(post); setView('edit'); }} onUnpublish={() => handleUnpublish(post)} onDelete={() => handleDelete(post)} actionLoading={actionLoading} />
                ))}
              </div>
            )}
          </div>

          {/* Subscribers list */}
          {subscribers.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Subscribers ({subscribers.length})
              </h2>
              <div className="rounded-2xl glass-card overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between px-4 py-3 border-b border-ink-100 dark:border-ink-800 last:border-0">
                      <span className="text-sm text-ink-700 dark:text-ink-200">{sub.email}</span>
                      <span className="text-xs text-ink-400">{formatDate(sub.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PostRow({
  post, onEdit, onPublish, onUnpublish, onDelete, actionLoading,
}: {
  post: BlogPost;
  onEdit: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onDelete: () => void;
  actionLoading: boolean;
}) {
  return (
    <div className="rounded-2xl glass-card p-4 flex items-center gap-4">
      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-3 h-3 text-brand-500" />
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400">{post.category}</span>
          {post.published_at && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-400">
              <Calendar className="w-3 h-3" />
              {formatDate(post.published_at)}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-ink-900 dark:text-white truncate">{post.title}</h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 truncate mt-0.5">{post.excerpt}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onEdit} className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="Edit">
          <Edit3 className="w-4 h-4" />
        </button>
        {post.status === 'draft' && onPublish && (
          <button onClick={onPublish} disabled={actionLoading} className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 hover:bg-brand-200 dark:hover:bg-brand-900/60 transition-colors" aria-label="Publish">
            <Send className="w-4 h-4" />
          </button>
        )}
        {post.status === 'published' && onUnpublish && (
          <button onClick={onUnpublish} disabled={actionLoading} className="w-9 h-9 rounded-lg bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center text-gold-600 dark:text-gold-400 hover:bg-gold-200 dark:hover:bg-gold-900/50 transition-colors" aria-label="Unpublish">
            <Eye className="w-4 h-4" />
          </button>
        )}
        <button onClick={onDelete} disabled={actionLoading} className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" aria-label="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
