import React from 'react';

export default function CircularProgress({ progress = 0 }) {
  const radius = 21;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-[35px] h-[34px] relative">
      <svg height="100%" width="100%">
        <circle
          stroke="#e5e7eb" // Tailwind gray-200
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
        <circle
          stroke="#3b82f6" // Tailwind blue-500
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
        //   cx="64%"
        //   cy="39%"
          cx="317%"
          cy="51%"
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-semibold">
        {progress}%
      </div>
    </div>
  );
}
