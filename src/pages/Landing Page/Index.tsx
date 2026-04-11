import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, LogIn } from 'lucide-react';

import Hero from '../../components/Landing Page Component/Hero';
import Features from '../../components/Landing Page Component/Features';
import HowItWorks from '../../components/Landing Page Component/HowItWorks';
import Testimonials from '../../components/Landing Page Component/Testimonials';
import Pricing from '../../components/Landing Page Component/Pricing';
import FAQ from '../../components/Landing Page Component/FAQ';
import CTA from '../../components/Landing Page Component/CTA';
import Footer from '../../components/Landing Page Component/Footer';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-emerald-950/10 flex flex-col">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Neural network pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Cpath d='M7 7 L27 7 M27 7 L47 7 M7 27 L27 27 M27 27 L47 27 M7 47 L27 47 M27 47 L47 47 M7 7 L7 27 M7 27 L7 47 M27 7 L27 27 M27 27 L27 47 M47 7 L47 27 M47 27 L47 47' stroke='%23000000' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Subtle gradient orbs */}
        <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/30 to-teal-100/20 blur-3xl dark:from-emerald-900/10 dark:to-teal-900/5"></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-100/20 to-emerald-100/30 blur-3xl dark:from-cyan-900/5 dark:to-emerald-900/10"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 via-transparent to-teal-50/20 dark:from-emerald-950/10 dark:via-transparent dark:to-teal-950/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img src="/logo.svg" alt="CognitoSpeak Logo" className="w-10 h-10 transition-all duration-300 group-hover:scale-105" />
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
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {mounted && theme === 'dark' ? (
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? (
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
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="py-2 text-base text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2 flex flex-col space-y-3">
                <Link 
                  to="/login" 
                  className="py-2 px-4 rounded-md border border-slate-300 dark:border-slate-700 text-center text-slate-800 dark:text-slate-200 font-medium hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
