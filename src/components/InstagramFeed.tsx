import { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';
import { supabase } from '@/lib/supabaseClient';
import { Instagram, ExternalLink, RefreshCw, Calendar } from 'lucide-react';

type InstagramReel = {
  id: string;
  shortcode: string;
  caption: string;
  image_url: string;
  post_url: string;
  likes: string;
  sort_order: number;
  created_at: string;
};

type InstagramResponse = {
  reels?: InstagramReel[];
};

function formatPostedDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function ReelCard({ reel, index }: { reel: InstagramReel; index: number }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={reel.post_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`reveal group relative aspect-[9/16] overflow-hidden rounded-2xl bg-ink-950 card-hover ${isVisible ? 'is-visible' : ''}`}
      style={{ ['--reveal-delay' as string]: `${(index % 3) * 120}ms` }}
      aria-label={`Watch ${reel.caption} on Instagram`}
    >
      <img src={reel.image_url} alt={reel.caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/15 to-ink-950/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
          <svg className="w-7 h-7 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-ink-950/85 px-3 py-2 text-white text-xs font-semibold backdrop-blur-md">
        <span className="line-clamp-2">{reel.caption}</span>
        <span className="mt-1 flex items-center gap-1 text-white/65 text-[10px] font-medium">
          <Calendar className="w-3 h-3" />
          {formatPostedDate(reel.created_at)}
        </span>
        <span className="mt-1 inline-flex items-center gap-1 text-brand-300 text-[10px] uppercase tracking-wide">
          <ExternalLink className="w-3 h-3" />
          Open on Instagram
        </span>
      </div>
    </a>
  );
}

export default function InstagramFeed() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>();
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReels = async () => {
      if (!supabase) {
        setError('Instagram Reels are unavailable right now.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/latest-instagram`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        });
        const result = (await response.json()) as InstagramResponse;
        if (!response.ok || !Array.isArray(result.reels) || result.reels.length === 0) {
          throw new Error('Unable to refresh Instagram Reels.');
        }
        setReels(result.reels);
      } catch {
        const { data, error: queryError } = await supabase
          .from('instagram_posts')
          .select('id, shortcode, caption, image_url, post_url, likes, sort_order, created_at')
          .order('sort_order', { ascending: true })
          .limit(6);

        if (queryError || !data || data.length === 0) {
          setError('Instagram Reels are unavailable right now.');
        } else {
          setReels(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadReels();
  }, []);

  return (
    <section id="instagram" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/[0.04] via-transparent to-brand-500/[0.04] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headerRef} className={`reveal text-center mb-14 ${headerVisible ? 'is-visible' : ''}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-950/80 text-brand-300 text-xs font-semibold tracking-widest uppercase mb-4">
            <Instagram className="w-4 h-4" />
            Instagram Reels
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Latest <span className="text-gradient">Instagram Reels</span>
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            Watch the latest travel moments from {channelInfo.name} on Instagram.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" aria-label="Loading Instagram Reels">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[9/16] rounded-2xl bg-ink-900/10 dark:bg-white/10 animate-pulse" />)}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {reels.map((reel, index) => <ReelCard key={reel.id} reel={reel} index={index} />)}
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
