import { useReveal } from '@/hooks/useScrollAnimations';
import { destinations } from '@/lib/content';
import { MapPin, ArrowRight } from 'lucide-react';

function DestinationCard({ dest, index }: { dest: typeof destinations[number]; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  const sizeClasses: Record<string, string> = {
    large: 'sm:col-span-2 sm:row-span-2 min-h-[400px]',
    medium: 'min-h-[300px]',
    small: 'min-h-[260px]',
  };

  return (
    <div
      ref={ref}
      className={`reveal group relative overflow-hidden rounded-2xl ${sizeClasses[dest.size] ?? 'min-h-[300px]'} card-hover ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${index * 100}ms` }}
    >
      <img
        src={dest.image}
        alt={dest.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />

      {/* Video count badge */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs font-medium text-white">
        {dest.videoCount}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex items-center gap-1.5 text-gold-400 text-xs font-medium tracking-wide mb-2">
          <MapPin className="w-3.5 h-3.5" />
          {dest.regions}
        </div>
        <h3 className={`font-bold font-display text-white ${dest.size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {dest.name}
        </h3>
        <p className="mt-2 text-sm text-ink-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 max-h-0 group-hover:max-h-32 overflow-hidden">
          {dest.description}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
          Watch videos
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-gold-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}

export default function Destinations() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="destinations" className="section-padding py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`reveal text-center mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Explore the World
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Destinations <span className="text-gradient">We Cover</span>
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            From the mountains of Abha to the shores of Georgia — explore the places we have documented for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[260px] gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.name} dest={dest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
