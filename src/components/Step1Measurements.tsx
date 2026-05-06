'use client';

import { useState, useEffect } from 'react';
import { MeasurementsData } from './SurveyClient';

interface Props {
  initialData: MeasurementsData | null;
  onSubmit: (data: MeasurementsData) => void;
}

export default function Step1Measurements({ initialData, onSubmit }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [height, setHeight] = useState(initialData?.height ?? '');
  const [waist, setWaist] = useState(initialData?.waist ?? '');
  const [hip, setHip] = useState(initialData?.hip ?? '');
  const [unit, setUnit] = useState<'cm' | 'in'>(initialData?.unit ?? 'cm');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When unit toggles, convert existing values
  useEffect(() => {
    // Don't convert on initial mount
  }, []);

  function toggleUnit() {
    const newUnit = unit === 'cm' ? 'in' : 'cm';
    const factor = newUnit === 'in' ? 1 / 2.54 : 2.54;

    function convert(val: string) {
      const n = parseFloat(val);
      if (!isNaN(n)) return (n * factor).toFixed(1);
      return val;
    }

    setHeight(h => convert(h));
    setWaist(w => convert(w));
    setHip(h => convert(h));
    setUnit(newUnit);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      errs.height = 'Please enter your height';
    }
    if (!waist || isNaN(parseFloat(waist)) || parseFloat(waist) <= 0) {
      errs.waist = 'Please enter your waist measurement';
    }
    if (!hip || isNaN(parseFloat(hip)) || parseFloat(hip) <= 0) {
      errs.hip = 'Please enter your hip measurement';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name, height, waist, hip, unit });
  }

  const unitLabel = unit === 'cm' ? 'cm' : 'in';

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-6">
      <h2 className="text-xl font-bold text-[#1B1B1B] mb-1">Your measurements</h2>
      <p className="text-[#6D7B87] text-sm mb-6">Enter your body measurements to get your recommended size.</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Unit Toggle */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-[#6D7B87]">Unit</span>
          <button
            type="button"
            onClick={toggleUnit}
            className="flex items-center bg-[#F5F7F8] border border-[#E4E9ED] rounded-full p-0.5 text-sm font-medium"
          >
            <span
              className={`px-4 py-1.5 rounded-full transition-colors ${
                unit === 'cm' ? 'bg-[#B4406A] text-white' : 'text-[#6D7B87]'
              }`}
            >
              cm
            </span>
            <span
              className={`px-4 py-1.5 rounded-full transition-colors ${
                unit === 'in' ? 'bg-[#B4406A] text-white' : 'text-[#6D7B87]'
              }`}
            >
              in
            </span>
          </button>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Name <span className="text-[#6D7B87] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah"
            className="w-full border border-[#E4E9ED] rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent"
          />
        </div>

        {/* Height */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Height <span className="text-[#6D7B87] font-normal">({unitLabel})</span>
          </label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder={unit === 'cm' ? 'e.g. 168' : 'e.g. 66.1'}
            step="0.1"
            min="0"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent ${
              errors.height ? 'border-red-400' : 'border-[#E4E9ED]'
            }`}
          />
          {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
        </div>

        {/* Waist */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Waist <span className="text-[#6D7B87] font-normal">(body measurement, {unitLabel})</span>
          </label>
          <input
            type="number"
            value={waist}
            onChange={e => setWaist(e.target.value)}
            placeholder={unit === 'cm' ? 'e.g. 70' : 'e.g. 27.6'}
            step="0.1"
            min="0"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent ${
              errors.waist ? 'border-red-400' : 'border-[#E4E9ED]'
            }`}
          />
          {errors.waist && <p className="text-red-500 text-xs mt-1">{errors.waist}</p>}
        </div>

        {/* Hip */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1B1B1B] mb-1.5">
            Hip <span className="text-[#6D7B87] font-normal">(body measurement, fullest point, {unitLabel})</span>
          </label>
          <input
            type="number"
            value={hip}
            onChange={e => setHip(e.target.value)}
            placeholder={unit === 'cm' ? 'e.g. 92' : 'e.g. 36.2'}
            step="0.1"
            min="0"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6D7B87] focus:outline-none focus:ring-2 focus:ring-[#B4406A] focus:border-transparent ${
              errors.hip ? 'border-red-400' : 'border-[#E4E9ED]'
            }`}
          />
          {errors.hip && <p className="text-red-500 text-xs mt-1">{errors.hip}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-[#B4406A] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#9d3459] transition-colors"
        >
          Calculate my size
        </button>
      </form>
    </div>
  );
}
