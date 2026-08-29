import { motion } from 'framer-motion';
import GiftBox from './GiftBox';
import { Sparkles } from 'lucide-react';
import { getTheme } from '../../utils/themes';

import { Surprise } from '../../types';

interface UnlockAnimationProps {
  onOpen: () => void;
  surprise: Surprise;
}

export default function UnlockAnimation({ onOpen, surprise }: UnlockAnimationProps) {
  const themeConfig = getTheme(surprise.theme);
  const textColor = themeConfig.textColor;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Burst sparkles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: ['#a855f7', '#ec4899', '#f59e0b', '#6366f1', '#10b981'][i % 5],
          }}
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 0.5],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="relative z-10">
        {/* Unlocked text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className={`text-2xl sm:text-3xl font-bold ${textColor}`}>
              Your surprise is ready!
            </h2>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
        </motion.div>

        {/* Shaking gift box */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GiftBox state="shaking" boxStyleId={surprise.box_style} />
        </motion.div>

        {/* Open button */}
        <motion.button
          onClick={onOpen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full text-lg font-bold transition-all hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 animate-pulse-glow"
        >
          Open Your Surprise 🎁
        </motion.button>
      </div>
    </div>
  );
}
