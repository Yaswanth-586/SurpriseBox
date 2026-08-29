import { CreateSurpriseData } from '../../types';
import { occasions } from '../../utils/occasions';

interface Props {
  data: CreateSurpriseData;
  onChange: (data: Partial<CreateSurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepOccasion({ data, onChange, onNext, onBack }: Props) {
  const handleSelect = (occasionId: string) => {
    const occasion = occasions.find(o => o.id === occasionId);
    if (occasion) {
      const updates: Partial<CreateSurpriseData> = {
        occasion: occasionId,
        occasion_icon: occasion.icon,
      };
      // Auto-fill greeting if not already set, or if they change occasion and had the old default
      updates.greeting = occasion.default_greeting;
      
      // Auto-select theme for the occasion
      if (occasion.theme) {
        updates.theme = occasion.theme;
      }

      onChange(updates);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's the occasion?</h2>
        <p className="text-white/50">Choose what you're celebrating</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-8">
        {occasions.map(occasion => (
          <button
            key={occasion.id}
            onClick={() => handleSelect(occasion.id)}
            className={`p-4 rounded-xl text-center transition-all ${
              data.occasion === occasion.id
                ? 'bg-purple-600/30 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                : 'glass hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <span className="text-2xl block mb-1">{occasion.icon}</span>
            <span className="text-white/80 text-xs sm:text-sm font-medium block truncate" title={occasion.name}>{occasion.name}</span>
          </button>
        ))}
      </div>

      {data.occasion && (
        <div className="glass p-6 rounded-xl mb-8 animate-in fade-in slide-in-from-bottom-4">
          <label className="block text-white/70 text-sm font-medium mb-3">
            Teaser Greeting (Shown before unlock)
          </label>
          <textarea
            value={data.greeting || ''}
            onChange={e => onChange({ greeting: e.target.value })}
            placeholder="Write a short greeting..."
            rows={2}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 glass text-white/70 hover:text-white rounded-xl font-medium transition-all hover:bg-white/10"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.occasion}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
