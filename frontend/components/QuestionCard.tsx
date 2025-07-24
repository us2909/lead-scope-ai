import React from 'react';
import { QuestionCardProps } from '../types';

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, selectedOption, onSelect }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg w-full max-w-md mx-auto">
      <p className="text-lg font-semibold mb-3 text-gray-200">{question}</p>
      <div className="flex flex-wrap gap-4">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`py-2 px-4 rounded-md transition-colors text-base font-semibold ${
              selectedOption === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            aria-pressed={selectedOption === option}
            aria-label={`Option: ${option}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;