import { useEffect, useState } from 'react';
import { Youtube, Instagram, Mail, ChevronUp, Calendar, Heart } from 'lucide-react';
import { channelInfo, navLinks } from '@/lib/content';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <footer className="relative bg-ink-950 text-ink-300 overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-gold-500 to-brand-500" />

      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
                  <Youtube className="w-5 h-5 text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-ink-950" />
                </div>
                <div className="leading-tight">
                  <span className="block text-sm font-bold font-display text-white">Raji KRR</span>
                  <span className="block text-[10px] font-medium text-brand-400 tracking-widest uppercase">Travel Vlogs</span>
                </div>
              </div>
              <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
                Family-oriented travel, road trips, and practical tourism guides across Saudi Arabia, the Middle East, and beyond.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gold-500">
                <Calendar className="w-3.5 h-3.5" />
                {channelInfo.uploadSchedule}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-400 hover:text-brand-400 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content categories */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Content</h4>
              <ul className="space-y-2.5">
                {['Family Travel', 'Travel Guides', 'Hidden Gems', 'Luxury & Comfort', 'Road Trips'].map((cat) => (
                  <li key={cat}>
                    <a
                      href="#videos"
                      className="text-sm text-ink-400 hover:text-brand-400 transition-colors duration-300"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">Connect</h4>
              <div className="flex items-center gap-3 mb-4">
                <a
                  href={channelInfo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-ink-300 hover:bg-brand-600 hover:text-white transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href={channelInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-ink-300 hover:bg-brand-600 hover:text-white transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${channelInfo.businessEmail}`}
                  className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-ink-300 hover:bg-brand-600 hover:text-white transition-all duration-300"
                  aria-label="Business email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <a
                href={`mailto:${channelInfo.businessEmail}`}
                className="text-sm text-ink-400 hover:text-gold-400 transition-colors duration-300 break-all block"
              >
                {channelInfo.businessEmail}
              </a>
              <a
                href={`mailto:${channelInfo.collaborationEmail}`}
                className="text-sm text-ink-400 hover:text-brand-400 transition-colors duration-300 break-all block mt-1"
              >
                {channelInfo.collaborationEmail}
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-500">
              &copy; {new Date().getFullYear()} Raji KRR Travel Vlogs. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-ink-500">
              Made with <Heart className="w-3.5 h-3.5 text-brand-500" /> for travel enthusiasts
            </p>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-brand-600 text-white shadow-2xl shadow-brand-600/40 flex items-center justify-center transition-all duration-500 ease-out-expo hover:bg-brand-700 hover:scale-110 ${
          showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
