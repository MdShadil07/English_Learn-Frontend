import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, Search, MessageCircle, 
  HelpCircle, ArrowRight, Mail, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const FAQItem = React.forwardRef<HTMLDivElement, FAQItemProps>(({ item, isOpen, onClick }, ref) => {
  return (
    <motion.div 
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen 
          ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
          : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className={`text-base md:text-lg font-semibold transition-colors ${
          isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
        }`}>
          {item.question}
        </span>
        <span className={`ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          isOpen ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
            <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-100 dark:border-slate-800 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" id="faq">
      
      {/* --- Abstract Background --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[50rem] h-[50rem] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* --- Left Column: Header & Support Card --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm">
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Support Center</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">
                Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Questions</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Everything you need to know about the platform. Can't find the answer you're looking for? We're here to help.
              </p>

              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm text-slate-900 dark:text-white placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Support Card */}
              <div className="hidden lg:block p-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Still have questions?</h4>
                  <p className="text-slate-400 text-sm mb-6">
                    Our team typically responds within 2 hours during business days.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 justify-start pl-4">
                      <Mail className="w-4 h-4 mr-3" /> Contact Support
                    </Button>
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white justify-start pl-4">
                      <FileText className="w-4 h-4 mr-3" /> Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Right Column: FAQ Items --- */}
          <div className="lg:col-span-8">
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
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-12"
                  >
                    <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-900 mb-4 text-slate-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No questions found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Support Card (Visible only on small screens) */}
            <div className="lg:hidden mt-12 p-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-bold mb-2">Still need help?</h4>
                  <p className="text-slate-400 text-sm">Chat with our support team directly.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;