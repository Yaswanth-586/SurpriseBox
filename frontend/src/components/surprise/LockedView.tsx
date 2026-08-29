import { Surprise } from '../../types';
import CountdownTimer from './CountdownTimer';
import GiftBox from './GiftBox';
import { Lock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import { getOccasionById } from '../../utils/occasions';
import { getTheme } from '../../utils/themes';

interface LockedViewProps {
  surprise: Surprise;
  onUnlock: () => void;
}

export default function LockedView({ surprise, onUnlock }: LockedViewProps) {
  const occasion = getOccasionById(surprise.occasion);
  const decorativeElements = occasion?.decorative_elements || [];
  const themeConfig = getTheme(surprise.theme);
  const textColor = themeConfig.textColor;

  let formattedDate = '';
  try {
    formattedDate = format(new Date(surprise.unlock_at), "MMMM d, yyyy 'at' h:mm a");
  } catch {
    formattedDate = surprise.unlock_at;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Decorative elements */}
      {decorativeElements.map((el, i) => (
        <div
          key={`decor-${i}`}
          className="absolute text-2xl sm:text-4xl opacity-20 pointer-events-none animate-pulse-glow"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        >
          {el}
        </div>
      ))}

      {/* Background sparkles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full animate-twinkle ${textColor === 'text-white' || textColor.includes('50') ? 'bg-white' : 'bg-slate-800'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className={`${textColor} opacity-50 text-sm mb-2 tracking-wider uppercase`}>
            🎁 A Surprise For You
          </p>
          <h1 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-2`}>
            {surprise.recipient_name} <span className="text-pink-400">❤️</span>
          </h1>
          {surprise.creator_name && (
            <p className={`${textColor} opacity-40 text-sm`}>
              From {surprise.creator_name}
            </p>
          )}
        </div>

        {/* Greeting */}
        {surprise.greeting && (
          <p className={`${textColor} opacity-60 text-lg italic mb-10 leading-relaxed max-w-md mx-auto`}>
            "{surprise.greeting}"
          </p>
        )}

        {/* Gift box graphic */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <GiftBox state="locked" boxStyleId={surprise.box_style} />
        </motion.div>

        {/* Countdown label */}
        <p className={`${textColor} opacity-40 text-sm uppercase tracking-widest mb-4`}>
          Your surprise unlocks in
        </p>

        {/* Unlock date */}
        <p className={`${textColor} opacity-30 text-sm mb-6`}>
          Unlocks on {formattedDate}
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <CountdownTimer
            unlockAt={surprise.unlock_at}
            serverTime={surprise.server_time}
            onUnlock={onUnlock}
            textColor={textColor}
          />
        </div>

        {/* Lock status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
          <Lock className="w-4 h-4 text-pink-400" />
          <span className={`${textColor} opacity-60 text-sm font-medium`}>LOCKED</span>
        </div>
      </div>
    </div>
  );
}
