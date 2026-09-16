import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';
import { Youtube, Instagram, Mail, Calendar, Globe, Heart, MapPin } from 'lucide-react';

export default function About() {
  const { ref: imageRef, isVisible: imageVisible } = useReveal<HTMLDivElement>();
  const { ref: textRef, isVisible: textVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="section-padding py-24 md:py-32 bg-ink-50 dark:bg-ink-900/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div
            ref={imageRef}
            className={`reveal-left relative ${imageVisible ? 'is-visible' : ''}`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ink-900/20">
              <img
                src="https://images.pexels.com/photos/35166960/pexels-photo-35166960.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1500"
                alt="Travel filmmaker capturing landscape"
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 glass rounded-2xl p-5 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold font-display text-ink-900 dark:text-white">6+</div>
                  <div className="text-xs text-ink-500 dark:text-ink-400">Countries</div>
                </div>
              </div>
            </div>

            {/* Floating badge top */}
            <div className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-medium text-ink-700 dark:text-ink-200">Based in Saudi Arabia</span>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div
            ref={textRef}
            className={`reveal-right ${textVisible ? 'is-visible' : ''}`}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-widest uppercase mb-4">
              About the Channel
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance leading-tight">
              The Story Behind <span className="text-gradient">Raji KRR Travel Vlogs</span>
            </h2>

            <p className="mt-6 text-base text-ink-600 dark:text-ink-300 leading-relaxed">
              Raji KRR Travel Vlogs (also known as KRR Travel Vlogs Official) is a popular YouTube channel
              based in Saudi Arabia that focuses on family-oriented travel, road trips, and practical tourism guides.
              Hosted by Raji, the channel primarily features content in Malayalam, though its visual guides appeal to a broad audience.
            </p>
            <p className="mt-4 text-base text-ink-600 dark:text-ink-300 leading-relaxed">
              Launched on {channelInfo.launchDate}, the channel has grown to over 286,000 subscribers by
              documenting real family travel experiences across Saudi Arabia, the UAE, Oman, Qatar, Bahrain, and Georgia.
            </p>

            {/* Info grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Launched', value: channelInfo.launchDate },
                { icon: MapPin, label: 'Based In', value: channelInfo.baseLocation },
                { icon: Globe, label: 'Language', value: channelInfo.language },
                { icon: Heart, label: 'Upload Schedule', value: 'Sun & Thu' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl glass-card">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <div className="text-xs text-ink-500 dark:text-ink-400">{item.label}</div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href={channelInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={channelInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${channelInfo.contactEmail}`}
                className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-600 dark:hover:text-brand-400 hover:scale-110 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
