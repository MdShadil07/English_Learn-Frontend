export interface FormattedSegment {
  type: 'text' | 'error' | 'correction' | 'note' | 'important' | 'tip' | 'heading' | 'bullet' | 'numbered' |
        'bold' | 'translation' | 'vocab_word' | 'grammar_point' | 'essay_section' | 'business_tip' | 'story_element';
  content: string;
  originalText?: string;
  level?: number;
  metadata?: {
    word?: string;
    translation?: string;
    language?: string;
    category?: string;
  };
}

/**
 * Aggressive parsing and cleanup for AI-formatted messages.
 * This is CPU-bound and can be executed on a Web Worker.
 */
export const parseFormattedContent = (content: string): FormattedSegment[] => {
  const segments: FormattedSegment[] = [];
  const cleanedContent = content
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
    .replace(/\n{3,}/g, '\n\n');

  const markerRegex = /\[(ERROR|CORRECTION|NOTE|TIP|IMPORTANT|BOLD|TRANSLATION|VOCAB_WORD|GRAMMAR_POINT|ESSAY_SECTION|BUSINESS_TIP|STORY_ELEMENT):(.*?)\]/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markerRegex.exec(cleanedContent)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = cleanedContent.substring(lastIndex, match.index);
      if (textBefore.trim() || textBefore.includes('\n')) {
        segments.push({ type: 'text', content: textBefore });
      }
    }

    const markerType = match[1].toLowerCase();
    const markerContent = match[2].trim();

    if (markerContent) {
      if (markerType === 'translation') {
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({ type: 'translation', content: parts.slice(1).join('|').trim(), metadata: { language: parts[0].trim() } });
        }
      } else if (markerType === 'vocab_word') {
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({ type: 'vocab_word', content: parts.slice(1).join('|').trim(), metadata: { word: parts[0].trim() } });
        }
      } else if (markerType === 'essay_section' || markerType === 'story_element') {
        const parts = markerContent.split('|');
        if (parts.length >= 2) {
          segments.push({ type: markerType as any, content: parts.slice(1).join('|').trim(), metadata: { category: parts[0].trim() } });
        } else {
          segments.push({ type: markerType as any, content: markerContent });
        }
      } else {
        segments.push({ type: markerType as any, content: markerContent });
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanedContent.length) {
    const textAfter = cleanedContent.substring(lastIndex);
    if (textAfter.trim() || textAfter.includes('\n')) {
      segments.push({ type: 'text', content: textAfter });
    }
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', content: cleanedContent });
  }

  return segments;
};

export const hasFormatting = (content: string): boolean => {
  return /\[(ERROR|CORRECTION|NOTE|TIP|IMPORTANT|BOLD|TRANSLATION|VOCAB_WORD|GRAMMAR_POINT|ESSAY_SECTION|BUSINESS_TIP|STORY_ELEMENT):/i.test(content);
};

export const stripFormatting = (content: string): string => {
  return content
    .replace(/\[ERROR:.*?\]/gi, '')
    .replace(/\[CORRECTION:(.*?)\]/gi, '$1')
    .replace(/\[NOTE:(.*?)\]/gi, '$1')
    .replace(/\[TIP:(.*?)\]/gi, '$1')
    .replace(/\[IMPORTANT:(.*?)\]/gi, '$1')
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

export const extractErrors = (content: string): string[] => {
  const errors: string[] = [];
  const errorRegex = /\[ERROR:(.*?)\]/g;
  let match: RegExpExecArray | null;
  while ((match = errorRegex.exec(content)) !== null) errors.push(match[1]);
  return errors;
};

export const extractCorrections = (content: string): string[] => {
  const corrections: string[] = [];
  const correctionRegex = /\[CORRECTION:(.*?)\]/g;
  let match: RegExpExecArray | null;
  while ((match = correctionRegex.exec(content)) !== null) corrections.push(match[1]);
  return corrections;
};

export const countFormattedElements = (content: string) => {
  const errors = (content.match(/\[ERROR:/g) || []).length;
  const corrections = (content.match(/\[CORRECTION:/g) || []).length;
  const notes = (content.match(/\[NOTE:/g) || []).length;
  const tips = (content.match(/\[TIP:/g) || []).length;
  const important = (content.match(/\[IMPORTANT:/g) || []).length;
  return { errors, corrections, notes, tips, important };
};

export default parseFormattedContent;
