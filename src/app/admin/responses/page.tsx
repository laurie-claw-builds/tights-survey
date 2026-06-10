import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import AdminResponsesClient from './AdminResponsesClient';

export const dynamic = 'force-dynamic';

export interface SurveyRecord {
  id: string;
  submittedAt: string;
  name: string;
  heightCm: number;
  waistCm: number;
  hipCm: number;
  unitPreference: string;
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
  sampleRound?: string;
}

async function getResponses(): Promise<SurveyRecord[]> {
  const filePath = '/data/responses.jsonl';
  if (!existsSync(filePath)) return [];

  try {
    const content = await readFile(filePath, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.map(line => JSON.parse(line) as SurveyRecord).reverse();
  } catch {
    return [];
  }
}

export default async function AdminResponsesPage() {
  const responses = await getResponses();
  return <AdminResponsesClient responses={responses} />;
}
