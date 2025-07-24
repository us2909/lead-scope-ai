import React, { memo } from 'react';
import { PainCardProps } from '../types';

const PainCard: React.FC<PainCardProps> = memo(({ title, blurb, isSelected, onClick }) => {
  const baseClasses = "border-2 rounded-lg p-6 shadow-lg cursor-pointer transition-all duration-200 ease-in-out h-full flex flex-col";
  const selectedClasses = "bg-blue-600 border-blue-400";
  const deselectedClasses = "bg-gray-800 border-gray-700 hover:border-gray-500";
  const titleClasses = `font-bold text-xl mb-2 ${isSelected ? 'text-white' : 'text-blue-400'}`;
  const blurbClasses = `flex-grow ${isSelected ? 'text-gray-100' : 'text-gray-300'}`;

  return (
    <div 
      onClick={onClick} 
      className={`${baseClasses} ${isSelected ? selectedClasses : deselectedClasses}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Pain card: ${title}. ${isSelected ? 'Selected' : 'Not selected'}`}
    >
      <h3 className={titleClasses}>{title}</h3>
      <p className={blurbClasses}>{blurb}</p>
    </div>
  );
});

PainCard.displayName = 'PainCard';

export default PainCard;