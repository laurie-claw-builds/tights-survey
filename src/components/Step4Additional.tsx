'use client';

import { useState } from 'react';
import { AdditionalData } from './SurveyClient';

interface Props {
  onSubmit: (data: AdditionalData) => void;
  onBack: () => void;
  submitting: boolean;
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function RadioGroup({ label, options, value, onChange, error }: RadioGroupProps) {
  return (
    <div className="mb-5">
      <p className="text-sm font-medium text-[#1B1B1B] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              value === opt
                ? 'bg-[#B4406A] text-white border-[#B4406A]'
                : 'bg-white text-[#1B1B1B] border-[#E4E9ED] hover:border-[#B4406A]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Step4Additional({ onSubmit, onBack, submitting }: Props) {
  const [turnoutSupport, setTurnoutSupport] = useState('');
  const [turnoutComments, setTurnoutComments] = useState('');
  const [followUpEmail, setFollowUpEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!turnoutSupport) errs.turnoutSupport = 'Please select an option';
    if (followUpEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(followUpEmail)) {
      errs.followUpEmail = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ turnoutSupport, turnoutComments, followUpEmail });
  }

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-6">
      <h2 className="text-xl font-bold text-[#1B1B1B] mb-1">Almost done</h2>
      <p className="text-[#6D7B87] text-sm mb-6">Just a few final questions about your experience.</p>

      <form onSubmit={handleSubmit} noValidate>
        <RadioGroup
          label="Did the tights support or restrict your turnout?"
          options={['Supported turnout', 'No effect', 'Restricted turnout']}
          value={turnoutSupport}
          onChange={setTurnoutSupport}
          error={errors.turnoutSupport}
        />

        {/* Turnout Comments */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Turnout comments <span className="text-[#6D7B87] font-normal">(optional)</span>
          </label>
          <textarea
            value={turnoutComments}
            onChange={e => setTurnoutComments(e.target.value)}
            placeholder="Tell us more about how it felt for turnout..."
            rows={3}
            className="w-full border border-[#E4E9ED] rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent resize-none"
          />
        </div>

        {/* Follow-up Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Email <span className="text-[#6D7B87] font-normal">(optional — if you'd like us to follow up)</span>
          </label>
          <input
            type="email"
            value={followUpEmail}
            onChange={e => {
              setFollowUpEmail(e.target.value);
              if (errors.followUpEmail) setErrors(prev => ({ ...prev, followUpEmail: '' }));
            }}
            placeholder="your@email.com"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent ${
              errors.followUpEmail ? 'border-red-400' : 'border-[#E4E9ED]'
            }`}
          />
          {errors.followUpEmail && <p className="text-red-500 text-xs mt-1">{errors.followUpEmail}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex-1 border border-[#E4E9ED] text-[#6D7B87] font-semibold py-3 px-6 rounded-full hover:bg-[#F5F7F8] transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#B4406A] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#9d3459] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
