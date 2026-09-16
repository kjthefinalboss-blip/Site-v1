import { useState, FormEvent } from 'react';
import { useReveal } from '@/hooks/useScrollAnimations';
import { channelInfo } from '@/lib/content';
import { Mail, Send, Youtube, Instagram, Bell, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="section-padding py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-ink-950" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-400/20 blur-3xl animate-pulse-slow" />

      <div className="relative max-w-4xl mx-auto">
        <div
          ref={ref}
          className={`reveal text-center ${isVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-widest uppercase mb-4">
            Stay Connected
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white text-balance">
            Never Miss a New Adventure
          </h2>
          <p className="mt-4 text-base text-ink-200 max-w-2xl mx-auto">
            Subscribe to our newsletter for travel tips, behind-the-scenes content, and updates on new videos every Sunday and Thursday.
          </p>

          {/* Newsletter form */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-ink-300 text-sm focus:outline-none focus:border-gold-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gold-500 text-ink-900 font-semibold text-sm transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-gold-300">{error}</p>}
            {submitted && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white animate-fade-in-up">
                <CheckCircle className="w-5 h-5 text-gold-400" />
                You are subscribed! Watch your inbox for travel updates.
              </div>
            )}
          </form>

          {/* Business contact */}
          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-semibold text-white tracking-wide">Business & Collaborations</span>
            </div>
            <a
              href={`mailto:${channelInfo.contactEmail}`}
              className="text-lg font-display font-semibold text-gold-400 hover:text-gold-300 transition-colors duration-300"
            >
              {channelInfo.contactEmail}
            </a>
            <p className="mt-2 text-sm text-ink-200">
              For sponsorships, collaborations, and business inquiries, reach out via email.
            </p>
          </div>

          {/* Social links */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href={channelInfo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href={channelInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${channelInfo.contactEmail}`}
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
