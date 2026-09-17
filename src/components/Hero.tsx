import { useEffect, useState } from 'react';
import { PlayCircle, ArrowRight, Calendar, ChevronDown, Compass, MapPin, Plane } from 'lucide-react';
import { channelInfo } from '@/lib/content';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const parallaxOffset = scrollY * 0.4;
  const textOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px) scale(1.1)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <img
          src="https://images.pexels.com/photos/21377912/pexels-photo-21377912.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280"
          alt="Saudi Arabia desert highway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/50 to-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/40 via-transparent to-gold-900/30" />
      </div>

      {/* Floating decorative orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating travel icons */}
      <div className="absolute top-[20%] right-[15%] text-white/10 animate-float-rotate hidden md:block" style={{ animationDelay: '0s' }}>
        <Compass className="w-16 h-16" />
      </div>
      <div className="absolute bottom-[30%] left-[12%] text-white/10 animate-float-rotate hidden md:block" style={{ animationDelay: '3s' }}>
        <MapPin className="w-12 h-12" />
      </div>
      <div className="absolute top-[35%] left-[8%] text-white/10 animate-float hidden md:block" style={{ animationDelay: '1.5s' }}>
        <Plane className="w-14 h-14" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 section-padding w-full text-center"
        style={{ opacity: textOpacity }}
      >
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 ${
            mounted ? 'animate-fade-in-down' : 'opacity-0'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs font-medium text-ink-100 tracking-wide">
            {channelInfo.uploadSchedule}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        </div>

        {/* Channel name */}
        <h1
          className={`font-display font-black tracking-tight text-white text-balance ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            Raji KRR
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 text-gradient">
            Travel Vlogs
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`mt-6 text-lg md:text-xl text-ink-200 font-medium tracking-wide ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.3s' }}
        >
          {channelInfo.tagline}
        </p>
        <p
          className={`mt-3 text-sm md:text-base text-ink-300 max-w-2xl mx-auto ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          {channelInfo.subtitle}
        </p>

        {/* CTAs */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 ${
            mounted ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.55s' }}
        >
          <a href="#videos" className="btn-primary group">
            <PlayCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Watch Latest Videos
          </a>
          <a
            href={channelInfo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold group"
          >
            Subscribe on YouTube
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Quick stats */}
        <div
          className={`mt-14 flex items-center justify-center gap-8 md:gap-12 ${
            mounted ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.8s' }}
        >
          {[
            { value: '286K+', label: 'Subscribers' },
            { value: '200+', label: 'Videos' },
            { value: '6+', label: 'Countries' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-12">
              {i > 0 && <div className="w-px h-10 bg-white/20" />}
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold font-display text-white">{stat.value}</div>
                <div className="text-xs text-ink-300 mt-1 tracking-wide uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: textOpacity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-ink-300 tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce-slow" />
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 animate-bounce-slow" />
        </div>
      </div>
    </section>
  );
}
