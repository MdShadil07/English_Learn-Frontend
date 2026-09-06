import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Languages, X, Loader2, Hexagon } from 'lucide-react';
import { api } from '@/utils/api';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { motion, AnimatePresence } from 'framer-motion';

interface TextSelectionToolbarProps {
  containerRef?: React.RefObject<HTMLElement>;
}

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({ containerRef }) => {
  const [selection, setSelection] = useState<{
    text: string;
    rect: DOMRect;
  } | null>(null);
  
  const [explanation, setExplanation] = useState<{
    explanation: string;
    translation: string;
    phonetic: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const { speakAIResponse } = useSpeechSynthesis();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const activeSelection = window.getSelection();
      
      if (!activeSelection || activeSelection.isCollapsed) {
        if (!showExplanation) {
          setSelection(null);
        }
        return;
      }

      const text = activeSelection.toString().trim();
      if (!text || text.length > 500) {
        if (!showExplanation) setSelection(null);
        return;
      }

      // Check if selection is within the container if provided, or within a message
      let node = activeSelection.anchorNode;
      let isWithinChat = false;
      while (node) {
        if (node.nodeType === 1 && (node as Element).closest('.ai-message-content, .chat-message-list, [role="log"]')) {
          isWithinChat = true;
          break;
        }
        node = node.parentNode;
      }

      if (!isWithinChat) {
        if (!showExplanation) setSelection(null);
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Only update if we're not currently showing an explanation
      if (!showExplanation) {
        setSelection({
          text,
          rect
        });
        setExplanation(null);
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleSelectionChange, 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current && !toolbarRef.current.contains(event.target as Node) &&
        explanationRef.current && !explanationRef.current.contains(event.target as Node)
      ) {
        setSelection(null);
        setShowExplanation(false);
        setExplanation(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [showExplanation]);

  const handleSpeak = async () => {
    if (selection?.text) {
      await speakAIResponse(selection.text);
    }
  };

  const handleTranslate = async () => {
    if (!selection?.text) return;
    
    setIsLoading(true);
    setShowExplanation(true);
    
    try {
      const response = await api.aiChat.explainText({ text: selection.text });
      if (response.success && response.data) {
        setExplanation(response.data);
      }
    } catch (error: any) {
      console.error('Translation failed:', error);
      
      if (error?.response?.data?.code === 'NATIVE_LANGUAGE_NOT_SET' || error?.response?.status === 400) {
        setExplanation({
          explanation: error?.response?.data?.message || 'Please set up your native language in settings first to use the translation feature.',
          translation: 'Native Language Not Set',
          phonetic: ''
        });
      } else {
        setExplanation({
          explanation: 'Failed to load explanation. Please try again.',
          translation: 'Translation unavailable',
          phonetic: ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!selection) return null;

  const top = selection.rect.top - 48; // Give a bit more space above
  const left = selection.rect.left + (selection.rect.width / 2);

  // For mobile toolbar positioning: explicitly place ABOVE the text
  const toolbarTop = isMobile ? Math.max(10, selection.rect.top - 48) : top;
  const toolbarLeft = isMobile ? window.innerWidth / 2 : left;

  return (
    <AnimatePresence>
      {/* Toolbar */}
      {!showExplanation && selection && (
        <motion.div
          key="toolbar"
          ref={toolbarRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed z-50 flex items-center gap-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          style={{
            top: `${toolbarTop}px`,
            left: `${toolbarLeft}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <button
            onClick={handleTranslate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
          >
            <Languages className="w-4 h-4" />
            Translate
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:text-teal-600 dark:hover:text-teal-400 rounded-md transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            Speak
          </button>
        </motion.div>
      )}

      {/* Explanation Popover */}
      {showExplanation && selection && (
        <>
          {/* Mobile Backdrop */}
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px] dark:bg-black/30"
              onClick={() => {
                setShowExplanation(false);
                setSelection(null);
              }}
            />
          )}

          <motion.div
            key="explanation"
            drag={!isMobile}
            dragMomentum={false}
            ref={explanationRef as any}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={
              isMobile
                ? "fixed bottom-0 inset-x-0 z-[100] w-full bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] rounded-t-[32px] pb-6 overflow-hidden"
                : "fixed z-[100] w-72 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl cursor-move overflow-hidden"
            }
            style={
              isMobile
                ? {}
                : {
                    top: `${Math.max(10, selection.rect.top - 260)}px`,
                    left: `${Math.max(10, Math.min(window.innerWidth - 300, selection.rect.left + (selection.rect.width / 2) - 144))}px`,
                  }
            }
          >
            {isMobile && (
              <div className="w-12 h-1.5 bg-slate-300/50 dark:bg-slate-700/50 rounded-full mx-auto mt-3 mb-0" />
            )}
            
            <div className={`flex items-center justify-between px-4 py-2.5 ${isMobile ? 'pt-2' : ''}`}>
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Translation
              </span>
              <button
                onClick={() => {
                  setShowExplanation(false);
                  setSelection(null);
                  window.getSelection()?.removeAllRanges();
                }}
                className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  <span className="text-xs font-medium text-slate-500">Translating...</span>
                </div>
              ) : explanation ? (
                <div className="flex flex-col gap-2.5">
                  {explanation.explanation.includes('native language in settings') ? (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Languages className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        Native Language Not Set
                      </p>
                      <button
                        onClick={() => {
                          window.location.href = '/profile';
                        }}
                        className="mt-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-full transition-colors w-full"
                      >
                        Go to Settings
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Translation & Phonetic Combined Block */}
                      <div className="bg-white/50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm backdrop-blur-md">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="text-[17px] font-semibold text-slate-900 dark:text-white leading-tight tracking-tight">
                              {explanation.translation}
                            </p>
                            {explanation.phonetic && (
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                                /{explanation.phonetic}/
                              </p>
                            )}
                          </div>
                          {explanation.phonetic && (
                            <button 
                              onClick={handleSpeak}
                              className="w-8 h-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              title="Listen to pronunciation"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Explanation Block */}
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
                          Definition
                        </span>
                        <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {explanation.explanation.replace('[English Definition]: ', '')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
