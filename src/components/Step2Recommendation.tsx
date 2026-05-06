'use client';

import { useState } from 'react';
import { RecommendationData } from './SurveyClient';
import { SIZE_ORDER, Size } from '@/lib/sizing';

interface Props {
  recommendation: RecommendationData;
  onSubmit: (sizeTried: Size) => void;
  onBack: () => void;
}

export default function Step2Recommendation({ recommendation, onSubmit, onBack }: Props) {
  const [sizeTried, setSizeTried] = useState<Size>(recommendation.sizeTried);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sizeTried) {
      setError('Please select a size');
      return;
    }
    onSubmit(sizeTried);
  }

  const { recommendedSize, drivingFactor, heightCm, waistCm, hipCm } = recommendation;

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-6">
      <h2 className="text-xl font-bold text-[#1B1B1B] mb-1">Your recommended size</h2>
      <p className="text-[#6D7B87] text-sm mb-6">Based on your measurements.</p>

      {/* Size Badge */}
      <div className="flex flex-col items-center py-6 mb-4 bg-[#F5F7F8] rounded-xl">
        <div className="bg-[#B4406A] text-white text-5xl font-bold px-8 py-4 rounded-full mb-3 min-w-[100px] text-center">
          {recommendedSize}
        </div>
        <p className="text-[#6D7B87] text-sm font-medium">
          Driven by: <span className="text-[#1B1B1B] font-semibold">{drivingFactor} measurement</span>
        </p>
      </div>

      {/* Measurement Summary */}
      <div className="flex items-center justify-center gap-4 text-sm text-[#6D7B87] mb-6 px-2 flex-wrap">
        <span>Height: <strong className="text-[#1B1B1B]">{heightCm.toFixed(1)} cm</strong></span>
        <span className="text-[#E4E9ED]">|</span>
        <span>Waist: <strong className="text-[#1B1B1B]">{waistCm.toFixed(1)} cm</strong></span>
        <span className="text-[#E4E9ED]">|</span>
        <span>Hip: <strong className="text-[#1B1B1B]">{hipCm.toFixed(1)} cm</strong></span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Size Tried */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            What size did you try on?
          </label>
          <select
            value={sizeTried}
            onChange={e => {
              setSizeTried(e.target.value as Size);
              setError('');
            }}
            className="w-full border border-[#E4E9ED] rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent bg-white"
          >
            {SIZE_ORDER.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-[#E4E9ED] text-[#6D7B87] font-semibold py-3 px-6 rounded-full hover:bg-[#F5F7F8] transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#B4406A] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#9d3459] transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
