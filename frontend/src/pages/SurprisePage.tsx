import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Surprise, SurpriseContent } from '../types';
import { getSurprise, getSurpriseContent, ApiError } from '../api/client';
import LockedView from '../components/surprise/LockedView';
import UnlockAnimation from '../components/surprise/UnlockAnimation';
import MessageReveal from '../components/surprise/MessageReveal';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTheme } from '../utils/themes';

type ViewState = 'loading' | 'locked' | 'unlocking' | 'opening' | 'revealed' | 'error' | 'not_found';

export default function SurprisePage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<ViewState>('loading');
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [content, setContent] = useState<SurpriseContent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch surprise data on mount
  useEffect(() => {
    if (!token) {
      setState('not_found');
      return;
    }

    const fetchSurprise = async () => {
      try {
        const data = await getSurprise(token);
        setSurprise(data);

        if (data.is_locked) {
          setState('locked');
        } else {
          // Already unlocked — go straight to unlocking state
          setState('unlocking');
        }
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 404) {
          setState('not_found');
        } else {
          setErrorMsg(err.message || 'Something went wrong');
          setState('error');
        }
      }
    };

    fetchSurprise();
  }, [token]);

  // Handle countdown reaching zero
  const handleUnlock = useCallback(() => {
    setState('unlocking');
  }, []);

  // Handle opening the box
  const handleOpen = async () => {
    if (!token) return;
    setState('opening');

    try {
      const data = await getSurpriseContent(token);
      setContent(data);
      // Small delay for the opening animation
      setTimeout(() => {
        setState('revealed');
      }, 500);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 403) {
        // Still locked on server — refresh surprise data
        setState('locked');
        try {
          const refreshed = await getSurprise(token);
          setSurprise(refreshed);
        } catch { /* ignore */ }
      } else {
        setErrorMsg(err.message || 'Failed to open surprise');
        setState('error');
      }
    }
  };

  const renderContent = () => {
    if (state === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Loading your surprise...</p>
          </div>
        </div>
      );
    }

    if (state === 'not_found') {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="text-6xl block mb-6">🎁</span>
            <h1 className="text-2xl font-bold text-white mb-3">Oops! This surprise doesn't exist.</h1>
            <p className="text-white/50 mb-8">
              The link may be invalid or the surprise may have been removed.
            </p>
            <Link
              to="/"
              className="inline-flex px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    if (state === 'error') {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="text-6xl block mb-6">😢</span>
            <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-white/50 mb-8">{errorMsg}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (state === 'locked' && surprise) {
      return <LockedView surprise={surprise} onUnlock={handleUnlock} />;
    }

    if (state === 'unlocking' && surprise) {
      return <UnlockAnimation onOpen={handleOpen} surprise={surprise} />;
    }

    if (state === 'opening') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Opening your surprise...</p>
          </div>
        </div>
      );
    }

    if (state === 'revealed' && surprise && content) {
      return <MessageReveal surprise={surprise} content={content} />;
    }

    return null;
  };

  const themeConfig = surprise ? getTheme(surprise.theme) : null;

  return (
    <div className={themeConfig ? `${themeConfig.background} ${themeConfig.fontFamily} min-h-screen` : 'min-h-screen'}>
      {renderContent()}
    </div>
  );
}
