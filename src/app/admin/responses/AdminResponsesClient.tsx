'use client';

import { useState } from 'react';
import { SurveyRecord } from './page';

interface Props {
  responses: SurveyRecord[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Badge({ value, color }: { value: string; color?: string }) {
  const bg = color ?? '#B4406A';
  return (
    <span
      style={{ backgroundColor: bg }}
      className="text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
    >
      {value}
    </span>
  );
}

function verdictColor(v: string): string {
  if (!v) return '#6D7B87';
  const lower = v.toLowerCase();
  if (lower.includes('perfect') || lower.includes('great')) return '#2E7D32';
  if (lower.includes('too small') || lower.includes('too large') || lower.includes('wrong')) return '#C62828';
  return '#B4406A';
}

function DetailModal({ record, onClose }: { record: SurveyRecord; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#B4406A] px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0">
            <div>
              <h2 className="text-white font-bold text-lg">
                {record.name || 'Anonymous'}
              </h2>
              <p className="text-white/70 text-xs mt-0.5">{formatDate(record.submittedAt)}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-white hover:text-white/70 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Sample Round */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-2">Sample Round</h3>
              <RoundBadge sampleRound={record.sampleRound} />
              <span className="ml-2 text-sm text-[#1B1B1B]">
                {record.sampleRound === 'round-2' ? 'Round 2 — New Kids Samples' : 'Round 1'}
              </span>
            </section>

            {/* Sizes */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-3">Sizes</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#E4E9ED] rounded-lg p-3">
                  <p className="text-xs text-[#6D7B87] mb-1">Recommended</p>
                  <Badge value={record.recommendedSize} />
                </div>
                <div className="border border-[#E4E9ED] rounded-lg p-3">
                  <p className="text-xs text-[#6D7B87] mb-1">Tried</p>
                  <span className="text-sm font-bold text-[#1B1B1B]">{record.sizeTried}</span>
                </div>
              </div>
            </section>

            {/* Measurements */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-3">Measurements</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Height', value: `${record.heightCm.toFixed(1)} cm` },
                  { label: 'Waist', value: `${record.waistCm.toFixed(1)} cm` },
                  { label: 'Hip', value: `${record.hipCm.toFixed(1)} cm` },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-[#E4E9ED] rounded-lg p-3">
                    <p className="text-xs text-[#6D7B87] mb-1">{label}</p>
                    <p className="text-sm font-semibold text-[#1B1B1B]">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Fit scores */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-3">Fit Assessment</h3>
              <div className="space-y-2">
                {[
                  { label: 'Overall Verdict', value: record.overallVerdict },
                  { label: 'Driving Factor', value: record.drivingFactor },
                  { label: 'Waistband Fit', value: record.waistbandFit },
                  { label: 'Hip / Seat Fit', value: record.hipSeatFit },
                  { label: 'Length', value: record.length },
                  { label: 'Compression', value: record.compressionFeel },
                  { label: 'Turnout Support', value: record.turnoutSupport },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between border-b border-[#E4E9ED] pb-2 last:border-0">
                    <span className="text-sm text-[#6D7B87]">{label}</span>
                    <span className="text-sm font-medium text-[#1B1B1B] text-right ml-4">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Problem areas */}
            {record.problemAreas?.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-2">Problem Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {record.problemAreas.map(area => (
                    <span key={area} className="bg-[#F5F7F8] border border-[#E4E9ED] text-[#1B1B1B] text-xs px-3 py-1.5 rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Comments */}
            {(record.fitComments || record.turnoutComments) && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-2">Comments</h3>
                {record.fitComments && (
                  <div className="mb-3">
                    <p className="text-xs text-[#6D7B87] mb-1">Fit comments</p>
                    <p className="text-sm text-[#1B1B1B] bg-[#F5F7F8] rounded-lg px-4 py-3">{record.fitComments}</p>
                  </div>
                )}
                {record.turnoutComments && (
                  <div>
                    <p className="text-xs text-[#6D7B87] mb-1">Turnout comments</p>
                    <p className="text-sm text-[#1B1B1B] bg-[#F5F7F8] rounded-lg px-4 py-3">{record.turnoutComments}</p>
                  </div>
                )}
              </section>
            )}

            {/* Email */}
            {record.followUpEmail && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6D7B87] mb-2">Email</h3>
                <a
                  href={`mailto:${record.followUpEmail}`}
                  className="text-sm text-[#B4406A] hover:underline"
                >
                  {record.followUpEmail}
                </a>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function RoundBadge({ sampleRound }: { sampleRound?: string }) {
  const isR2 = sampleRound === 'round-2';
  return (
    <span
      className="text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: isR2 ? '#B4406A' : '#6D7B87' }}
    >
      {isR2 ? 'R2' : 'R1'}
    </span>
  );
}

export default function AdminResponsesClient({ responses }: Props) {
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);
  const [roundFilter, setRoundFilter] = useState<'all' | 'round-1' | 'round-2'>('all');

  const filteredResponses = responses.filter(r => {
    if (roundFilter === 'all') return true;
    const effectiveRound = r.sampleRound ?? 'round-1';
    return effectiveRound === roundFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1B1B1B]">Survey Responses</h1>
            <p className="text-[#6D7B87] text-sm mt-1">
              {filteredResponses.length} response{filteredResponses.length !== 1 ? 's' : ''} recorded &mdash; newest first
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Round filter */}
            <select
              value={roundFilter}
              onChange={e => setRoundFilter(e.target.value as 'all' | 'round-1' | 'round-2')}
              className="text-sm border border-[#E4E9ED] rounded-full px-4 py-2 bg-white text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#B4406A]"
            >
              <option value="all">All Rounds</option>
              <option value="round-1">Round 1</option>
              <option value="round-2">Round 2</option>
            </select>
            <a
              href="/api/admin/export"
              download
              className="flex items-center gap-2 bg-[#B4406A] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#9d3459] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export JSONL
            </a>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-12 text-center">
            <p className="text-[#6D7B87]">No responses yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] overflow-hidden min-w-[900px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E4E9ED] bg-[#F5F7F8]">
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium whitespace-nowrap">Submitted At</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Round</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Size Tried</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Rec Size</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Driving Factor</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Overall Verdict</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Waistband</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Hip Fit</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Length</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Compression</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Problem Areas</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Turnout</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Comments</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-[#6D7B87] font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-b border-[#E4E9ED] hover:bg-pink-50 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-[#F5F7F8]' : ''}`}
                      onClick={() => setSelectedRecord(r)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-[#6D7B87] text-xs">
                        {formatDate(r.submittedAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1B1B1B]">{r.name || <span className="text-[#6D7B87]">—</span>}</td>
                      <td className="px-4 py-3">
                        <RoundBadge sampleRound={r.sampleRound} />
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1B1B1B]">{r.sizeTried}</td>
                      <td className="px-4 py-3">
                        <Badge value={r.recommendedSize} />
                      </td>
                      <td className="px-4 py-3 text-[#1B1B1B] whitespace-nowrap text-xs">{r.drivingFactor || '—'}</td>
                      <td className="px-4 py-3">
                        {r.overallVerdict ? (
                          <Badge value={r.overallVerdict} color={verdictColor(r.overallVerdict)} />
                        ) : <span className="text-[#6D7B87]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B]">{r.waistbandFit || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B]">{r.hipSeatFit || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B]">{r.length || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B]">{r.compressionFeel || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B] max-w-[140px] truncate">
                        {r.problemAreas?.length ? r.problemAreas.join(', ') : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#1B1B1B]">{r.turnoutSupport || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#6D7B87] max-w-[140px] truncate">
                        {r.fitComments || r.turnoutComments || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6D7B87]">
                        {r.followUpEmail ? (
                          <a
                            href={`mailto:${r.followUpEmail}`}
                            className="text-[#B4406A] hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            {r.followUpEmail}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="text-[#B4406A] text-xs font-semibold hover:underline whitespace-nowrap"
                          onClick={e => { e.stopPropagation(); setSelectedRecord(r); }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedRecord && (
        <DetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}
