import React from 'react';

/**
 * Format AI messages with visual error correction highlighting
 * Converts [ERROR:text] to red highlighted text
 * Converts [CORRECTION:text] to green highlighted text
 */

interface FormattedSegment {
  type: 'text' | 'error' | 'correction';
  content: string;
}

export function parseMessage(message: string): FormattedSegment[] {
  const segments: FormattedSegment[] = [];
  let currentIndex = 0;

  // Regex to match [ERROR:...] and [CORRECTION:...]
  const errorRegex = /\[ERROR:(.*?)\]/g;
  const correctionRegex = /\[CORRECTION:(.*?)\]/g;
  
  // Combined regex to find all markers
  const combinedRegex = /\[(ERROR|CORRECTION):(.*?)\]/g;
  
  let match;
  const matches: Array<{ index: number; length: number; type: 'error' | 'correction'; content: string }> = [];
  
  while ((match = combinedRegex.exec(message)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: match[1].toLowerCase() as 'error' | 'correction',
      content: match[2]
    });
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Build segments
  matches.forEach(match => {
    // Add text before the match
    if (currentIndex < match.index) {
      const textBefore = message.substring(currentIndex, match.index);
      if (textBefore.trim()) {
        segments.push({
          type: 'text',
          content: textBefore
        });
      }
    }

    // Add the match
    segments.push({
      type: match.type,
      content: match.content
    });

    currentIndex = match.index + match.length;
  });

  // Add remaining text
  if (currentIndex < message.length) {
    const remainingText = message.substring(currentIndex);
    if (remainingText.trim()) {
      segments.push({
        type: 'text',
        content: remainingText
      });
    }
  }

  // If no matches found, return the whole message as text
  if (segments.length === 0) {
    segments.push({
      type: 'text',
      content: message
    });
  }

  return segments;
}

// Regex to match bold corrections like **correction text**
const boldCorrectionRegex = /\*\*(.*?)\*\*/g;

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, className = '' }) => {
  const segments = parseMessage(content);

  return (
    <div className={`formatted-message ${className}`}>
      {segments.map((segment, index) => {
        if (segment.type === 'error') {
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded font-medium"
              title="Error - needs correction"
            >
              <svg 
                className="w-3.5 h-3.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
              <span className="line-through decoration-2">{segment.content}</span>
            </span>
          );
        }

        if (segment.type === 'correction') {
          return (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded font-medium"
              title="Correction - this is correct"
            >
              <svg 
                className="w-3.5 h-3.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <span className="font-semibold">{segment.content}</span>
            </span>
          );
        }

        // Regular text - preserve whitespace and line breaks
        return (
          <span key={index} className="whitespace-pre-wrap">
            {segment.content}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Check if a message contains error corrections
 */
export function hasCorrections(message: string): boolean {
  return /\[(ERROR|CORRECTION):/.test(message) || boldCorrectionRegex.test(message);
}

/**
 * Extract just the corrections from a message (useful for summaries)
 */
export function extractCorrections(message: string): Array<{ error: string; correction: string }> {
  const corrections: Array<{ error: string; correction: string }> = [];
  const segments = parseMessage(message);

  for (let i = 0; i < segments.length - 1; i++) {
    if (segments[i].type === 'error' && segments[i + 1]?.type === 'correction') {
      corrections.push({
        error: segments[i].content,
        correction: segments[i + 1].content
      });
    }
  }

  return corrections;
}

/**
 * Extract bold corrections (\*\*correction\*\*) and return as corrections
 * Bold corrections do not include the original error text, so `error` is empty.
 */
export function extractBoldCorrections(message: string): Array<{ error: string; correction: string }> {
  // Use matchAll as requested to capture all bold corrections exactly
  // This returns an array of correction strings (without the surrounding **)
  const corrections = [...message.matchAll(/\*\*(.*?)\*\*/g)].map((m) => m[1]);
  const totalErrorsDetected = corrections.length;

  // Map into the same shape expected by callers (error is unknown here)
  return corrections.map((c) => ({ error: '', correction: c }));
}

/**
 * Count total corrections found in a message (bracketed pairs + bold matches)
 */
export function countCorrections(message: string): number {
  const bracketCount = extractCorrections(message).length;
  const boldCount = extractBoldCorrections(message).length;
  return bracketCount + boldCount;
}
