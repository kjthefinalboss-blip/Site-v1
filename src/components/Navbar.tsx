import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Youtube } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useScrollProgress, useActiveSection } from '@/hooks/useScrollAnimations';
import { navLinks, channelInfo } from '@/lib/content';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();
  const activeSection = useActiveSection(navLinks.map((l) => l.href.replace('#', '')));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${
          scrolled
            ? 'glass shadow-lg shadow-ink-900/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="section-padding flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30 transition-transform duration-300 group-hover:scale-110">
              <Youtube className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-white dark:border-ink-950" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-sm font-bold font-display tracking-tight text-ink-900 dark:text-white">
                Raji KRR
              </span>
              <span className="block text-[10px] font-medium text-brand-600 dark:text-brand-400 tracking-widest uppercase">
                Travel Vlogs
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-gold-500" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative w-10 h-10 rounded-full glass flex items-center justify-center text-ink-700 dark:text-ink-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300 overflow-hidden"
            >
              <Sun className={`w-4.5 h-4.5 absolute transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
              <Moon className={`w-4.5 h-4.5 absolute transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
            </button>

            <a
              href={channelInfo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex btn-primary !px-5 !py-2.5"
            >
              <Youtube className="w-4 h-4" />
              Subscribe
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-ink-800 dark:text-ink-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-gold-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-ink-900 shadow-2xl transition-transform duration-500 ease-out-expo ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-ink-100 dark:border-ink-800">
            <span className="font-display font-bold text-ink-900 dark:text-white">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-700 dark:text-ink-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium text-ink-700 dark:text-ink-200 hover:bg-brand-50 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300"
                style={{
                  animation: mobileOpen ? `fadeInUp 0.4s ease-out ${i * 60}ms forwards` : 'none',
                  opacity: 0,
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={channelInfo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              <Youtube className="w-4 h-4" />
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
