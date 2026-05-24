import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight, Globe, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'AI Personalities', href: '#ai-tutors' },
        { label: 'FAQ', href: '#faq' },
      ]
    },
    {
      title: 'Learning',
      links: [
        { label: 'Grammar Guide', href: '/grammar' },
        { label: 'Vocabulary Lists', href: '/vocabulary' },
        { label: 'Speaking Drills', href: '/speaking' },
        { label: 'Writing Lab', href: '/writing' },
        { label: 'Reading Club', href: '/reading' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Practice Rooms', href: '/community/rooms' },
        { label: 'Discussion Forum', href: '/community/forum' },
        { label: 'Live Events', href: '/community/events' },
        { label: 'Official Blog', href: '/blog' },
        { label: 'Success Stories', href: '/success-stories' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#f8fbff] dark:bg-[#070b14] text-slate-600 dark:text-slate-400 pt-20 pb-8 relative overflow-hidden transition-colors duration-500 font-sans border-t border-slate-200/60 dark:border-slate-800/60" id="contact">
      
      {/* --- Optimized Background Effects (No CSS Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Hardware-Accelerated Gradients instead of heavy blurs */}
        <div className="absolute -top-[50%] -right-[20%] w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.05)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute -bottom-[50%] -left-[20%] w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        
        {/* Large Watermark Logo */}
        <div className="absolute bottom-0 right-0 opacity-[0.02] dark:opacity-[0.03] transform translate-y-1/3 translate-x-1/4">
           <BrainCircuit width="600" height="600" className="text-slate-900 dark:text-white" />
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* --- Top Section: Brand & Newsletter --- */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">CognitoSpeak</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-sm font-medium">
              The AI-powered platform revolutionizing how the world learns English. Join us and unlock your global potential today.
            </p>
            
            {/* Socials */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Card */}
          <div className="lg:col-span-7 flex lg:justify-end">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group w-full lg:max-w-xl transition-all duration-300 hover:border-teal-200 dark:hover:border-teal-800/50">
              
              {/* Card internal gradient glow (optimized) */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] transform translate-x-1/3 -translate-y-1/3 transition-transform duration-700 group-hover:scale-125" style={{ transform: 'translateZ(0)' }}></div>
              
              <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-2 relative z-10 tracking-tight">Stay ahead of the curve</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10 font-medium max-w-md">
                Get the latest learning tips, feature updates, and community stories delivered directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium text-sm shadow-inner dark:shadow-none"
                />
                <Button className="bg-[#0f172a] dark:bg-emerald-500 text-white dark:hover:bg-emerald-400 hover:bg-black h-auto py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* --- Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#0f172a] dark:text-white mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="group flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 mr-0 group-hover:mr-2 transition-all duration-300 text-teal-500">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.href} 
                        className="group flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 mr-0 group-hover:mr-2 transition-all duration-300 text-teal-500">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* --- Bottom Bar --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center md:text-left">
            &copy; {currentYear} CognitoSpeak Inc. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
             <a href="#" className="hover:text-[#0f172a] dark:hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-[#0f172a] dark:hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-[#0f172a] dark:hover:text-white transition-colors">Cookies</a>
             <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full hidden md:block"></div>
             <a href="#" className="hover:text-[#0f172a] dark:hover:text-white transition-colors flex items-center gap-2 group">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               System Status
             </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;