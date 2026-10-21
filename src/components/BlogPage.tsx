import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, PlayCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { type BlogPost, formatDate, renderMarkdown } from '@/lib/blog';
import { channelInfo } from '@/lib/content';
import SubscribeForm from '@/components/SubscribeForm';

export default function BlogPage({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      if (!supabase) return;
      setLoading(true);
      setError('');
      try {
        const { data, error: queryError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (queryError) throw queryError;
        if (!data) {
          setError('Article not found.');
          return;
        }
        setPost(data as BlogPost);

        const { data: relData } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .neq('id', (data as BlogPost).id)
          .order('published_at', { ascending: false })
          .limit(3);
        setRelated((relData ?? []) as BlogPost[]);
      } catch {
        setError('Unable to load this article.');
      } finally {
        setLoading(false);
      }
    };
    void loadPost();
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-32 max-w-3xl mx-auto section-padding">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-ink-200 dark:bg-ink-800 rounded-full mb-8" />
          <div className="h-12 bg-ink-200 dark:bg-ink-800 rounded-xl mb-4" />
          <div className="h-12 w-2/3 bg-ink-200 dark:bg-ink-800 rounded-xl mb-8" />
          <div className="aspect-video bg-ink-200 dark:bg-ink-800 rounded-2xl mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-ink-200 dark:bg-ink-800 rounded" />
            <div className="h-4 bg-ink-200 dark:bg-ink-800 rounded" />
            <div className="h-4 w-3/4 bg-ink-200 dark:bg-ink-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-32 max-w-2xl mx-auto section-padding text-center">
        <p className="text-lg text-ink-600 dark:text-ink-300 mb-6">{error || 'Article not found.'}</p>
        <button onClick={onBack} className="btn-outline">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="pt-24 pb-32">
      {/* Hero image */}
      {post.thumbnail && (
        <div className="relative h-[300px] md:h-[440px] overflow-hidden">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-ink-950/30" />
        </div>
      )}

      <div className="section-padding max-w-3xl mx-auto">
        <button onClick={onBack} className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-3 transition-all duration-300">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide">
            <Tag className="w-3 h-3" />
            {post.category}
          </span>
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.published_at)}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance leading-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
          {post.excerpt}
        </p>

        {post.video_url && (
          <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-3 transition-all">
            <PlayCircle className="w-5 h-5" />
            Watch the original video on YouTube
            <ArrowRight className="w-4 h-4" />
          </a>
        )}

        <div
          className="mt-10 prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-ink-900 dark:prose-headings:text-white prose-p:text-ink-600 dark:prose-p:text-ink-300 prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-strong:text-ink-900 dark:prose-strong:text-white prose-li:text-ink-600 dark:prose-li:text-ink-300"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </div>

      {/* Subscribe CTA */}
      <div className="section-padding max-w-3xl mx-auto mt-16">
        <SubscribeForm variant="section" />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="section-padding max-w-5xl mx-auto mt-20">
          <h2 className="text-xl font-bold font-display text-ink-900 dark:text-white mb-6">More from the blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((r) => (
              <a
                key={r.id}
                href={`#blog/${r.slug}`}
                className="group rounded-2xl overflow-hidden glass card-hover"
              >
                {r.thumbnail && (
                  <div className="relative aspect-video overflow-hidden">
                    <img src={r.thumbnail} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">{r.category}</span>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{r.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400">{formatDate(r.published_at)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="section-padding max-w-3xl mx-auto mt-16 text-center">
        <p className="text-sm text-ink-400">
          &copy; {new Date().getFullYear()} {channelInfo.name}
        </p>
      </div>
    </article>
  );
}
