import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = i < currentStep;

        return (
          <div key={i} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : isCompleted
                    ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 cursor-pointer'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isCompleted ? 'bg-purple-500 text-white' : isCurrent ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-px mx-1 ${i < currentStep ? 'bg-purple-500' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
