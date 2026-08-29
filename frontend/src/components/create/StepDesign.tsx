import { CreateSurpriseData } from '../../types';
import { THEMES, BOX_STYLES } from '../../utils/themes';
import { Palette, Box } from 'lucide-react';
import GiftBox from '../surprise/GiftBox';

interface Props {
  data: CreateSurpriseData;
  onChange: (data: Partial<CreateSurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDesign({ data, onChange, onNext, onBack }: Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Design your surprise</h2>
        <p className="text-white/50">Choose a theme and gift box style</p>
      </div>

      <div className="space-y-6">
        {/* Themes Selection (Only for custom occasion) */}
        {data.occasion === 'custom' && (
          <div>
            <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
              <Palette className="w-4 h-4" />
              Select Custom Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEMES.filter(t => !['birthday', 'romantic', 'christmas', 'diwali', 'festival', 'holi', 'ugadi', 'sankranti', 'eid', 'graduation', 'friendship', 'wedding', 'achievement'].includes(t.id)).map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onChange({ theme: theme.id })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    data.theme === theme.id 
                      ? 'ring-2 ring-purple-400 bg-white/10' 
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mb-2 border border-white/20 ${theme.background}`} />
                  <div className="font-medium text-white text-sm">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Box Style Selection */}
        <div>
          <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
            <Box className="w-4 h-4" />
            Select Gift Box
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BOX_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => onChange({ box_style: style.id })}
                className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  data.box_style === style.id 
                    ? 'ring-2 ring-purple-400 bg-white/10' 
                    : 'glass hover:bg-white/5'
                }`}
              >
                <div className="scale-50 -my-8 pointer-events-none">
                  <GiftBox state="locked" boxStyleId={style.id} />
                </div>
                <div className="font-medium text-white text-xs text-center">{style.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-white/10">
        <button
          onClick={onBack}
          className="flex-1 py-3 glass text-white/70 hover:text-white rounded-xl font-medium transition-all hover:bg-white/10"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
