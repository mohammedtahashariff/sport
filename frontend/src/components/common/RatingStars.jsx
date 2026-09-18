'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 4.5, count = null, size = "w-4 h-4", showNumber = true }) {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700">
          {rounded}
          {count !== null && <span className="text-slate-400 font-normal"> ({count})</span>}
        </span>
      )}
    </div>
  );
}
