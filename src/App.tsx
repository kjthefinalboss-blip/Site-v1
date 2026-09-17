import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import FeaturedVideos from '@/components/FeaturedVideos';
import ContentPillars from '@/components/ContentPillars';
import Destinations from '@/components/Destinations';
import RoadTrips from '@/components/RoadTrips';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Compass, Mountain, Car, Plane, MapPin, Camera, Globe, Tent, Sun, Waves } from 'lucide-react';

const marqueeWords = [
  { text: 'Family Travel', icon: Compass },
  { text: 'Road Trips', icon: Car },
  { text: 'Hidden Gems', icon: Mountain },
  { text: 'Saudi Arabia', icon: MapPin },
  { text: 'Dubai', icon: Sun },
  { text: 'Georgia', icon: Camera },
  { text: 'Oman', icon: Waves },
  { text: 'Desert Safari', icon: Tent },
  { text: 'Middle East', icon: Globe },
  { text: 'Travel Guides', icon: Plane },
];

function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div
        className="aurora-blob w-[500px] h-[500px] bg-brand-400/25 dark:bg-brand-500/15 animate-aurora"
        style={{ top: '-10%', left: '-5%' }}
      />
      <div
        className="aurora-blob w-[600px] h-[600px] bg-gold-400/20 dark:bg-gold-500/10 animate-aurora-reverse"
        style={{ top: '30%', right: '-10%' }}
      />
      <div
        className="aurora-blob w-[450px] h-[450px] bg-brand-300/20 dark:bg-brand-600/10 animate-drift"
        style={{ bottom: '10%', left: '20%' }}
      />
      <div
        className="aurora-blob w-[400px] h-[400px] bg-gold-300/15 dark:bg-gold-600/8 animate-drift-reverse"
        style={{ top: '60%', left: '-8%' }}
      />
    </div>
  );
}

function MarqueeStrip() {
  const items = [...marqueeWords, ...marqueeWords];
  return (
    <div className="relative border-y border-ink-200/60 dark:border-ink-800/60 bg-white/40 dark:bg-ink-900/30 backdrop-blur-sm py-5 overflow-hidden">
      <div className="flex items-center gap-10 animate-marquee whitespace-nowrap">
        {items.map((word, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <word.icon className="w-5 h-5 text-brand-500 dark:text-brand-400" />
            <span className="font-display text-lg font-semibold text-ink-700 dark:text-ink-200 tracking-wide">
              {word.text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60 ml-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-500 relative">
        <AuroraBackground />
        <Navbar />
        <main>
          <Hero />
          <StatsBar />
          <MarqueeStrip />
          <FeaturedVideos />
          <ContentPillars />
          <Destinations />
          <RoadTrips />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
