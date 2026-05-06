import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { Download } from 'lucide-react';

interface SurveyRecord {
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

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B1B1B]">Survey Responses</h1>
            <p className="text-[#6D7B87] text-sm mt-1">{responses.length} response{responses.length !== 1 ? 's' : ''} recorded</p>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-12 text-center">
            <p className="text-[#6D7B87]">No responses yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E4E9ED] bg-[#F5F7F8]">
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium whitespace-nowrap">Date</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Height</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Waist</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Hip</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Rec Size</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Tried</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Waistband</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Hip/Seat</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Length</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Verdict</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Compression</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Turnout</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, i) => (
                    <tr key={r.id} className={`border-b border-[#E4E9ED] ${i % 2 === 1 ? 'bg-[#F5F7F8]' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-[#6D7B87]">
                        {new Date(r.submittedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">{r.name || '-'}</td>
                      <td className="px-4 py-3">{r.heightCm.toFixed(1)}</td>
                      <td className="px-4 py-3">{r.waistCm.toFixed(1)}</td>
                      <td className="px-4 py-3">{r.hipCm.toFixed(1)}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#B4406A] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {r.recommendedSize}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.sizeTried}</td>
                      <td className="px-4 py-3">{r.waistbandFit}</td>
                      <td className="px-4 py-3">{r.hipSeatFit}</td>
                      <td className="px-4 py-3">{r.length}</td>
                      <td className="px-4 py-3">{r.overallVerdict}</td>
                      <td className="px-4 py-3">{r.compressionFeel}</td>
                      <td className="px-4 py-3">{r.turnoutSupport}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.problemAreas.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
