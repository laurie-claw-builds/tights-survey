'use client';

import { useState } from 'react';
import { submitSurvey, SurveyResponse } from '@/app/actions';
import { calculateSize, inchesToCm, SIZE_ORDER, Size } from '@/lib/sizing';
import Step1Measurements from './Step1Measurements';
import Step2Recommendation from './Step2Recommendation';
import Step3FitFeedback from './Step3FitFeedback';
import Step4Additional from './Step4Additional';
import Confirmation from './Confirmation';

export interface MeasurementsData {
  name: string;
  height: string;
  waist: string;
  hip: string;
  unit: 'cm' | 'in';
}

export interface RecommendationData {
  recommendedSize: Size;
  drivingFactor: string;
  heightCm: number;
  waistCm: number;
  hipCm: number;
  sizeTried: Size;
}

export interface FitData {
  waistbandFit: string;
  hipSeatFit: string;
  length: string;
  overallVerdict: string;
  compressionFeel: string;
  problemAreas: string[];
  fitComments: string;
}

export interface AdditionalData {
  turnoutSupport: string;
  turnoutComments: string;
  followUpEmail: string;
}

const TOTAL_STEPS = 4;

export default function SurveyClient() {
  const [step, setStep] = useState(1);
  const [measurements, setMeasurements] = useState<MeasurementsData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [fitData, setFitData] = useState<FitData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleStep1Submit(data: MeasurementsData) {
    const heightCm = data.unit === 'in' ? inchesToCm(parseFloat(data.height)) : parseFloat(data.height);
    const waistCm = data.unit === 'in' ? inchesToCm(parseFloat(data.waist)) : parseFloat(data.waist);
    const hipCm = data.unit === 'in' ? inchesToCm(parseFloat(data.hip)) : parseFloat(data.hip);

    const result = calculateSize(heightCm, waistCm, hipCm);

    setMeasurements(data);
    setRecommendation({
      recommendedSize: result.recommendedSize,
      drivingFactor: result.drivingFactor,
      heightCm,
      waistCm,
      hipCm,
      sizeTried: result.recommendedSize,
    });
    setStep(2);
  }

  function handleStep2Submit(sizeTried: Size) {
    if (!recommendation) return;
    setRecommendation({ ...recommendation, sizeTried });
    setStep(3);
  }

  function handleStep3Submit(data: FitData) {
    setFitData(data);
    setStep(4);
  }

  async function handleStep4Submit(additional: AdditionalData) {
    if (!measurements || !recommendation || !fitData) return;
    setSubmitting(true);
    setError(null);

    const payload: SurveyResponse = {
      name: measurements.name,
      heightCm: recommendation.heightCm,
      waistCm: recommendation.waistCm,
      hipCm: recommendation.hipCm,
      unitPreference: measurements.unit,
      recommendedSize: recommendation.recommendedSize,
      drivingFactor: recommendation.drivingFactor,
      sizeTried: recommendation.sizeTried,
      waistbandFit: fitData.waistbandFit,
      hipSeatFit: fitData.hipSeatFit,
      length: fitData.length,
      overallVerdict: fitData.overallVerdict,
      compressionFeel: fitData.compressionFeel,
      problemAreas: fitData.problemAreas,
      fitComments: fitData.fitComments,
      turnoutSupport: additional.turnoutSupport,
      turnoutComments: additional.turnoutComments,
      followUpEmail: additional.followUpEmail,
    };

    const result = await submitSurvey(payload);
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return <Confirmation />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B1B1B] mb-1">Backalast Turnout Tights</h1>
          <p className="text-[#6D7B87] text-sm font-medium">Size Survey</p>
        </div>

        {/* Progress */}
        <ProgressIndicator step={step} total={TOTAL_STEPS} />

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Steps */}
        {step === 1 && (
          <Step1Measurements
            initialData={measurements}
            onSubmit={handleStep1Submit}
          />
        )}
        {step === 2 && recommendation && (
          <Step2Recommendation
            recommendation={recommendation}
            onSubmit={handleStep2Submit}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3FitFeedback
            initialData={fitData}
            onSubmit={handleStep3Submit}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4Additional
            onSubmit={handleStep4Submit}
            onBack={() => setStep(3)}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}

function ProgressIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#6D7B87] font-medium">Step {step} of {total}</span>
        <span className="text-sm text-[#6D7B87]">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-[#B4406A]' : 'bg-[#E4E9ED]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
