/**
 * Formatted AI Message Component
 * Displays AI responses with visual error/correction highlighting
 * Used by Pro and Premium personalities
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface FormattedSegment {
  type: 'text' | 'error' | 'correction' | 'note' | 'important' | 'tip' | 'heading' | 'bullet' | 'numbered' | 
        'bold' | 'translation' | 'vocab_word' | 'grammar_point' | 'essay_section' | 'business_tip' | 'story_element';
  content: string;
  originalText?: string;
  level?: number; // For headings or list nesting
  metadata?: {
    word?: string; // For vocabulary words
    translation?: string; // For native language translation
    language?: string; // Language code for translation
    category?: string; // Category for vocab, essay sections, etc.
  };
}

interface FormattedMessageProps {
  content: string;
  className?: string;
}

/**
 * Parse formatted response from AI
 * Extracts various formatting markers:
 * - [ERROR:text] and [CORRECTION:text] for corrections
 * - [NOTE:text] for important notes
 * - [TIP:text] for helpful tips  
 * - [IMPORTANT:text] for critical information
 * - [BOLD:text] for vocabulary words and emphasis
 * - [TRANSLATION:language|text] for native language translations
 * - [VOCAB_WORD:word|meaning] for vocabulary teaching
 * - [GRAMMAR_POINT:text] for grammar explanations
 * - [ESSAY_SECTION:category|text] for essay feedback
 * - [BUSINESS_TIP:text] for professional communication
 * - [STORY_ELEMENT:category|text] for creative writing feedback
 * Strips out ALL markdown symbols if AI accidentally uses them
 */
const parseFormattedContent = (content: string): FormattedSegment[] => {
  const segments: FormattedSegment[] = [];
  
  // Aggressive markdown cleanup - AI should NEVER use these based on updated prompts
  // This is a comprehensive fallback safety net
  const cleanedContent = content
    // Remove markdown headers (##, ###, etc.)
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Remove bold **text** or __text__ (except in our markers)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove italic *text* or _text_
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '$1')
    // Remove bullet points and list markers
    .replace(/^[*\-+•]\s+/gm, '')
    // Remove numbered lists
    .replace(/^\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    // Remove strikethrough ~~text~~
    .replace(/~~(.+?)~~/g, '$1')
    // Clean up multiple consecutive line breaks (keep max 2)
    .replace(/\n{3,}/g, '\n\n');
  
  // Enhanced regex to find ALL our custom markers
  const markerRegex = /\[(ERROR|CORRECTION|NOTE|TIP|IMPORTANT|BOLD|TRANSLATION|VOCAB_WORD|GRAMMAR_POINT|ESSAY_SECTION|BUSINESS_TIP|STORY_ELEMENT):(.*?)\]/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = markerRegex.exec(cleanedContent)) !== null) {
    // Add text before the marker
    if (match.index > lastIndex) {
      const textBefore = cleanedContent.substring(lastIndex, match.index);
      if (textBefore.trim() || textBefore.includes('\n')) {
        segments.push({
          type: 'text',
          content: textBefore
        });
      }
    }
    
    // Parse the marker
    const markerType = match[1].toLowerCase();
    const markerContent = match[2].trim();
    
    if (markerContent) {
      // Handle special markers with metadata
      if (markerType === 'translation') {
        // Format: [TRANSLATION:language|text]
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({
            type: 'translation',
            content: parts.slice(1).join('|').trim(),
            metadata: {
              language: parts[0].trim()
            }
          });
        }
      } else if (markerType === 'vocab_word') {
        // Format: [VOCAB_WORD:word|meaning]
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({
            type: 'vocab_word',
            content: parts.slice(1).join('|').trim(),
            metadata: {
              word: parts[0].trim()
            }
          });
        }
      } else if (markerType === 'essay_section' || markerType === 'story_element') {
        // Format: [ESSAY_SECTION:category|text] or [STORY_ELEMENT:category|text]
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({
            type: markerType as any,
            content: parts.slice(1).join('|').trim(),
            metadata: {
              category: parts[0].trim()
            }
          });
        } else {
          segments.push({
            type: markerType as any,
            content: markerContent
          });
        }
      } else {
        // Standard markers
        segments.push({
          type: markerType as any,
          content: markerContent
        });
      }
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after last marker
  if (lastIndex < cleanedContent.length) {
    const textAfter = cleanedContent.substring(lastIndex);
    if (textAfter.trim() || textAfter.includes('\n')) {
      segments.push({
        type: 'text',
        content: textAfter
      });
    }
  }
  
  // If no markers found, return as plain text
  if (segments.length === 0) {
    segments.push({
      type: 'text',
      content: cleanedContent
    });
  }
  
  return segments;
};

