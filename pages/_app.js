import '@/styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  // YouTube-style PWA Cache-first registration for instant low-network loads
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('Service Worker active:', reg.scope))
          .catch((err) => console.warn('SW registration skipped:', err));
      });
    }
  }, []);

  return <Component {...pageProps} />;
}