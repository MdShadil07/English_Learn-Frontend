import { useEffect, useRef, useCallback } from 'react';
import type { FormattedSegment } from '../utils/aiFormatter';
import parseFormattedContent from '../utils/aiFormatter';

type Pending = {
  resolve: (segments: FormattedSegment[]) => void;
  reject: (err?: any) => void;
  onProgress?: (segments: FormattedSegment[]) => void;
};

export const useMessageFormatter = () => {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Map<string | number, Pending>>(new Map());
  const idSeq = useRef(1);

  useEffect(() => {
    let w: Worker | null = null;
    try {
      // Create a module worker
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Worker constructor with URL import
      w = new Worker(new URL('../workers/formatWorker.ts', import.meta.url), { type: 'module' });
      workerRef.current = w;

      w.addEventListener('message', (ev: MessageEvent) => {
        const { id, segments, error, done } = ev.data || {};
        const p = pending.current.get(id);
        if (!p) return;
        if (error) {
          pending.current.delete(id);
          p.reject(new Error(error));
          return;
        }
        if (segments && Array.isArray(segments) && segments.length > 0) {
          // call onProgress if provided
          try { p.onProgress?.(segments as FormattedSegment[]); } catch {}
        }
        if (done) {
          // resolve with empty array if no final segments were sent
          pending.current.delete(id);
          p.resolve([] as FormattedSegment[]);
        }
      });
    } catch (err) {
      // Worker not available in some environments (SSR, older browsers)
      workerRef.current = null;
    }

    return () => {
      try {
        workerRef.current?.terminate();
      } catch {}
      workerRef.current = null;
      pending.current.forEach((p) => p.reject(new Error('worker_terminated')));
      pending.current.clear();
    };
  }, []);

  const format = useCallback((content: string, onProgress?: (segments: FormattedSegment[]) => void): Promise<FormattedSegment[]> => {
    // If no worker, fallback to sync parse and call onProgress with full result
    const w = workerRef.current;
    if (!w) {
      try {
        const parsed = parseFormattedContent(content);
        onProgress?.(parsed);
        return Promise.resolve(parsed);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return new Promise<FormattedSegment[]>((resolve, reject) => {
      const id = idSeq.current++;
      pending.current.set(id, { resolve, reject, onProgress });
      try {
        w.postMessage({ id, content });
      } catch (err) {
        pending.current.delete(id);
        reject(err);
      }
      // Timeout to prevent stuck promises
      const to = setTimeout(() => {
        if (pending.current.has(id)) {
          pending.current.delete(id);
          reject(new Error('format_timeout'));
        }
      }, 8000);
      // ensure when resolved/rejected we clear timeout
      const originalResolve = resolve;
      const wrappedResolve = (segments: FormattedSegment[]) => {
        clearTimeout(to);
        originalResolve(segments);
      };
      pending.current.set(id, { resolve: wrappedResolve, reject, onProgress });
    });
  }, []);

  return { format };
};

export default useMessageFormatter;