/**
 * FormattedAIMessage Component
 * Renders AI messages with visual error/correction highlighting
 * Pro/Premium features with red error highlighting and green correction highlighting
 */
export const FormattedAIMessage: React.FC<FormattedMessageProps> = ({ content, className }) => {
  const segments = parseFormattedContent(content);

  return (
    <div className={cn('whitespace-pre-wrap text-sm leading-relaxed', className)}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'error':
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 mx-0.5 my-0.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-800 rounded-md font-medium shadow-sm hover:shadow-md transition-shadow"
                title="Error - this needs correction"
                role="mark"
                aria-label="Error"
              >
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                <span className="line-through decoration-2 decoration-red-500">{segment.content}</span>
              </span>
            );
          
          case 'correction':
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 mx-0.5 my-0.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-800 rounded-md font-semibold shadow-sm hover:shadow-md transition-shadow"
                title="Correction - this is the correct form"
                role="mark"
                aria-label="Correction"
              >
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="font-bold">{segment.content}</span>
              </span>
            );

          case 'note':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 dark:border-blue-600 rounded-r-lg shadow-sm"
                role="note"
                aria-label="Note"
              >
                <svg 
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide mb-1">Note</p>
                  <p className="text-blue-800 dark:text-blue-300">{segment.content}</p>
                </div>
              </div>
            );

          case 'tip':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-lg shadow-sm"
                role="note"
                aria-label="Tip"
              >
                <svg 
                  className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">Tip</p>
                  <p className="text-amber-800 dark:text-amber-300">{segment.content}</p>
                </div>
              </div>
            );

          case 'important':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 dark:border-orange-600 rounded-r-lg shadow-md"
                role="alert"
                aria-label="Important"
              >
                <svg 
                  className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-orange-900 dark:text-orange-200 uppercase tracking-wide mb-1">Important</p>
                  <p className="text-orange-800 dark:text-orange-300 font-medium">{segment.content}</p>
                </div>
              </div>
            );
          
          case 'bold':
            return (
              <strong key={index} className="font-bold text-gray-900 dark:text-gray-100">
                {segment.content}
              </strong>
            );
          
          case 'translation':
            return (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 mx-0.5 my-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 rounded-lg text-sm"
                title={`Translation in ${segment.metadata?.language || 'native language'}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="italic">{segment.content}</span>
              </div>
            );
          
          case 'vocab_word':
            return (
              <div
                key={index}
                className="flex flex-col gap-1 px-4 py-3 my-2 bg-indigo-50 dark:bg-indigo-950/30 border-l-4 border-indigo-500 dark:border-indigo-600 rounded-r-lg shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {segment.metadata?.word}
                  </span>
                </div>
                <p className="text-indigo-800 dark:text-indigo-300 ml-7">{segment.content}</p>
              </div>
            );
          
          case 'grammar_point':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-teal-50 dark:bg-teal-950/30 border-l-4 border-teal-500 dark:border-teal-600 rounded-r-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-teal-900 dark:text-teal-200 uppercase tracking-wide mb-1">Grammar</p>
                  <p className="text-teal-800 dark:text-teal-300">{segment.content}</p>
                </div>
              </div>
            );
          
          case 'essay_section':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-cyan-50 dark:bg-cyan-950/30 border-l-4 border-cyan-500 dark:border-cyan-600 rounded-r-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-cyan-900 dark:text-cyan-200 uppercase tracking-wide mb-1">
                    {segment.metadata?.category || 'Essay'}
                  </p>
                  <p className="text-cyan-800 dark:text-cyan-300">{segment.content}</p>
                </div>
              </div>
            );
          
          case 'business_tip':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-slate-50 dark:bg-slate-950/30 border-l-4 border-slate-500 dark:border-slate-600 rounded-r-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wide mb-1">Professional Tip</p>
                  <p className="text-slate-800 dark:text-slate-300">{segment.content}</p>
                </div>
              </div>
            );
          
          case 'story_element':
            return (
              <div
                key={index}
                className="flex items-start gap-2 px-4 py-3 my-2 bg-pink-50 dark:bg-pink-950/30 border-l-4 border-pink-500 dark:border-pink-600 rounded-r-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-pink-900 dark:text-pink-200 uppercase tracking-wide mb-1">
                    {segment.metadata?.category || 'Story'}
                  </p>
                  <p className="text-pink-800 dark:text-pink-300">{segment.content}</p>
                </div>
              </div>
            );
          
          case 'text':
          default:
            return <span key={index}>{segment.content}</span>;
        }
      })}
    </div>
  );
};

/**
 * Check if content has any formatting
 */
export const hasFormatting = (content: string): boolean => {
  return /\[(ERROR|CORRECTION|NOTE|TIP|IMPORTANT|BOLD|TRANSLATION|VOCAB_WORD|GRAMMAR_POINT|ESSAY_SECTION|BUSINESS_TIP|STORY_ELEMENT):/.test(content);
};

/**
 * Strip all formatting markers and markdown for plain text (e.g., for TTS)
 */
export const stripFormatting = (content: string): string => {
  return content
    // Remove our custom markers (keep the content)
    .replace(/\[ERROR:.*?\]/g, '')
    .replace(/\[CORRECTION:(.*?)\]/g, '$1')
    .replace(/\[NOTE:(.*?)\]/g, '$1')
    .replace(/\[TIP:(.*?)\]/g, '$1')
    .replace(/\[IMPORTANT:(.*?)\]/g, '$1')
    // Remove markdown (comprehensive)
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1')
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '$1')
    .replace(/^[*\-+•]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*_]{3,}$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Extract errors from content
 */
export const extractErrors = (content: string): string[] => {
  const errors: string[] = [];
  const errorRegex = /\[ERROR:(.*?)\]/g;
  let match;

  while ((match = errorRegex.exec(content)) !== null) {
    errors.push(match[1]);
  }

  return errors;
};

/**
 * Extract corrections from content
 */
export const extractCorrections = (content: string): string[] => {
  const corrections: string[] = [];
  const correctionRegex = /\[CORRECTION:(.*?)\]/g;
  let match;

  while ((match = correctionRegex.exec(content)) !== null) {
    corrections.push(match[1]);
  }

  return corrections;
};

/**
 * Extract notes from content
 */
export const extractNotes = (content: string): string[] => {
  const notes: string[] = [];
  const noteRegex = /\[NOTE:(.*?)\]/g;
  let match;

  while ((match = noteRegex.exec(content)) !== null) {
    notes.push(match[1]);
  }

  return notes;
};

/**
 * Extract tips from content
 */
export const extractTips = (content: string): string[] => {
  const tips: string[] = [];
  const tipRegex = /\[TIP:(.*?)\]/g;
  let match;

  while ((match = tipRegex.exec(content)) !== null) {
    tips.push(match[1]);
  }

  return tips;
};

/**
 * Extract important items from content
 */
export const extractImportant = (content: string): string[] => {
  const important: string[] = [];
  const importantRegex = /\[IMPORTANT:(.*?)\]/g;
  let match;

  while ((match = importantRegex.exec(content)) !== null) {
    important.push(match[1]);
  }

  return important;
};

/**
 * Count all formatted elements
 */
export const countFormattedElements = (content: string): { 
  errors: number; 
  corrections: number; 
  notes: number;
  tips: number;
  important: number;
} => {
  const errors = (content.match(/\[ERROR:/g) || []).length;
  const corrections = (content.match(/\[CORRECTION:/g) || []).length;
  const notes = (content.match(/\[NOTE:/g) || []).length;
  const tips = (content.match(/\[TIP:/g) || []).length;
  const important = (content.match(/\[IMPORTANT:/g) || []).length;

  return { errors, corrections, notes, tips, important };
};

export default FormattedAIMessage;
