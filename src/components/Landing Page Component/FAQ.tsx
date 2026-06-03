import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, Search, MessageCircle, 
  HelpCircle, Mail, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';

type FAQItemType = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const faqItems: FAQItemType[] = [
  {
    id: 'diff',
    question: "What makes CognitoSpeak different?",
    answer: "CognitoSpeak combines advanced AI technology with proven language learning methods. Unlike apps with scripted lessons, our AI adapts to your interests and learning style, providing real-time feedback on grammar, pronunciation, and fluency—just like a personal tutor.",
    category: "General"
  },
  {
    id: 'personalities',
    question: "How do the AI personalities work?",
    answer: "We offer 5 unique AI tutors: Professor Palmer (Academic), Coach Taylor (Motivational), Storyteller Maya (Narrative), Business Pro Alex (Professional), and Explorer Zoe (Cultural). Each adapts to your level, providing personalized feedback suited to their persona.",
    category: "Features"
  },
  {
    id: 'beginners',
    question: "Is it suitable for complete beginners?",
    answer: "Absolutely! We offer a structured curriculum starting with basic phrases. Our AI tutors adjust their speaking pace and vocabulary complexity to match your current level, ensuring a comfortable learning curve.",
    category: "General"
  },
  {
    id: 'pronunciation',
    question: "How accurate is the pronunciation feedback?",
    answer: "Our system uses speech recognition trained specifically on non-native speakers. It identifies subtle phoneme errors and provides visual feedback to help you master challenging sounds. Most users see improvement within weeks.",
    category: "Technical"
  },
  {
    id: 'tests',
    question: "Can I prepare for TOEFL or IELTS?",
    answer: "Yes! We have specialized modules for major proficiency tests. Our AI can conduct mock interviews, review essay structures, and help you practice specific question types found in TOEFL, IELTS, and Cambridge exams.",
    category: "Learning"
  },
  {
    id: 'community',
    question: "How does the community feature work?",
    answer: "Connect with learners worldwide in topic-based practice rooms. You can join conversation clubs, participate in language exchanges, or ask questions in our forums. It's a great way to practice with peers.",
    category: "Community"
  },
  {
    id: 'devices',
    question: "Can I use it on multiple devices?",
    answer: "Yes, your progress syncs seamlessly across our web platform, iOS app, and Android app. Premium subscribers enjoy unlimited device access simultaneously.",
    category: "Technical"
  },
  {
    id: 'trial',
    question: "What happens after the free trial?",
    answer: "After your 7-day trial, your account converts to the selected plan. You can downgrade to the Free plan at any time. All your progress and history will be preserved regardless of your subscription status.",
    category: "Billing"
  }
];

interface FAQItemProps {
  item: FAQItemType;
  isOpen: boolean;
  onClick: () => void;
}

type SupportCategory = 'general' | 'billing' | 'technical' | 'account' | 'feature';
type SupportUrgency = 'low' | 'normal' | 'high' | 'urgent';

interface SupportFormState {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  urgency: SupportUrgency;
  message: string;
}

const initialSupportForm = (): SupportFormState => ({
  name: '',
  email: '',
  subject: '',
  category: 'general',
  urgency: 'normal',
  message: '',
});

