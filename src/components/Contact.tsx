import { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo, featuredVideos } from '@/lib/content';
import { PlayCircle, Calendar, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  category: string;
};

type VideosResponse = {
  videos?: Video[];
  error?: string;
};

function formatPublishedDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

const fallbackVideos: Video[] = featuredVideos.slice(0, 6).map((video, index) => ({
  id: `fallback-${index}`,
  title: video.title,
  publishedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 5).toISOString(),
  thumbnail: video.thumbnail,
  url: video.url,
  category: video.category,
}));

function VideoCard({ video, index }: { video: Video; index: number }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`reveal featured-video-card group relative overflow-hidden rounded-2xl card-hover ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${(index % 3) * 120}ms`, ['--glow-color' as string]: 'rgba(16,185,129,0.3)' }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-600/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wide">
          {video.category}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-ink-950/80 backdrop-blur-sm text-white text-xs font-medium">
          <Calendar className="w-3 h-3" />
          {formatPublishedDate(video.publishedAt)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-brand-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 ease-out-expo">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-base text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center justify-end">
          <span className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Watch <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function FeaturedVideos() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>();
  const [videos, setVideos] = useState<Video[]>(fallbackVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/latest-videos`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
        });
        const result = (await response.json()) as VideosResponse;
        if (!response.ok || !Array.isArray(result.videos) || result.videos.length === 0) {
          throw new Error(result.error || 'No videos are available right now.');
        }
        setVideos(result.videos.slice(0, 6));
        setError('');
      } catch (loadError) {
        setVideos(fallbackVideos);
        setError('');
      } finally {
        setIsLoading(false);
      }
    };

    void loadVideos();
  }, []);

  return (
    <section id="videos" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.02] to-gold-500/[0.03] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`reveal text-center mb-14 ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Featured Content
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Latest <span className="text-gradient">Travel Videos</span>
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            The six newest adventures from {channelInfo.name}, updated automatically as new videos are published.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" aria-label="Loading latest videos">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl bg-white/60 dark:bg-ink-900/60 animate-pulse">
                <div className="aspect-video bg-ink-200 dark:bg-ink-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded bg-ink-200 dark:bg-ink-800" />
                  <div className="h-4 w-2/3 rounded bg-ink-200 dark:bg-ink-800" />
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href={channelInfo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline group">
            <ExternalLink className="w-4 h-4" />
            View All Videos on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
