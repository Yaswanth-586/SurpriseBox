import { CreateSurpriseData } from '../../types';
import { getOccasionById } from '../../utils/occasions';
import { format } from 'date-fns';
import { Gift, Calendar, User, MessageSquare, Lock, Loader2 } from 'lucide-react';

interface Props {
  data: CreateSurpriseData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepPreview({ data, onBack, onSubmit, isSubmitting }: Props) {
  const occasion = getOccasionById(data.occasion);
  let formattedDate = '';
  try {
    const d = new Date(data.unlock_at);
    formattedDate = format(d, "MMMM d, yyyy 'at' h:mm a");
  } catch {
    formattedDate = data.unlock_at;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Preview your surprise</h2>
        <p className="text-white/50">Review everything before creating</p>
      </div>

      {/* Preview card */}
      <div className="glass rounded-2xl p-8 space-y-6 mb-8">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl block mb-3">{occasion?.icon || '🎁'}</span>
          <h3 className="text-xl font-bold text-white">{data.title}</h3>
          {data.creator_name && (
            <p className="text-white/40 text-sm mt-1">From {data.creator_name}</p>
          )}
        </div>

        <div className="h-px bg-white/10" />

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white/40 text-xs">Recipient</p>
              <p className="text-white font-medium">{data.recipient_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-white/40 text-xs">Occasion</p>
              <p className="text-white font-medium">{occasion?.name || data.occasion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-white/40 text-xs">Unlocks on</p>
              <p className="text-white font-medium">{formattedDate}</p>
              <p className="text-white/30 text-xs">{data.timezone}</p>
            </div>
          </div>

          {data.greeting && (
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white/40 text-xs">Teaser message (visible before unlock)</p>
                <p className="text-white/70 text-sm mt-1 italic">"{data.greeting}"</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white/40 text-xs">Secret message (hidden until unlock)</p>
              <p className="text-white/70 text-sm mt-1 line-clamp-3">"{data.message}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 glass text-white/70 hover:text-white rounded-xl font-medium transition-all hover:bg-white/10 disabled:opacity-40"
        >
          ← Edit
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>Create Surprise 🎁</>
          )}
        </button>
      </div>
    </div>
  );
}
