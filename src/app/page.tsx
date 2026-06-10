import SurveyClient from '@/components/SurveyClient';
import { SampleRound } from '@/lib/sizing';

export default function Home({ searchParams }: { searchParams: Promise<{ round?: string }> }) {
  // Next.js 15: searchParams is a Promise
  return <SurveyClientWrapper searchParamsPromise={searchParams} />;
}

async function SurveyClientWrapper({ searchParamsPromise }: { searchParamsPromise: Promise<{ round?: string }> }) {
  const params = await searchParamsPromise;
  const round: SampleRound = params.round === 'round-2' ? 'round-2' : 'round-1';
  return <SurveyClient sampleRound={round} />;
}
