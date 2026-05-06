'use server';

import { appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface SurveyResponse {
  name: string;
  heightCm: number;
  waistCm: number;
  hipCm: number;
  unitPreference: 'cm' | 'in';
  recommendedSize: string;
  drivingFactor: string;
  sizeTried: string;
  waistbandFit: string;
  hipSeatFit: string;
  length: string;
  overallVerdict: string;
  compressionFeel: string;
  problemAreas: string[];
  fitComments: string;
  turnoutSupport: string;
  turnoutComments: string;
  followUpEmail: string;
}

export async function submitSurvey(data: SurveyResponse): Promise<{ success: boolean; error?: string }> {
  try {
    const dataDir = '/data';

    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const record = {
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
      ...data,
    };

    const filePath = path.join(dataDir, 'responses.jsonl');
    await appendFile(filePath, JSON.stringify(record) + '\n', 'utf8');

    return { success: true };
  } catch (err) {
    console.error('Failed to save survey response:', err);
    return { success: false, error: 'Failed to save response' };
  }
}
