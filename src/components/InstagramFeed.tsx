import { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';
import { supabase } from '@/lib/supabaseClient';
import { Instagram, Heart, ExternalLink, RefreshCw } from 'lucide-react';

type InstagramPost = {
  id: string;
  shortcode: string;
  caption: string;
  image_url: string;
  post_url: string;
  likes: string;
  sort_order: number;
};

function PostTile({ post, index }: { post: InstagramPost; index: number }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={post.post_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`reveal group relative aspect-square overflow-hidden rounded-2xl card-hover ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${(index % 3) * 120}ms` }}
    >
      <img
        src={post.image_url}
        alt={post.caption}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
        <ExternalLink className="w-4 h-4 text-white" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 ease-out-expo">
        <p className="text-white text-sm font-medium leading-snug line-clamp-2 drop-shadow-lg">
          {post.caption}
        </p>
        {post.likes && (
          <div className="mt-2 flex items-center gap-1.5 text-white/90 text-xs font-medium">
            <Heart className="w-3.5 h-3.5 fill-white/90" />
            <span>{post.likes}</span>
          </div>
        )}
      </div>
    </a>
  );
}

export default function InstagramFeed() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('instagram_posts')
          .select('id, shortcode, caption, image_url, post_url, likes, sort_order')
          .order('sort_order', { ascending: true })
          .limit(6);

        if (queryError) throw queryError;
        if (!data || data.length === 0) {
          throw new Error('No Instagram posts are available yet.');
        }
        setPosts(data);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Unable to load Instagram posts.';
        setError(message === 'No Instagram posts are available yet.' ? message : 'Unable to load Instagram posts right now.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <section id="instagram" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/[0.03] via-transparent to-brand-500/[0.02] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`reveal text-center mb-14 ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-gold-50 dark:from-brand-900/30 dark:to-gold-900/20 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Instagram className="w-4 h-4" />
            Instagram
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Latest <span className="text-gradient">Instagram Posts</span>
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            Follow along on Instagram for daily travel moments, behind-the-scenes, and stunning destinations from {channelInfo.name}.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" aria-label="Loading Instagram posts">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="aspect-square rounded-2xl bg-white/60 dark:bg-ink-900/60 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="max-w-xl mx-auto rounded-2xl border border-brand-200 dark:border-brand-800 bg-white/70 dark:bg-ink-900/70 p-8 text-center">
            <p className="text-ink-700 dark:text-ink-200">{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-outline mt-5">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {posts.map((post, index) => (
              <PostTile key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href={channelInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-primary group">
            <Instagram className="w-4 h-4" />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
