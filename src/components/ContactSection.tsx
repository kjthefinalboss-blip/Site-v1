import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';
import { ArrowUpRight, Instagram, Mail, MapPin, Youtube } from 'lucide-react';

const collaborationSubject = encodeURIComponent('Collaboration enquiry for Raji KRR Travel Vlogs');

export default function ContactSection() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="section-padding py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.08] via-transparent to-gold-500/[0.08] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'is-visible' : ''}`}
        >
          <div className="rounded-3xl border border-ink-200/80 dark:border-ink-700/60 bg-white/85 dark:bg-ink-900/70 backdrop-blur-xl shadow-xl shadow-ink-900/5 overflow-hidden">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 md:p-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-widest uppercase">
                  <Mail className="w-4 h-4" />
                  Get in touch
                </span>
                <h2 className="mt-5 text-3xl md:text-4xl font-bold font-display text-ink-900 dark:text-white text-balance">
                  Let&apos;s plan your next <span className="text-gradient">adventure</span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 dark:text-ink-300">
                  Have a collaboration idea, destination suggestion, or question about a trip? Send a message and the team will get back to you.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${channelInfo.collaborationEmail}?subject=${collaborationSubject}`}
                    className="btn-primary"
                  >
                    <Mail className="w-4 h-4" />
                    Email for collaborations
                  </a>
                  <a href={`mailto:${channelInfo.businessEmail}`} className="btn-outline">
                    General enquiries
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-ink-200/80 dark:border-ink-700/60 bg-ink-50/70 dark:bg-ink-950/30 p-8 md:p-12">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400">Based in</p>
                    <p className="mt-1 font-display font-semibold text-ink-900 dark:text-white">{channelInfo.baseLocation}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-ink-200/80 dark:border-ink-700/60 pt-6">
                  <p className="text-xs font-semibold tracking-widest uppercase text-ink-500 dark:text-ink-400">Follow the journey</p>
                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={channelInfo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit YouTube channel"
                      className="w-11 h-11 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-700 dark:hover:text-brand-300 hover:border-brand-500 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                    <a
                      href={channelInfo.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit Instagram profile"
                      className="w-11 h-11 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-700 dark:hover:text-brand-300 hover:border-brand-500 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
