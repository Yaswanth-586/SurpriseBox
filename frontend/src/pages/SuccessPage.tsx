import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSurprise } from '../api/client';
import { Surprise } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Check, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  const { token } = useParams<{ token: string }>();
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/s/${token}`;

  useEffect(() => {
    if (token) {
      getSurprise(token).then(setSurprise).catch(() => {});
    }
  }, [token]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  let formattedDate = '';
  if (surprise) {
    try {
      formattedDate = format(new Date(surprise.unlock_at), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      formattedDate = surprise.unlock_at;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Success particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#a855f7', '#ec4899', '#f59e0b', '#6366f1', '#10b981'][i % 5],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [1, 0],
            rotate: [0, 720],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Your surprise is ready! 🎁
        </h1>
        <p className="text-white/50 text-lg mb-2">
          Now all you have to do is wait.
        </p>

        {surprise && (
          <p className="text-white/30 text-sm mb-8">
            For <span className="text-purple-300">{surprise.recipient_name}</span> · Unlocks on {formattedDate}
          </p>
        )}

        {/* Share URL */}
        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Shareable Link</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/s/${token}`}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Surprise
          </Link>
          <Link
            to="/"
            className="flex-1 px-6 py-3 glass text-white/70 hover:text-white rounded-xl font-medium transition-all hover:bg-white/10 text-center"
          >
            Back Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
