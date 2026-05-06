'use client';

import { useState } from 'react';
import { FitData } from './SurveyClient';

interface Props {
  initialData: FitData | null;
  onSubmit: (data: FitData) => void;
  onBack: () => void;
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

const PROBLEM_AREA_OPTIONS = [
  'Waistband rolls',
  'Seat sags',
  'Thighs too tight',
  'Calves too tight',
  'Ankles too tight',
  'Crotch area',
  'No issues',
];

export default function Step3FitFeedback({ initialData, onSubmit, onBack }: Props) {
  const [waistbandFit, setWaistbandFit] = useState(initialData?.waistbandFit ?? '');
  const [hipSeatFit, setHipSeatFit] = useState(initialData?.hipSeatFit ?? '');
  const [length, setLength] = useState(initialData?.length ?? '');
  const [overallVerdict, setOverallVerdict] = useState(initialData?.overallVerdict ?? '');
  const [compressionFeel, setCompressionFeel] = useState(initialData?.compressionFeel ?? '');
  const [problemAreas, setProblemAreas] = useState<string[]>(initialData?.problemAreas ?? []);
  const [fitComments, setFitComments] = useState(initialData?.fitComments ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleProblemArea(area: string) {
    setProblemAreas(prev => {
      if (prev.includes(area)) return prev.filter(a => a !== area);
      return [...prev, area];
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!waistbandFit) errs.waistbandFit = 'Please select an option';
    if (!hipSeatFit) errs.hipSeatFit = 'Please select an option';
    if (!length) errs.length = 'Please select an option';
    if (!overallVerdict) errs.overallVerdict = 'Please select an option';
    if (!compressionFeel) errs.compressionFeel = 'Please select an option';
    if (problemAreas.length === 0) errs.problemAreas = 'Please select at least one option';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ waistbandFit, hipSeatFit, length, overallVerdict, compressionFeel, problemAreas, fitComments });
  }

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-6">
      <h2 className="text-xl font-bold text-[#1B1B1B] mb-1">How did it fit?</h2>
      <p className="text-[#6D7B87] text-sm mb-6">Tell us about the fit of the tights you tried on.</p>

      <form onSubmit={handleSubmit} noValidate>
        <RadioGroup
          label="Waistband fit"
          options={['Too tight', 'Good', 'Too loose']}
          value={waistbandFit}
          onChange={setWaistbandFit}
          error={errors.waistbandFit}
        />

        <RadioGroup
          label="Hip / seat fit"
          options={['Too tight', 'Good', 'Too loose']}
          value={hipSeatFit}
          onChange={setHipSeatFit}
          error={errors.hipSeatFit}
        />

        <RadioGroup
          label="Length"
          options={['Too short', 'Good', 'Too long']}
          value={length}
          onChange={setLength}
          error={errors.length}
        />

        <RadioGroup
          label="Overall verdict"
          options={['Size down', 'Stay in this size', 'Size up']}
          value={overallVerdict}
          onChange={setOverallVerdict}
          error={errors.overallVerdict}
        />

        <RadioGroup
          label="Compression feel"
          options={['Not enough compression', 'Good compression', 'Too much compression']}
          value={compressionFeel}
          onChange={setCompressionFeel}
          error={errors.compressionFeel}
        />

        {/* Problem Areas (multi-select) */}
        <div className="mb-5">
          <p className="text-sm font-medium text-[#1B1B1B] mb-2">Problem areas <span className="text-[#6D7B87] font-normal">(select all that apply)</span></p>
          <div className="flex flex-wrap gap-2">
            {PROBLEM_AREA_OPTIONS.map(area => (
              <button
                key={area}
                type="button"
                onClick={() => toggleProblemArea(area)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  problemAreas.includes(area)
                    ? 'bg-[#B4406A] text-white border-[#B4406A]'
                    : 'bg-white text-[#1B1B1B] border-[#E4E9ED] hover:border-[#B4406A]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
          {errors.problemAreas && <p className="text-red-500 text-xs mt-1">{errors.problemAreas}</p>}
        </div>

        {/* Comments */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Comments <span className="text-[#6D7B87] font-normal">(optional)</span>
          </label>
          <textarea
            value={fitComments}
            onChange={e => setFitComments(e.target.value)}
            placeholder="Any other notes about the fit..."
            rows={3}
            className="w-full border border-[#E4E9ED] rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent resize-none"
          />
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
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
