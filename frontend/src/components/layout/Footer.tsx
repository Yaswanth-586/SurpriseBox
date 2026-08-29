import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-white font-bold text-lg">SurpriseBox</span>
        </div>
        <p className="text-white/40 text-sm">
          Make the waiting part of the surprise.
        </p>
        <p className="text-white/20 text-xs mt-4 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for special moments
        </p>
      </div>
    </footer>
  );
}
