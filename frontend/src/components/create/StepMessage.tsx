import { CreateSurpriseData } from '../../types';
import { Lock, Eye } from 'lucide-react';
import ItemBuilder from './ItemBuilder';

interface Props {
  data: CreateSurpriseData;
  onChange: (data: Partial<CreateSurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepMessage({ data, onChange, onNext, onBack }: Props) {
  const items = data.items || [];
  // Must have at least one item
  const isValid = items.length > 0 && items.every(i => (i.type === 'text' || i.type === 'letter') ? !!i.content?.trim() : !!i.media_url);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Build your surprise</h2>
        <p className="text-white/50">Add messages, photos, videos, or links</p>
      </div>

      {/* Security notice */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-white/80 text-sm font-medium">All items stay hidden securely</p>
          <p className="text-white/40 text-xs mt-1">
            The recipient won't see any of this until the exact unlock time.
          </p>
        </div>
      </div>

      {/* Item Builder */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <Eye className="w-4 h-4" />
          Surprise Content <span className="text-pink-400">*</span>
        </label>
        <ItemBuilder 
          items={items}
          onChange={(newItems) => onChange({ items: newItems })}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 glass text-white/70 hover:text-white rounded-xl font-medium transition-all hover:bg-white/10"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Preview →
        </button>
      </div>
    </div>
  );
}
