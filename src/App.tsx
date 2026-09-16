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

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-ink-950 transition-colors duration-500">
        <Navbar />
        <main>
          <Hero />
          <StatsBar />
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
