import { useEffect, useRef } from 'react';

type SSEPayload = { channel?: string; payload?: unknown };

// Simple hook to connect to /api/payment/sse. It sends the access token as a query param.
// onEvent will be called with parsed event payloads.
export default function useSubscriptionSSE(onEvent: (data: SSEPayload) => void, enabled = true) {
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<number>(0);
  useEffect(() => {
    if (!enabled) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;

    const connect = () => {
      const url = `/api/payment/sse?token=${encodeURIComponent(token || '')}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        retryRef.current = 0;
        console.debug('SSE connected');
      };

      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          onEvent({ payload: data });
        } catch (e) {
          onEvent({ payload: ev.data });
        }
      };

      es.addEventListener('message', (ev: MessageEvent) => {
        // already handled by onmessage
      });

      es.onerror = () => {
        console.debug('SSE error, will attempt reconnect');
        try { es.close(); } catch (e) { /* empty */ }
        esRef.current = null;
        const wait = Math.min(30000, 1000 * Math.pow(2, retryRef.current));
        retryRef.current += 1;
        setTimeout(connect, wait);
      };
    };

    connect();

    return () => {
      try { esRef.current?.close(); } catch (e) { /* intentionally ignored */ }
      esRef.current = null;
    };
  }, [enabled, onEvent]);
}
