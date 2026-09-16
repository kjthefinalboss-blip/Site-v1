import { useReveal, useCountUp } from '@/hooks/useScrollAnimations';
import { stats } from '@/lib/content';
import { Users, PlayCircle, Globe, Calendar } from 'lucide-react';

const iconMap = { Users, PlayCircle, Globe, Calendar };

function StatItem({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const count = useCountUp(stat.value, 2000, isVisible);

  const Icon = iconMap[stat.icon];

  return (
    <div
      ref={ref}
      className={`reveal flex flex-col items-center text-center px-4 py-6 md:py-8 ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
    >
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/15 to-gold-500/15 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold-500 animate-pulse" />
      </div>
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-ink-900 dark:text-white">
        {count}
        <span className="text-brand-600 dark:text-brand-400">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-sm text-ink-500 dark:text-ink-400 tracking-wide uppercase font-medium">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="relative -mt-20 z-20 section-padding">
      <div className="glass rounded-3xl shadow-2xl shadow-ink-900/10 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-ink-100 dark:divide-ink-800">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
