export type Size = 'CM' | 'CL' | '3XS' | '2XS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface SizeChartEntry {
  size: Size;
  pantLength: number;
  waistFlat: number;
  hipFlat: number;
  midCalf: number;
  ankleOpen: number;
  wbHeight: number;
}

export const SIZE_CHART: SizeChartEntry[] = [
  { size: 'CM',  pantLength: 83, waistFlat: 20,   hipFlat: 29,   midCalf: 10.5, ankleOpen: 6.5, wbHeight: 11.5 },
  { size: 'CL',  pantLength: 84, waistFlat: 22,   hipFlat: 31,   midCalf: 11.0, ankleOpen: 7.0, wbHeight: 11.5 },
  { size: '3XS', pantLength: 85, waistFlat: 24,   hipFlat: 33,   midCalf: 12.0, ankleOpen: 7.5, wbHeight: 11.5 },
  { size: '2XS', pantLength: 86, waistFlat: 26,   hipFlat: 35,   midCalf: 13.0, ankleOpen: 8.0, wbHeight: 11.5 },
  { size: 'XS',  pantLength: 87, waistFlat: 28,   hipFlat: 37,   midCalf: 13.5, ankleOpen: 8.5, wbHeight: 11.5 },
  { size: 'S',   pantLength: 88, waistFlat: 30.5, hipFlat: 39.5, midCalf: 14.5, ankleOpen: 9.0, wbHeight: 11.5 },
  { size: 'M',   pantLength: 89, waistFlat: 33,   hipFlat: 42,   midCalf: 15.0, ankleOpen: 9.0, wbHeight: 11.5 },
  { size: 'L',   pantLength: 90, waistFlat: 35.5, hipFlat: 44.5, midCalf: 16.0, ankleOpen: 9.5, wbHeight: 11.5 },
  { size: 'XL',  pantLength: 91, waistFlat: 38,   hipFlat: 47,   midCalf: 17.0, ankleOpen: 10.0, wbHeight: 11.5 },
];

export const SIZE_ORDER: Size[] = ['CM', 'CL', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'];

interface HeightRange {
  size: Size;
  minHeight: number;
  maxHeight: number;
}

const HEIGHT_RANGES: HeightRange[] = [
  { size: 'CM',  minHeight: 0,   maxHeight: 139.9 },
  { size: 'CL',  minHeight: 140, maxHeight: 147.9 },
  { size: '3XS', minHeight: 148, maxHeight: 154.9 },
  { size: '2XS', minHeight: 155, maxHeight: 159.9 },
  { size: 'XS',  minHeight: 160, maxHeight: 164.9 },
  { size: 'S',   minHeight: 165, maxHeight: 171.9 },
  { size: 'M',   minHeight: 172, maxHeight: 177.9 },
  { size: 'L',   minHeight: 178, maxHeight: 182.9 },
  { size: 'XL',  minHeight: 183, maxHeight: Infinity },
];

function getSizeIndex(size: Size): number {
  return SIZE_ORDER.indexOf(size);
}

function sizeFromHeight(heightCm: number): Size {
  for (const range of HEIGHT_RANGES) {
    if (heightCm >= range.minHeight && heightCm <= range.maxHeight) {
      return range.size;
    }
  }
  return 'XL';
}

/**
 * Find the largest size whose flat measurement is <= target.
 * (i.e., round down to smaller size if between sizes)
 */
function sizeFromFlatMeasurement(
  target: number,
  field: 'waistFlat' | 'hipFlat'
): Size {
  // Walk from largest to smallest, find first that fits (flatMeasurement <= target)
  for (let i = SIZE_CHART.length - 1; i >= 0; i--) {
    if (SIZE_CHART[i][field] <= target) {
      return SIZE_CHART[i].size;
    }
  }
  // If nothing fits, return smallest
  return 'CM';
}

export interface SizingResult {
  recommendedSize: Size;
  drivingFactor: string;
  heightSize: Size;
  waistSize: Size;
  hipSize: Size;
}

export function calculateSize(
  heightCm: number,
  waistCm: number,
  hipCm: number
): SizingResult {
  const heightSize = sizeFromHeight(heightCm);

  const targetFlatWaist = waistCm * 0.40;
  const waistSize = sizeFromFlatMeasurement(targetFlatWaist, 'waistFlat');

  const targetFlatHip = hipCm * 0.425;
  const hipSize = sizeFromFlatMeasurement(targetFlatHip, 'hipFlat');

  const heightIdx = getSizeIndex(heightSize);
  const waistIdx = getSizeIndex(waistSize);
  const hipIdx = getSizeIndex(hipSize);

  const maxIdx = Math.max(heightIdx, waistIdx, hipIdx);
  const recommendedSize = SIZE_ORDER[maxIdx];

  // Determine driving factor(s)
  const drivers: string[] = [];
  if (heightIdx === maxIdx) drivers.push('Height');
  if (waistIdx === maxIdx) drivers.push('Waist');
  if (hipIdx === maxIdx) drivers.push('Hip');

  const drivingFactor = drivers.join(' + ');

  return { recommendedSize, drivingFactor, heightSize, waistSize, hipSize };
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}
