import React from 'react';
// import { Link } from 'react-router-dom'; // Removed to avoid Router context error in preview
import { Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Mail, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
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
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 relative overflow-hidden">
      
      {/* --- Decorative Background --- */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[50%] -right-[20%] w-[80rem] h-[80rem] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[50%] -left-[20%] w-[80rem] h-[80rem] bg-blue-600/5 rounded-full blur-[120px]"></div>
        {/* Large Watermark Logo */}
        <div className="absolute bottom-0 right-0 opacity-[0.02] dark:opacity-[0.05] transform translate-y-1/3 translate-x-1/4 pointer-events-none">
           <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900 dark:text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
           </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Top Section: Brand & Newsletter --- */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">CognitoSpeak</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
              The AI-powered platform revolutionizing how the world learns English. Join us and unlock your global potential today.
            </p>
            
            {/* Socials */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl -mr-10 -mt-10 transition-all group-hover:scale-150 duration-700"></div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">Stay ahead of the curve</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 relative z-10">
              Get the latest learning tips, feature updates, and community stories delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 h-auto py-3 px-6 rounded-xl font-semibold">
                Subscribe
              </Button>
            </div>
          </div>

        </div>

        {/* --- Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="group flex items-center text-[15px] text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <span className="w-0 group-hover:w-2 h-[2px] bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500 text-center md:text-left">
            &copy; {currentYear} CognitoSpeak Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
             <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</a>
             <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cookies</a>
             <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               System Status
             </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;