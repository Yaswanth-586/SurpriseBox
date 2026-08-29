import { Link } from 'react-router-dom';
import { Gift, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
      style={style}
    />
  );
}

export default function HeroSection() {
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    opacity: 0.3 + Math.random() * 0.7,
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-transparent to-slate-900/80" />

      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <Sparkle key={i} style={s} />
      ))}

      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Gift box animation */}
        <motion.div
          className="mb-8 inline-block"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
        >
          <div className="relative inline-flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl animate-float flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Gift className="w-12 h-12 text-white" />
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl animate-pulse-glow opacity-50" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Some surprises are{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            worth waiting for
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Create a digital surprise that unlocks only when the moment is right.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/create"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 flex items-center gap-2"
          >
            Create a Surprise <span className="text-xl">🎁</span>
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 glass text-white/80 hover:text-white rounded-full text-lg font-medium transition-all hover:bg-white/10 flex items-center gap-2"
          >
            How It Works <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
