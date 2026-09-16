import { useReveal } from '@/hooks/useScrollAnimations';
import { roadTrips, channelInfo } from '@/lib/content';
import { Route, Clock, MapPin, ArrowRight, Car } from 'lucide-react';

function RoadTripCard({ trip, index }: { trip: typeof roadTrips[number]; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal group relative overflow-hidden rounded-2xl h-72 md:h-80 card-hover ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ ['--reveal-delay' as string]: `${index * 100}ms` }}
    >
      <img
        src={trip.image}
        alt={trip.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />

      {/* Route badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium text-white">
        <Route className="w-3.5 h-3.5 text-gold-400" />
        {trip.route}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-lg md:text-xl font-bold font-display text-white mb-2">
          {trip.title}
        </h3>
        <p className="text-sm text-ink-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 max-h-0 group-hover:max-h-24 overflow-hidden">
          {trip.description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-ink-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            {trip.distance}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            {trip.duration}
          </span>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-brand-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}

export default function RoadTrips() {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="road-trips" className="relative section-padding py-24 md:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/35097388/pexels-photo-35097388.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280"
          alt="Desert highway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink-950/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/80 to-ink-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`reveal text-center mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-4 border border-gold-500/30">
            Cross-Border Adventures
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white text-balance">
            Epic <span className="text-gradient">Road Trips</span>
          </h2>
          <p className="mt-4 text-base text-ink-300 max-w-2xl mx-auto">
            Some of our most popular and helpful content — cross-border Middle Eastern road trips with complete guides, routes, and tips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadTrips.map((trip, i) => (
            <RoadTripCard key={trip.title} trip={trip} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={channelInfo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
          >
            <Car className="w-4 h-4" />
            Watch All Road Trip Videos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
