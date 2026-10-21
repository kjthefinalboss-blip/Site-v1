import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { type BlogPost, formatDate } from '@/lib/blog';
import { useReveal } from '@/hooks/useScrollAnimations';

export default function BlogPreview() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);
        setPosts((data ?? []) as BlogPost[]);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    void loadPosts();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog-preview" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`reveal text-center mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            From the Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Travel <span className="text-gradient">Stories</span> & Guides
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            In-depth articles inspired by each journey — tips, routes, and personal experiences from the road.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/60 dark:bg-ink-900/60 animate-pulse">
                <div className="aspect-video bg-ink-200 dark:bg-ink-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-ink-200 dark:bg-ink-800 rounded" />
                  <div className="h-4 w-2/3 bg-ink-200 dark:bg-ink-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`#blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden glass card-hover"
              >
                {post.thumbnail && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-600/90 backdrop-blur-sm text-white text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-base text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href="#blog" className="btn-outline group">
            <Sparkles className="w-4 h-4" />
            Read All Blog Posts
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
