'use client';

import { useState, useMemo } from 'react';
import { scopeCategories } from '../lib/scope-data';

// --- TypeScript Interfaces ---
interface PainCardData {
  title: string;
  blurb: string;
  triggered_tiles: string[];
  triggering_keywords: string[];
}

interface AssessmentData {
  pain_cards: PainCardData[];
  scope_summary: string;
  activated_tiles: string[];
  all_tiles: Record<string, string>;
  industry?: string;
  revenue?: number;
  geographical_scope?: string;
}

// --- React Components ---

function PainCard({ title, blurb, isSelected, onClick }: PainCardData & { isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className={`
        border-2 rounded-lg p-6 shadow-lg cursor-pointer transition-all 
        duration-200 ease-in-out h-full flex flex-col
        ${isSelected 
          ? 'bg-blue-600 border-blue-400' 
          : 'bg-gray-800 border-gray-700 hover:border-gray-500'
        }
      `}
    >
      <h3 
        className={`
          font-bold text-xl mb-2 
          ${isSelected ? 'text-white' : 'text-blue-400'}
        `}
      >
        {title}
      </h3>
      <p 
        className={`
          flex-grow 
          ${isSelected ? 'text-gray-100' : 'text-gray-300'}
        `}
      >
        {blurb}
      </p>
    </div>
  );
}

function ScopeTile({ name, isActive }: { name: string, isActive: boolean }) {
  const baseClasses = "text-center p-4 rounded-md text-sm transition-colors";
  const activeClasses = "bg-blue-600 text-white font-bold shadow-lg";
  const inactiveClasses = "bg-gray-800 text-gray-400";
  return <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>{name}</div>;
}

function ScopeGrid({ activatedTiles }: { activatedTiles: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      {scopeCategories.map(category => (
        <div key={category.name} className="flex flex-col gap-4">
          <h4 className="font-bold text-lg text-gray-400 border-b-2 border-gray-700 pb-2">{category.name}</h4>
          <div className="flex flex-col gap-3">
            {category.tiles.map(tile => <ScopeTile key={tile.id} name={tile.name} isActive={activatedTiles.includes(tile.id)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- The Main Page Component ---
export default function HomePage() {
  const [step, setStep] = useState('input');
  const [ticker, setTicker] = useState('');
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardTitles, setSelectedCardTitles] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!ticker) { setError("Please enter a company ticker."); return; }
    setIsLoading(true);
    setError(null);
    setStep('input'); // Stay on input step while loading

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/assessment/${ticker}`);
      if (!response.ok) {
        const errorData = await response.json(); throw new Error(errorData.detail || 'An unknown error occurred');
      }
      const data: AssessmentData = await response.json();
      setAssessment(data);
      setSelectedCardTitles(new Set(data.pain_cards.map(c => c.title)));
      setStep('cards');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (cardTitle: string) => {
    const newSelection = new Set(selectedCardTitles);
    if (newSelection.has(cardTitle)) {
      newSelection.delete(cardTitle);
    } else {
      newSelection.add(cardTitle);
    }
    setSelectedCardTitles(newSelection);
  };

  const activatedTiles = useMemo(() => {
    if (!assessment) return [];
    const tiles = new Set<string>();
    assessment.pain_cards.forEach(card => {
      if (selectedCardTitles.has(card.title)) {
        card.triggered_tiles.forEach(tile => tiles.add(tile));
      }
    });
    return Array.from(tiles);
  }, [selectedCardTitles, assessment]);
  
  const handleShowDashboard = () => {
    if (selectedCardTitles.size === 0) {
      setError("Please select at least one pain card to generate a scope.");
      return;
    }
    setError(null);
    setStep('dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-900 text-white font-sans">
      {/* Header Section */}
      <div className="text-center mb-12 w-full">
        <h1 className="text-5xl font-bold text-gray-100">Lead-Scope AI</h1>
        {/* Subtitle changes based on the step */}
        {step === 'input' && <p className="text-gray-400 mt-2">Enter a company ticker to generate CFO-level pain points.</p>}
        {step === 'cards' && <p className="text-gray-400 mt-2">Our AI has identified these potential pain points. Please select the most relevant ones.</p>}
        {step === 'dashboard' && <p className="text-gray-400 mt-2">Based on your selections, here is the proposed initial transformation scope.</p>}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl">
        {/* Step 1: Input Form */}
        {step === 'input' && (
          <div className="w-full max-w-md mx-auto animate-fade-in">
            <div className="flex gap-2">
              <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="e.g., NFLX, MSFT" className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white" />
              <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        )}

        {/* Loading and Error Messages */}
        <div className="mt-12">
          {isLoading && <p className="text-center text-gray-400">Analyzing... Please wait.</p>}
          {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}
        </div>

        {/* Step 2: Pain Card Selection */}
        {step === 'cards' && assessment && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessment.pain_cards.map((card, index) => (
                <PainCard key={index} {...card} isSelected={selectedCardTitles.has(card.title)} onClick={() => handleCardClick(card.title)} />
              ))}
            </div>
            <div className="text-center">
              <button onClick={handleShowDashboard} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">
                Generate Scope
              </button>
            </div>
          </div>
        )}

        {/* Step 3: The Final Dashboard Reveal */}
        {step === 'dashboard' && assessment && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center">
              {/* NEW "Go Back" BUTTON */}
              <button onClick={() => setStep('cards')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors mb-8">
                ← Edit Pain Card Selections
              </button>
            </div>
            
            <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-4">
              {/* DYNAMIC COUNT FIX */}
              <p className="font-semibold text-lg text-blue-400">
                Phase 1 Scope includes {activatedTiles.length} key modules based on your selections.
              </p>
            </div>
            <ScopeGrid activatedTiles={activatedTiles} />
          </div>
        )}
      </div>
    </main>
  );
}