import { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { channelInfo } from '@/lib/content';

export default function SubscribeForm({ variant = 'section' }: { variant?: 'section' | 'compact' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to subscribe.');
      }
      setStatus('success');
      setMessage(result.message || 'Successfully subscribed!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe. Please try again.');
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
            disabled={status === 'loading' || status === 'success'}
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="btn-primary shrink-0 !px-6 !py-3"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>
        {message && (
          <p className={`text-xs text-center sm:absolute sm:bottom-[-24px] sm:left-0 sm:right-0 ${status === 'success' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="relative rounded-3xl border border-ink-200/80 dark:border-ink-700/60 bg-gradient-to-br from-brand-50/90 to-gold-50/50 dark:from-brand-900/20 dark:to-gold-900/10 backdrop-blur-xl p-8 md:p-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-400/15 blur-3xl" />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-ink-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-widest uppercase mb-5">
          <Mail className="w-3.5 h-3.5" />
          Stay Updated
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-ink-900 dark:text-white text-balance">
          Never miss a journey
        </h3>
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          Subscribe to get an email every time {channelInfo.name} publishes a new YouTube video, Instagram Reel, or blog post.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-3.5 rounded-full bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
              disabled={status === 'loading' || status === 'success'}
              aria-label="Email address"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="btn-primary shrink-0"
          >
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Done!' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
