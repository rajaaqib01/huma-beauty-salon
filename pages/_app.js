import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LiveChat from '../components/LiveChat';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true);
    const handleRouteChangeComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {isLoading && (
        <div role="status" aria-live="polite" aria-label="Loading page" style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, var(--text-dark) 0%, var(--rose-gold-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in-out',
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '3rem',
              color: 'var(--blush-deep)',
              marginBottom: 16,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>
              ✦
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '0.05em',
            }}>
              Huma Beauty Saloon
            </div>
          </div>
        </div>
      )}
      <Component {...pageProps} />
      {!router.pathname.startsWith('/admin') ? <LiveChat /> : null}
    </>
  );
}
