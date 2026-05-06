'use client';

import { CheckCircle } from 'lucide-react';

export default function Confirmation() {
  return (
    <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-[16px] shadow-sm border border-[#E4E9ED] p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-[#B4406A]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#1B1B1B] mb-3">Thank you!</h2>
          <p className="text-[#6D7B87] text-sm leading-relaxed">
            Your response has been recorded. Your fitting notes will help us finalise the Backalast Turnout Tights size range.
          </p>
        </div>
      </div>
    </div>
  );
}
