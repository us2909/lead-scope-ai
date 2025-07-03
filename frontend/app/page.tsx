// frontend/src/app/page.tsx

'use client'; // This directive is necessary for interactive components

import { useState } from 'react';

// A TypeScript interface to define the shape of our PainCard data
interface PainCardData {
  title: string;
  blurb: string;
}

// The Pain Card component
function PainCard({ title, blurb }: PainCardData) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform hover:scale-105">
      <h3 className="font-bold text-xl text-blue-400 mb-2">{title}</h3>
      <p className="text-gray-300">{blurb}</p>
    </div>
  );
}

// The main Page component
export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const [painCards, setPainCards] = useState<PainCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!ticker) {
      setError("Please enter a company ticker.");
      return;
    }
    setIsLoading(true);
    setPainCards([]);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/assessment/${ticker}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unknown error occurred');
      }

      const data = await response.json();
      setPainCards(data.pain_cards);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-900 text-white font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-100">Lead-Scope AI</h1>
        <p className="text-gray-400 mt-2">Enter a company ticker to generate CFO-level pain points.</p>
      </div>

      <div className="w-full max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g., NFLX, MSFT"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="mt-12 w-full max-w-5xl">
        {isLoading && <p className="text-center text-gray-400">Analyzing... Please wait.</p>}
        {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}

        {painCards.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {painCards.map((card, index) => (
              <PainCard key={index} title={card.title} blurb={card.blurb} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}