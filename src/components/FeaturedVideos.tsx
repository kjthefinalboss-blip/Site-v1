import { useReveal } from '@/hooks/useScrollAnimations';
import { featuredVideos, channelInfo } from '@/lib/content';
import { PlayCircle, Clock, ArrowRight, ExternalLink, ThumbsUp } from 'lucide-react';

function VideoCard({ video, index }: { video: typeof featuredVideos[number]; index: number }) {
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
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-600/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wide">
          {video.category}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-ink-950/80 backdrop-blur-sm text-white text-xs font-medium">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-brand-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 ease-out-expo">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-base text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{video.views} views</span>
          </div>
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

  return (
    <section id="videos" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.02] to-gold-500/[0.03] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
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
            Dive into our most popular travel guides, road trips, and family adventures across the Middle East and beyond.
          </p>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredVideos.map((video, i) => (
            <VideoCard key={i} video={video} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href={channelInfo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline group"
          >
            <ExternalLink className="w-4 h-4" />
            View All Videos on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
