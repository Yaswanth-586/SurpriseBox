import { motion } from 'framer-motion';
import { getBoxStyle } from '../../utils/themes';

interface GiftBoxProps {
  state: 'locked' | 'shaking' | 'opening' | 'opened';
  boxStyleId?: string;
}

export default function GiftBox({ state, boxStyleId = 'classic' }: GiftBoxProps) {
  const isShaking = state === 'shaking';
  const isOpening = state === 'opening' || state === 'opened';
  const style = getBoxStyle(boxStyleId);

  return (
    <div className="relative inline-block">
      {/* Sparkles around the box */}
      {['locked', 'shaking'].includes(state) && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-twinkle"
              style={{
                background: style.sparkles[i % style.sparkles.length],
                left: `${50 + 55 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 55 * Math.sin((i * Math.PI * 2) / 8)}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
        state === 'shaking' ? 'bg-purple-500/30 blur-3xl scale-150' : 'bg-purple-500/10 blur-2xl scale-125'
      }`} />

      <motion.div
        className="relative"
        animate={
          isShaking
            ? { x: [0, -5, 5, -5, 5, -3, 3, 0], rotate: [0, -2, 2, -2, 2, -1, 1, 0] }
            : {}
        }
        transition={
          isShaking
            ? { duration: 0.6, repeat: Infinity, repeatDelay: 1 }
            : {}
        }
      >
        {/* Box container */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48">
          {/* Lid */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
            animate={
              isOpening
                ? { y: -60, rotateX: -40, opacity: 0 }
                : state === 'locked'
                  ? { y: [0, -4, 0] }
                  : {}
            }
            transition={
              isOpening
                ? { duration: 0.8, ease: 'easeOut' }
                : state === 'locked'
                  ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  : {}
            }
          >
            {/* Lid top */}
            <div className={`w-40 sm:w-52 h-8 sm:h-10 bg-gradient-to-b ${style.lid} rounded-t-xl border-2 border-white/20 shadow-lg relative`}>
              {/* Horizontal ribbon */}
              <div className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gradient-to-r ${style.ribbon}`} />
              {/* Bow */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                <div className={`w-5 h-5 bg-gradient-to-br ${style.ribbon} rounded-full border border-white/30`} />
                <div className={`w-3 h-4 bg-gradient-to-b ${style.ribbon} rounded-sm`} />
                <div className={`w-5 h-5 bg-gradient-to-br ${style.ribbon} rounded-full border border-white/30`} />
              </div>
            </div>
          </motion.div>

          {/* Box body */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-28 sm:h-36 bg-gradient-to-b ${style.body} rounded-b-xl border-2 border-white/20 shadow-2xl overflow-hidden`}>
            {/* Vertical ribbon */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-b ${style.ribbon}`} />
            {/* Inner glow when opening */}
            {isOpening && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/30 to-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          {/* Burst particles when opening */}
          {isOpening && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: style.sparkles[i % style.sparkles.length],
                    left: '50%',
                    top: '30%',
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 12) * 120,
                    y: Math.sin((i * Math.PI * 2) / 12) * 120 - 40,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.2, delay: i * 0.05, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
