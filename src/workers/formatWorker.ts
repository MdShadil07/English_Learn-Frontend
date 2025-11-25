import { parseFormattedContent } from '../utils/aiFormatter';

// Worker entrypoint - supports incremental parsing and streaming
// Incoming message: { id, content }
// Posts incremental messages: { id, segments: FormattedSegment[] } and a final { id, segments, done: true }

self.addEventListener('message', (ev: MessageEvent) => {
  try {
    const { id, content } = ev.data || {};
    if (typeof content !== 'string') {
      (self as any).postMessage({ id, error: 'invalid_content' });
      return;
    }

    // Streaming approach: scan markers and post segments as they are discovered.
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

    const batch: any[] = [];
    const flushBatch = (force = false) => {
      if (batch.length > 0 || force) {
        (self as any).postMessage({ id, segments: batch.splice(0, batch.length) });
      }
    };

    while ((match = markerRegex.exec(cleanedContent)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = cleanedContent.substring(lastIndex, match.index);
        if (textBefore.trim() || textBefore.includes('\n')) {
          batch.push({ type: 'text', content: textBefore });
        }
      }

      const markerType = match[1].toLowerCase();
      const markerContent = match[2].trim();

      if (markerContent) {
        if (markerType === 'translation') {
          const parts = markerContent.split('|');
          if (parts.length >= 2) {
            batch.push({ type: 'translation', content: parts.slice(1).join('|').trim(), metadata: { language: parts[0].trim() } });
          }
        } else if (markerType === 'vocab_word') {
          const parts = markerContent.split('|');
          if (parts.length >= 2) {
            batch.push({ type: 'vocab_word', content: parts.slice(1).join('|').trim(), metadata: { word: parts[0].trim() } });
          }
        } else if (markerType === 'essay_section' || markerType === 'story_element') {
          const parts = markerContent.split('|');
          if (parts.length >= 2) {
            batch.push({ type: markerType as any, content: parts.slice(1).join('|').trim(), metadata: { category: parts[0].trim() } });
          } else {
            batch.push({ type: markerType as any, content: markerContent });
          }
        } else {
          batch.push({ type: markerType as any, content: markerContent });
        }
      }

      lastIndex = match.index + match[0].length;

      // Post incremental updates periodically to avoid starving the main thread
      if (batch.length >= 6) flushBatch();
    }

    // Remaining text
    if (lastIndex < cleanedContent.length) {
      const textAfter = cleanedContent.substring(lastIndex);
      if (textAfter.trim() || textAfter.includes('\n')) {
        batch.push({ type: 'text', content: textAfter });
      }
    }

    // Send remaining segments and indicate done
    flushBatch(true);
    (self as any).postMessage({ id, done: true });
  } catch (err) {
    (self as any).postMessage({ id: ev?.data?.id, error: String(err) });
  }
});

export default null as any;
