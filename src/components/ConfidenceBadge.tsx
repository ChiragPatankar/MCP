import React from 'react';

interface ConfidenceBadgeProps {
  confidence?: number;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence, className = '' }) => {
  if (confidence === undefined || confidence === null || Number.isNaN(confidence)) {
    return null;
  }

  let label = 'Low confidence';
  let colorClasses = 'bg-red-50 text-red-700 border-red-200';

  if (confidence >= 0.50) {
    label = 'Very High confidence';
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (confidence >= 0.40) {
    label = 'High confidence';
    colorClasses = 'bg-green-50 text-green-700 border-green-200';
  } else if (confidence >= 0.30) {
    label = 'Medium confidence';
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};

export default ConfidenceBadge;


