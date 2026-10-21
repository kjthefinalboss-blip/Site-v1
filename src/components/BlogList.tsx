import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Tag, FileText, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { type BlogPost, formatDate, blogCategories } from '@/lib/blog';
import { channelInfo } from '@/lib/content';
import SubscribeForm from '@/components/SubscribeForm';

export default function BlogList({ onNavigate }: { onNavigate: (slug: string) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const loadPosts = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error: queryError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (queryError) throw queryError;
        setPosts((data ?? []) as BlogPost[]);
      } catch {
        setError('Unable to load blog posts right now.');
      } finally {
        setLoading(false);
      }
    };
    void loadPosts();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 pb-32">
      <div className="section-padding max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-widest uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Travel Blog
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-ink-900 dark:text-white text-balance leading-tight">
            Stories from the <span className="text-gradient">road</span>
          </h1>
          <p className="mt-5 text-base text-ink-600 dark:text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Travel articles, guides, and stories from {channelInfo.name} — automatically written from each video and reviewed before publishing.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {['All', ...blogCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-brand-700 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 border border-ink-200 dark:border-ink-700 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/60 dark:bg-ink-900/60 animate-pulse">
                <div className="aspect-video bg-ink-200 dark:bg-ink-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-ink-200 dark:bg-ink-800 rounded" />
                  <div className="h-4 w-2/3 bg-ink-200 dark:bg-ink-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto rounded-2xl border border-ink-200 dark:border-ink-700 bg-white/70 dark:bg-ink-900/70 p-8 text-center">
            <p className="text-ink-600 dark:text-ink-300">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="max-w-xl mx-auto rounded-2xl border border-ink-200 dark:border-ink-700 bg-white/70 dark:bg-ink-900/70 p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-ink-300 dark:text-ink-600 mb-4" />
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white">No blog posts yet</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">New articles will appear here as videos are published and reviewed.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((post) => (
              <a
                key={post.id}
                href={`#blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden glass card-hover cursor-pointer"
              >
                {post.thumbnail && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-600/90 backdrop-blur-sm text-white text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-base text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400 dark:text-ink-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe section */}
        {!loading && filtered.length > 0 && (
          <div className="mt-20">
            <SubscribeForm variant="section" />
          </div>
        )}
        {!loading && filtered.length === 0 && !error && (
          <div className="mt-12">
            <SubscribeForm variant="section" />
          </div>
        )}
      </div>
    </div>
  );
}
