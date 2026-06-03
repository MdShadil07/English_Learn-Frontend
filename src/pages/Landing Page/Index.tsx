import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, Moon, Sun, Menu, X, Zap } from 'lucide-react';

// ── All components are lazy loaded for maximum performance ────────────────────
const Hero        = lazy(() => import('../../components/Landing Page Component/Hero'));
const Features    = lazy(() => import('../../components/Landing Page Component/Features'));
const HowItWorks  = lazy(() => import('../../components/Landing Page Component/HowItWorks'));
const Pricing     = lazy(() => import('../../components/Landing Page Component/Pricing'));
const Testimonials = lazy(() => import('../../components/Landing Page Component/Testimonials'));
const FAQ         = lazy(() => import('../../components/Landing Page Component/FAQ'));
const CTA         = lazy(() => import('../../components/Landing Page Component/CTA'));
const Footer      = lazy(() => import('../../components/Landing Page Component/Footer'));

import {
  HeroSkeleton,
  FeaturesSkeleton,
  HowItWorksSkeleton,
  PricingSkeleton,
  TestimonialsSkeleton,
  FAQSkeleton,
  CTASkeleton,
  FooterSkeleton
} from '../../components/ui/LandingSkeletons';

// ── Intersection Observer Wrapper for sequential loading ──────────────────────
// This prevents React.lazy from triggering the network request for the chunk
// until the user actually scrolls near the section.
const LazySection = ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible and we trigger the load, we don't need to observe anymore
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      // Root margin 600px means we start loading it before it even enters the screen
      { rootMargin: '600px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {isVisible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Enable smooth anchor scrolling for hash-link navigation
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.style.scrollPaddingTop = '4rem';
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const sectionTargets = [
    { name: 'Features', sectionId: 'features' },
    { name: 'How It Works', sectionId: 'how-it-works' },
    { name: 'Testimonials', sectionId: 'testimonials' },
    { name: 'Pricing', sectionId: 'pricing' },
    { name: 'FAQ', sectionId: 'faq' }
  ] as const;

  const navigateToSection = (sectionId: string, closeMenu = false) => {
    if (closeMenu) {
      setIsMenuOpen(false);
    }

    window.setTimeout(() => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      const headerOffset = 80;
      const elementTop = sectionElement.getBoundingClientRect().top + window.pageYOffset;
      const targetTop = Math.max(0, elementTop - headerOffset);

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }, closeMenu ? 180 : 0);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-emerald-950/10 flex flex-col overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Neural network pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Cpath d='M7 7 L27 7 M27 7 L47 7 M7 27 L27 27 M27 27 L47 27 M7 47 L27 47 M27 47 L47 47 M7 7 L7 27 M7 27 L7 47 M27 7 L27 27 M27 27 L27 47 M47 7 L47 27 M47 27 L47 47' stroke='%23000000' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Subtle gradient orbs (Optimized with radial gradients instead of heavy blur filters) */}
        <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.2)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.1)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(207,250,254,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(8,145,178,0.05)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 via-transparent to-teal-50/20 dark:from-emerald-950/10 dark:via-transparent dark:to-teal-950/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img src="/logo.svg" alt="CognitoSpeak Logo" className="w-10 h-10 transition-all duration-300 group-hover:scale-105" width="40" height="40" />
                  <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-emerald-800 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
                    CognitoSpeak
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium opacity-80">
                    AI-Powered Learning
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                {sectionTargets.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => navigateToSection(item.sectionId)}
                    className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20 transition-colors">
                    <LogIn className="mr-1 h-4 w-4" /> Sign In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group">
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-current" />
                      Free Trial
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 px-4 pt-2 pb-4 border-t border-slate-200 dark:border-slate-800">
            <nav className="flex flex-col space-y-3">
              {sectionTargets.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => navigateToSection(item.sectionId, true)}
                  className="py-2 text-base text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-medium text-left w-full cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-900 hover:to-black text-white text-center font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-slate-500/20 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                </Link>
                <Link
                  to="/signup"
                  className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white text-center font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    Free Trial
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow pt-16">
        
        {/* Hero — still eager visually, but code chunk is lazy loaded */}
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>

        {/* Below-fold sections — chunks ONLY download when scrolled near */}
        <LazySection fallback={<FeaturesSkeleton />}>
          <Features />
        </LazySection>
        <LazySection fallback={<HowItWorksSkeleton />}>
          <HowItWorks />
        </LazySection>
        <LazySection fallback={<PricingSkeleton />}>
          <Pricing />
        </LazySection>
        <LazySection fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </LazySection>
        <LazySection fallback={<FAQSkeleton />}>
          <FAQ />
        </LazySection>
        <LazySection fallback={<CTASkeleton />}>
          <CTA />
        </LazySection>
      </main>

      {/* Footer */}
      <LazySection fallback={<FooterSkeleton />}>
        <Footer />
      </LazySection>
    </div>

  );
};

export default LandingPage;
