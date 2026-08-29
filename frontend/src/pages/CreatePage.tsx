import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateSurpriseData } from '../types';
import { createSurprise } from '../api/client';
import Stepper from '../components/create/Stepper';
import StepDetails from '../components/create/StepDetails';
import StepOccasion from '../components/create/StepOccasion';
import StepUnlockTime from '../components/create/StepUnlockTime';
import StepMessage from '../components/create/StepMessage';
import StepDesign from '../components/create/StepDesign';
import StepPreview from '../components/create/StepPreview';

const STEPS = ['Details', 'Occasion', 'Design', 'Unlock Time', 'Content', 'Preview'];

export default function CreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateSurpriseData>({
    recipient_name: '',
    title: 'A Little Something For You',
    creator_name: undefined,
    occasion: '',
    occasion_icon: undefined,
    greeting: undefined,
    message: '',
    items: [],
    unlock_at: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    theme: 'elegant',
    box_style: 'classic',
  });

  const updateForm = (updates: Partial<CreateSurpriseData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const submitData = { ...formData };
      const result = await createSurprise(submitData);
      navigate(`/success/${result.public_token}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create surprise. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {currentStep === 0 && (
          <StepDetails
            data={formData}
            onChange={updateForm}
            onNext={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 1 && (
          <StepOccasion
            data={formData}
            onChange={updateForm}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        )}
        {currentStep === 2 && (
          <StepDesign
            data={formData}
            onChange={updateForm}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <StepUnlockTime
            data={formData}
            onChange={updateForm}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <StepMessage
            data={formData}
            onChange={updateForm}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <StepPreview
            data={formData}
            onBack={() => setCurrentStep(4)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
