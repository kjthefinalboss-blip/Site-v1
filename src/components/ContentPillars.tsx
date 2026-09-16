import { useReveal } from '@/hooks/useScrollAnimations';
import { contentPillars } from '@/lib/content';
import { Users, Compass, Sparkles, Hotel, ArrowRight } from 'lucide-react';

const iconMap = { Users, Compass, Sparkles, Hotel };

function PillarCard({ pillar, index }: { pillar: typeof contentPillars[number]; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const Icon = iconMap[pillar.icon];

  return (
    <div
      ref={ref}
      className={`reveal group relative overflow-hidden rounded-2xl h-80 md:h-96 card-hover ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
    >
      {/* Background image */}
      <img
        src={pillar.image}
        alt={pillar.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-br ${pillar.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-2">
            {pillar.title}
          </h3>
          <p className="text-sm text-ink-200 leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            {pillar.description}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            Explore content
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.accent} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
    </div>
  );
}

export default function ContentPillars() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section className="section-padding py-24 md:py-32 bg-ink-50 dark:bg-ink-900/50 relative overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`reveal text-center mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-xs font-semibold tracking-widest uppercase mb-4">
            What We Create
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white text-balance">
            Four Pillars of <span className="text-gradient">Travel Content</span>
          </h2>
          <p className="mt-4 text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            Every video falls into one of these core themes — designed to help you travel smarter, explore deeper, and stay comfortable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentPillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
