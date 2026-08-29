import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Surprise, SurpriseContent } from '../../types';
import { getOccasionById } from '../../utils/occasions';
import { getTheme } from '../../utils/themes';
import GiftBox from './GiftBox';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MessageRevealProps {
  surprise: Surprise;
  content: SurpriseContent;
}

export default function MessageReveal({ surprise, content }: MessageRevealProps) {
  const [phase, setPhase] = useState(0); // 0: opening, 1: greeting, 2: message, 3: end
  const occasion = getOccasionById(surprise.occasion);
  const decorativeElements = occasion?.decorative_elements || [];
  const themeConfig = getTheme(surprise.theme);
  const textColor = themeConfig.textColor;

  useEffect(() => {
    // Phase progression
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => {
      setPhase(1);
      // Trigger confetti on box open
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f59e0b', '#6366f1', '#10b981']
      });
    }, 1500));  // Show greeting after box opens
    timers.push(setTimeout(() => setPhase(2), 3500));  // Show message
    timers.push(setTimeout(() => setPhase(3), 5500));  // Show ending
    return () => timers.forEach(clearTimeout);
  }, []);

  // Parse message into paragraphs
  const messageParagraphs = content.message ? content.message.split('\n').filter(p => p.trim()) : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      {/* Decorative elements */}
      {decorativeElements.map((el, i) => (
        <div
          key={`decor-${i}`}
          className="absolute text-2xl sm:text-4xl opacity-10 pointer-events-none"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            transform: `rotate(${Math.random() * 45 - 20}deg)`,
          }}
        >
          {el}
        </div>
      ))}

      {/* Background particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full animate-twinkle ${textColor === 'text-white' || textColor.includes('50') ? 'bg-white/30' : 'bg-slate-800/30'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {/* Phase 0: Gift box opening */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="opening"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="py-20"
            >
              <GiftBox state="opening" boxStyleId={surprise.box_style} />
            </motion.div>
          )}

          {/* Phase 1: Occasion greeting */}
          {phase >= 1 && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-12"
            >
              <span className="text-5xl block mb-4">{occasion?.icon || surprise.occasion_icon || '🎁'}</span>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} mb-3 leading-tight`}>
                {occasion?.name === 'Birthday' ? `Happy Birthday, ${surprise.recipient_name}!` :
                 occasion?.name === 'Anniversary' ? `Happy Anniversary, ${surprise.recipient_name}!` :
                 `${surprise.title}`}
              </h1>
              {surprise.creator_name && (
                <p className={`${textColor} opacity-40 text-sm`}>From {surprise.creator_name}</p>
              )}
            </motion.div>
          )}

          {/* Phase 2: Secret content reveal */}
          {phase >= 2 && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8 mb-12"
            >
              {/* Support legacy message */}
              {content.message && (
                <div className={`${themeConfig.glassBg} rounded-2xl p-8 sm:p-10 text-left`}>
                  <div className="space-y-4">
                    {messageParagraphs.map((paragraph, i) => (
                      <motion.p
                        key={`msg-${i}`}
                        className={`${textColor} opacity-80 text-base sm:text-lg leading-relaxed`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.3, duration: 0.5 }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Multiple Items */}
              {content.items && content.items.map((item, index) => (
                <motion.div
                  key={`item-${item.id || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.4, duration: 0.6 }}
                  className={`mx-auto ${item.type === 'letter' ? 'max-w-xl' : 'max-w-2xl'}`}
                >
                  {item.type === 'text' && (
                    <div className={`${themeConfig.glassBg} rounded-2xl p-6 sm:p-8 text-left`}>
                      <div className={`space-y-4 ${textColor} opacity-80 text-base sm:text-lg leading-relaxed`}>
                        {item.content?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      </div>
                    </div>
                  )}

                  {item.type === 'letter' && (
                    <div className="bg-[#fdfbf7] text-[#3e342f] rounded-lg p-8 sm:p-12 shadow-2xl relative rotate-[-1deg] font-serif">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                      <div className="relative z-10 space-y-4 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </div>
                    </div>
                  )}

                  {item.type === 'photo' && item.media_url && (
                    <div className={`${themeConfig.glassBg} rounded-2xl p-2 sm:p-3 shadow-2xl inline-block`}>
                      <img 
                        src={`${item.media_url}?token=${surprise.public_token}`} 
                        alt={item.title || "Surprise photo"} 
                        className="rounded-xl max-w-full h-auto object-cover max-h-[70vh]"
                      />
                      {item.title && <p className={`${textColor} opacity-60 mt-3 text-sm italic`}>{item.title}</p>}
                    </div>
                  )}

                  {item.type === 'video' && item.media_url && (
                    <div className={`${themeConfig.glassBg} rounded-2xl p-2 sm:p-3 shadow-2xl`}>
                      <video 
                        src={`${item.media_url}?token=${surprise.public_token}`} 
                        controls 
                        className="rounded-xl w-full max-h-[70vh]"
                      />
                      {item.title && <p className={`${textColor} opacity-60 mt-3 text-sm italic`}>{item.title}</p>}
                    </div>
                  )}

                  {item.type === 'audio' && item.media_url && (
                    <div className={`${themeConfig.glassBg} rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4`}>
                      <span className="text-4xl">🎵</span>
                      {item.title && <p className={`${textColor} font-medium`}>{item.title}</p>}
                      <audio 
                        src={`${item.media_url}?token=${surprise.public_token}`} 
                        controls 
                        className="w-full"
                      />
                    </div>
                  )}

                  {item.type === 'link' && item.media_url && (
                    <a 
                      href={item.media_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`${themeConfig.glassBg} rounded-2xl p-6 flex flex-col items-center gap-3 hover:opacity-80 transition-opacity group`}
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">🔗</span>
                      <div>
                        <p className={`${textColor} font-medium text-lg`}>{item.title || 'Click to open link'}</p>
                        <p className={`${textColor} opacity-40 text-sm truncate max-w-xs`}>{item.media_url}</p>
                      </div>
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Phase 3: Ending */}
          {phase >= 3 && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <div className={`inline-flex items-center gap-2 ${textColor} opacity-40 text-sm`}>
                <div className={`h-px w-12 ${textColor === 'text-white' || textColor.includes('50') ? 'bg-white/10' : 'bg-slate-800/10'}`} />
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <div className={`h-px w-12 ${textColor === 'text-white' || textColor.includes('50') ? 'bg-white/10' : 'bg-slate-800/10'}`} />
              </div>
              <p className={`${textColor} opacity-50 text-lg mt-4 italic`}>
                That's everything. ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
