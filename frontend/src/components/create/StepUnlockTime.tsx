import { CreateSurpriseData } from '../../types';
import { Calendar, Clock, Globe, Zap } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

interface Props {
  data: CreateSurpriseData;
  onChange: (data: Partial<CreateSurpriseData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const timezones = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (browserTz && !timezones.includes(browserTz)) {
  timezones.push(browserTz);
  timezones.sort();
}

export default function StepUnlockTime({ data, onChange, onNext, onBack }: Props) {
  // Extract date and time from unlock_at
  const unlockDate = data.unlock_at ? data.unlock_at.slice(0, 10) : '';
  const unlockTime = data.unlock_at ? data.unlock_at.slice(11, 16) : '';

  const handleDateChange = (date: string) => {
    const time = unlockTime || '00:00';
    onChange({ unlock_at: `${date}T${time}:00` });
  };

  const handleTimeChange = (time: string) => {
    const date = unlockDate || format(new Date(), 'yyyy-MM-dd');
    onChange({ unlock_at: `${date}T${time}:00` });
  };

  const handleQuickTest = () => {
    const twoMinFromNow = addMinutes(new Date(), 2);
    const date = format(twoMinFromNow, 'yyyy-MM-dd');
    const time = format(twoMinFromNow, 'HH:mm');
    onChange({ unlock_at: `${date}T${time}:00` });
  };

  // Format display date
  let displayText = '';
  if (unlockDate && unlockTime) {
    try {
      const d = new Date(`${unlockDate}T${unlockTime}:00`);
      displayText = format(d, "MMMM d, yyyy 'at' h:mm a");
    } catch {
      displayText = '';
    }
  }

  const isValid = unlockDate && unlockTime;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">When should it unlock?</h2>
        <p className="text-white/50">Choose the perfect moment for the big reveal</p>
      </div>

      {/* Quick test button */}
      <button
        onClick={handleQuickTest}
        className="w-full py-2 glass text-purple-300 hover:text-purple-200 rounded-xl text-sm font-medium transition-all hover:bg-purple-500/10 flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        Quick Test: 2 minutes from now
      </button>

      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <Calendar className="w-4 h-4" />
          Unlock date <span className="text-pink-400">*</span>
        </label>
        <input
          type="date"
          value={unlockDate}
          onChange={e => handleDateChange(e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
        />
      </div>

      {/* Time */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <Clock className="w-4 h-4" />
          Unlock time <span className="text-pink-400">*</span>
        </label>
        <input
          type="time"
          value={unlockTime}
          onChange={e => handleTimeChange(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
          <Globe className="w-4 h-4" />
          Timezone
        </label>
        <select
          value={data.timezone}
          onChange={e => onChange({ timezone: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
        >
          {timezones.map(tz => (
            <option key={tz} value={tz} className="bg-slate-800">{tz}</option>
          ))}
        </select>
      </div>

      {/* Preview */}
      {displayText && (
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-white/50 text-sm mb-1">Your surprise will unlock on</p>
          <p className="text-white font-semibold text-lg">{displayText}</p>
          <p className="text-white/40 text-xs mt-1">{data.timezone}</p>
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
          disabled={!isValid}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
