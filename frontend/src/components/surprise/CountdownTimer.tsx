import { useState, useEffect, useRef, useCallback } from 'react';

interface CountdownTimerProps {
  unlockAt: string;
  serverTime: string;
  onUnlock: () => void;
  textColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function TimeUnit({ value, label, textColor = 'text-white' }: { value: number; label: string; textColor?: string }) {
  return (
    <div className="glass rounded-xl p-3 sm:p-5 min-w-[70px] sm:min-w-[90px] text-center">
      <div className={`text-2xl sm:text-4xl md:text-5xl font-bold ${textColor} tabular-nums`}>
        {String(value).padStart(2, '0')}
      </div>
      <div className={`${textColor} opacity-40 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-medium`}>
        {label}
      </div>
    </div>
  );
}

export default function CountdownTimer({ unlockAt, serverTime, onUnlock, textColor = 'text-white' }: CountdownTimerProps) {
  // Compute the offset between server clock and local clock ONCE at mount.
  // offset = serverTime - localTimeAtMount
  // Then each tick: correctedNow = Date.now() + offset ≈ current server time
  const offsetRef = useRef<number>(
    new Date(serverTime).getTime() - Date.now()
  );

  const unlockMs = useRef<number>(new Date(unlockAt).getTime());
  const hasUnlocked = useRef(false);

  const calcTimeLeft = useCallback((): TimeLeft => {
    const correctedNow = Date.now() + offsetRef.current;
    const diff = unlockMs.current - correctedNow;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = calcTimeLeft();
      setTimeLeft(tl);

      if (tl.total <= 0 && !hasUnlocked.current) {
        hasUnlocked.current = true;
        clearInterval(interval);
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calcTimeLeft, onUnlock]);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" textColor={textColor} />
      <span className={`${textColor} opacity-30 text-2xl font-light`}>:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" textColor={textColor} />
      <span className={`${textColor} opacity-30 text-2xl font-light`}>:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" textColor={textColor} />
      <span className={`${textColor} opacity-30 text-2xl font-light`}>:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" textColor={textColor} />
    </div>
  );
}
