import React from 'react';
import { DonationStatus } from '../types/api/types';

const statusSteps: DonationStatus[] = ['Pending','Matched','Dispatched','Received','Completed'];

function getProgress(status: DonationStatus): { percent: number; label: string; color: string } {
  const index = statusSteps.indexOf(status as any);
  const clampedIndex = index >= 0 ? index : 0;
  const percent = Math.round((clampedIndex / (statusSteps.length - 1)) * 100);
  const color = status === 'Completed' ? 'bg-green-600' : status === 'Pending' ? 'bg-gray-400' : 'bg-blue-600';
  return { percent, label: status, color };
}

export default function DonationProgress({ status }: { status: DonationStatus }) {
  const { percent, label, color } = getProgress(status);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{label} ({percent}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-2">
        <div className={`${color} h-2 rounded`} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {statusSteps.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}