const FAQItem = React.forwardRef<HTMLDivElement, FAQItemProps>(({ item, isOpen, onClick }, ref) => {
  return (
    <motion.div 
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md ${
        isOpen 
          ? 'bg-white/95 dark:bg-slate-800/95 border border-teal-300/50 dark:border-teal-700/50 shadow-lg shadow-teal-500/5 dark:shadow-none z-10' 
          : 'bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 hover:border-teal-200/60 dark:hover:border-teal-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm z-0'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
      >
        <span className={`text-[15px] md:text-base font-extrabold tracking-tight transition-colors duration-300 pr-4 ${
          isOpen ? 'text-[#0f172a] dark:text-white' : 'text-slate-700 dark:text-slate-200'
        }`}>
          {item.question}
        </span>
        <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 shadow-sm ${
          isOpen ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 group-hover:text-teal-600 dark:group-hover:text-teal-400'
        }`}>
          {isOpen ? <Minus className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 md:px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-[15px] border-t border-slate-100/60 dark:border-slate-700/50 pt-5">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState<SupportFormState>(initialSupportForm);
  const [supportStatus, setSupportStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTicketNumber, setSupportTicketNumber] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem('userData');
      if (!cachedUser) {
        return;
      }

      const parsedUser = JSON.parse(cachedUser) as { fullName?: string; firstName?: string; lastName?: string; email?: string };
      const prefixedName = [parsedUser.firstName, parsedUser.lastName].filter(Boolean).join(' ').trim();

      setSupportForm((current) => ({
        ...current,
        name: parsedUser.fullName || prefixedName || current.name,
        email: parsedUser.email || current.email,
      }));
    } catch {
      // Ignore cached profile parse failures and let the user type manually.
    }
  }, []);

  const filteredItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const openSupportForm = (context?: Partial<SupportFormState>) => {
    setSupportStatus('idle');
    setSupportMessage('');
    setSupportTicketNumber(null);
    setSupportForm((current) => ({
      ...current,
      ...context,
    }));
    setIsSupportOpen(true);
  };

  const closeSupportForm = () => {
    if (supportStatus === 'submitting') {
      return;
    }

    setIsSupportOpen(false);
    setSupportMessage('');
    setSupportStatus('idle');
    setSupportTicketNumber(null);
  };

  const handleSupportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supportForm.name.trim() || !supportForm.email.trim() || !supportForm.message.trim()) {
      setSupportStatus('error');
      setSupportMessage('Please complete your name, email, and message before submitting.');
      return;
    }

    setSupportStatus('submitting');
    setSupportMessage('');
    setSupportTicketNumber(null);

    try {
      const response = await api.support.submitRequest({
        ...supportForm,
        source: 'landing-page-faq',
        pageUrl: window.location.href,
        referrer: document.referrer || undefined,
        browserLanguage: navigator.language,
        userAgent: navigator.userAgent,
      });

      setSupportTicketNumber(response.data?.ticketNumber ?? null);
      setSupportStatus('success');
      setSupportMessage(response.message || 'Your support request has been submitted successfully.');
      setSupportForm((current) => ({
        ...current,
        subject: current.subject || 'Support request from CognitoSpeak',
      }));
    } catch (error) {
      setSupportStatus('error');
      setSupportMessage(error instanceof Error ? error.message : 'Unable to submit your support request. Please try again later.');
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] relative overflow-hidden transition-colors duration-500 ease-in-out font-sans scroll-mt-24 lg:scroll-mt-32" id="faq">
      
      {/* --- Optimized Background Elements (No CSS Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* --- Left Column: Header & Support Card --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div className="mx-auto lg:mx-0 inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500">
                <HelpCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Support Center</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-6 text-[#0f172a] dark:text-white tracking-tight leading-[1.1]">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2">Questions</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                Everything you need to know about the platform. Can't find the answer you're looking for? We're here to help.
              </p>

              {/* Search Bar */}
              <div className="relative mb-10 max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-500 outline-none transition-all shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-[15px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Mobile Support Card (Pinned near the top for visibility) */}
              <div className="lg:hidden mb-10 p-6 rounded-[2rem] bg-[#0f172a] dark:bg-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden transform translateZ(0)">
                <div className="absolute top-[-20%] right-[-10%] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none" style={{ transform: 'translateZ(0)' }} />
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50 shadow-sm backdrop-blur-sm">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-extrabold mb-2 tracking-tight">Need help?</h4>
                  <p className="text-slate-400 text-sm mb-5 font-medium leading-relaxed">
                    Contact support or open the docs right from here.
                  </p>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => openSupportForm()}
                      className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-0 justify-center shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Contact Support
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-12 rounded-xl border-slate-700 bg-white/5 hover:bg-white/10 text-white font-bold justify-center backdrop-blur-md transition-all"
                    >
                      <Link to="/docs">
                        <FileText className="w-4 h-4 mr-2" /> Documentation
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Support Card (Desktop) */}
              <div className="hidden lg:block p-8 rounded-[2rem] bg-[#0f172a] dark:bg-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden transform translateZ(0)">
                <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-5 border border-slate-700/50 shadow-sm backdrop-blur-sm">
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-extrabold mb-2 tracking-tight">Still have questions?</h4>
                  <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                    Our dedicated support team is available 24/7 to assist you with any technical or billing inquiries.
                  </p>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => openSupportForm()}
                      className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-0 justify-center shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Contact Support
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-12 rounded-xl border-slate-700 bg-white/5 hover:bg-white/10 text-white font-bold justify-center backdrop-blur-md transition-all hover:-translate-y-0.5"
                    >
                      <Link to="/docs">
                        <FileText className="w-4 h-4 mr-2" /> Documentation
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Right Column: FAQ Items --- */}
          <div className="lg:col-span-7">
            <motion.div 
              className="space-y-4"
              layout
            >
              <AnimatePresence mode='popLayout'>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <FAQItem 
                      key={item.id} 
                      item={item} 
                      isOpen={openId === item.id} 
                      onClick={() => handleToggle(item.id)} 
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-center py-16 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem]"
                  >
                    <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0f172a] dark:text-white mb-2">No questions found</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Try adjusting your search terms.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

        </div>
      </div>

      <AnimatePresence>
        {isSupportOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close support form"
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              onClick={closeSupportForm}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-dialog-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="border-b border-slate-200/70 px-6 py-5 dark:border-slate-800 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <MessageCircle className="h-4 w-4" /> Support request
                    </div>
                    <h3 id="support-dialog-title" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Contact our support team
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Submit a ticket and we will queue it with a reference number, email confirmation, and internal routing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeSupportForm}
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Close support form"
                    disabled={supportStatus === 'submitting'}
                  >
                    <Minus className="h-5 w-5 rotate-45" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSupportSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-6 sm:px-8">
                {supportStatus === 'success' ? (
                  <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                      <Mail className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Support request submitted</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{supportMessage}</p>
                    {supportTicketNumber && (
                      <div className="mt-5 rounded-2xl border border-emerald-200 bg-white px-4 py-3 font-mono text-sm font-semibold tracking-wide text-emerald-700 dark:border-emerald-900/60 dark:bg-slate-950 dark:text-emerald-300">
                        Ticket {supportTicketNumber}
                      </div>
                    )}
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      Our team will review the ticket and the confirmation email will be sent automatically if an address was provided.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={() => {
                          setSupportStatus('idle');
                          setSupportTicketNumber(null);
                          setSupportMessage('');
                          setSupportForm(initialSupportForm());
                        }}
                        className="h-12 rounded-xl bg-emerald-500 px-5 font-bold text-white hover:bg-emerald-400"
                      >
                        Send another request
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeSupportForm}
                        className="h-12 rounded-xl border-slate-200 px-5 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {supportStatus === 'error' && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                        {supportMessage}
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your name</span>
                        <input
                          type="text"
                          value={supportForm.name}
                          onChange={(event) => setSupportForm((current) => ({ ...current, name: event.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          disabled={supportStatus === 'submitting'}
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</span>
                        <input
                          type="email"
                          value={supportForm.email}
                          onChange={(event) => setSupportForm((current) => ({ ...current, email: event.target.value }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          placeholder="name@example.com"
                          autoComplete="email"
                          disabled={supportStatus === 'submitting'}
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</span>
                        <select
                          value={supportForm.category}
                          onChange={(event) => setSupportForm((current) => ({ ...current, category: event.target.value as SupportCategory }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          disabled={supportStatus === 'submitting'}
                        >
                          <option value="general">General question</option>
                          <option value="billing">Billing</option>
                          <option value="technical">Technical issue</option>
                          <option value="account">Account access</option>
                          <option value="feature">Feature request</option>
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Urgency</span>
                        <select
                          value={supportForm.urgency}
                          onChange={(event) => setSupportForm((current) => ({ ...current, urgency: event.target.value as SupportUrgency }))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          disabled={supportStatus === 'submitting'}
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subject</span>
                      <input
                        type="text"
                        value={supportForm.subject}
                        onChange={(event) => setSupportForm((current) => ({ ...current, subject: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        placeholder="Brief summary of the issue"
                        disabled={supportStatus === 'submitting'}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Message</span>
                      <textarea
                        value={supportForm.message}
                        onChange={(event) => setSupportForm((current) => ({ ...current, message: event.target.value }))}
                        className="min-h-[180px] w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        placeholder="Tell us what happened, what you expected, and any relevant details."
                        disabled={supportStatus === 'submitting'}
                      />
                    </label>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={supportStatus === 'submitting'}
                        className="h-12 rounded-xl bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {supportStatus === 'submitting' ? 'Submitting...' : 'Submit support request'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeSupportForm}
                        className="h-12 rounded-xl border-slate-200 px-6 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                        disabled={supportStatus === 'submitting'}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FAQ;