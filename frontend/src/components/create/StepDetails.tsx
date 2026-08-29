import { CreateSurpriseData } from '../../types';
import { User, Type, UserCheck, MessageSquare } from 'lucide-react';

interface Props {
  data: CreateSurpriseData;
  onChange: (data: Partial<CreateSurpriseData>) => void;
  onNext: () => void;
}

export default function StepDetails({ data, onChange, onNext }: Props) {
  const isValid = data.recipient_name.trim().length > 0 && data.title.trim().length > 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about your surprise</h2>
        <p className="text-white/50">Who is it for, and what should we call it?</p>
      </div>

      {/* Recipient Name */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <User className="w-4 h-4" />
          Who is this surprise for? <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          value={data.recipient_name}
          onChange={e => onChange({ recipient_name: e.target.value })}
          placeholder="e.g., Ananya"
          maxLength={200}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Title */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <Type className="w-4 h-4" />
          Surprise title <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="e.g., A Little Something For You"
          maxLength={500}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Creator Name */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <UserCheck className="w-4 h-4" />
          Who is this from? <span className="text-white/30">(optional)</span>
        </label>
        <input
          type="text"
          value={data.creator_name || ''}
          onChange={e => onChange({ creator_name: e.target.value || undefined })}
          placeholder="e.g., Yaswanth"
          maxLength={200}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* Greeting */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <MessageSquare className="w-4 h-4" />
          Teaser message <span className="text-white/30">(shown while waiting)</span>
        </label>
        <textarea
          value={data.greeting || ''}
          onChange={e => onChange({ greeting: e.target.value || undefined })}
          placeholder="e.g., Something special is waiting for you..."
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25"
      >
        Continue →
      </button>
    </div>
  );
}
