import React, { useState } from 'react';
import { Menu, Bookmark, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { VERB_AGREEMENT_DATA } from './data/verb-agreement';
import { Button } from './components/UI';
import { LeftNavigationPanel, RightAssistantPanel } from './components/Sidebars';
import { 
  HeroSection, 
  ConceptSection, 
  CheckpointSection, 
  RealWorldSection, 
  MistakesSection, 
  DrillTeaser 
} from './components/Blocks';

export default function CourseLearningPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(VERB_AGREEMENT_DATA.sidebarNav[0].id);
  const navigate = useNavigate();
  const { topicId } = useParams();

  // In a real app, fetch lesson data based on topicId
  // For now, we use the verb agreement mock data
  const LESSON_DATA = VERB_AGREEMENT_DATA;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-emerald-200/60 relative">
      
      <LeftNavigationPanel 
        lessonData={LESSON_DATA}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        scrollTo={scrollTo}
        navigate={navigate}
      />

      {/* --- COLUMN 2: CENTER CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-white/90 backdrop-blur-md shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm truncate max-w-[200px]">{LESSON_DATA.title}</span>
          </div>
          <Button variant="ghost" className="px-2"><Bookmark className="w-5 h-5" /></Button>
        </header>

        {/* Scrollable Reading View */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-32 lg:pb-12" id="lesson-scroll-container">
          <div className="max-w-[720px] mx-auto px-6 lg:px-12 py-10 md:py-16">
            
            {/* Render Content Blocks */}
            {LESSON_DATA.content.map(block => {
              if (block.type === 'hero') return <HeroSection key={block.id} data={block} lessonData={LESSON_DATA} />;
              if (block.type === 'concept') return <ConceptSection key={block.id} data={block} />;
              if (block.type === 'checkpoint') return <CheckpointSection key={block.id} data={block} />;
              if (block.type === 'real_world') return <RealWorldSection key={block.id} data={block} />;
              if (block.type === 'mistakes') return <MistakesSection key={block.id} data={block} />;
              if (block.type === 'drill_teaser') return <DrillTeaser key={block.id} data={block} />;
              return null;
            })}

          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30">
          <Button variant="secondary" className="flex-1">Next Section <ArrowRight className="w-5 h-5 ml-2"/></Button>
        </div>
      </main>

      <RightAssistantPanel lessonData={LESSON_DATA} />

    </div>
  );
}
