import { useEffect } from 'react';
import { Bell, ExternalLink, Play, Youtube } from 'lucide-react';
import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';

declare global {
  interface Window {
    gapi?: {
      ytsubscribe?: {
        go: () => void;
      };
    };
  }
}

const channelId = 'UC5qk-osYbBIAA-CeUBGOpWg';
const uploadsPlaylistId = 'UU5qk-osYbBIAA-CeUBGOpWg';

export default function YouTubeHub() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLDivElement>();
  const { ref: playerRef, isVisible: playerVisible } = useReveal<HTMLDivElement>();

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-youtube-platform]');

    if (existingScript) {
      window.gapi?.ytsubscribe?.go();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.dataset.youtubePlatform = 'true';
    script.onload = () => window.gapi?.ytsubscribe?.go();
    document.head.appendChild(script);
  }, []);

  return (
    <section className="section-padding py-24 md:py-32 bg-ink-50 dark:bg-ink-900/50 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div
          ref={headingRef}
          className={`reveal mx-auto mb-12 max-w-3xl text-center ${headingVisible ? 'is-visible' : ''}`}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <Youtube className="h-3.5 w-3.5" />
            Watch on YouTube
          </span>
          <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white md:text-4xl lg:text-5xl">
            The journey continues <span className="text-gradient">on screen</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-500 dark:text-ink-400">
            Catch the newest family adventures, practical travel guides, and road-trip stories directly from the channel.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <div
            ref={playerRef}
            className={`reveal overflow-hidden rounded-3xl border border-ink-200/70 bg-ink-950 shadow-2xl shadow-ink-900/10 dark:border-ink-800 ${playerVisible ? 'is-visible' : ''}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Latest uploads</p>
                <p className="mt-1 text-sm text-ink-300">Fresh travel stories from Raji KRR</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/15 text-red-400">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </div>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`}
                title="Latest YouTube uploads from Raji KRR Travel Vlogs"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-ink-200/70 bg-white p-7 shadow-xl shadow-ink-900/5 dark:border-ink-800 dark:bg-ink-950 sm:p-8">
            <div>
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/20">
                <Youtube className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">Join the community</p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink-900 dark:text-white">
                Travel with over 286K subscribers
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                Subscribe for new videos every Sunday and Thursday, from real family road trips to places worth adding to your next itinerary.
              </p>
            </div>

            <div className="mt-8">
              <div className="flex min-h-12 items-center rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-900/70">
                <div
                  className="g-ytsubscribe"
                  data-channelid={channelId}
                  data-layout="full"
                  data-count="default"
                />
              </div>
              <a
                href={channelInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <Bell className="h-4 w-4" />
                Open the channel
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
