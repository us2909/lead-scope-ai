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
  classified_industry?: string;
  geo_scope?: string;
  // We add the company name to the assessment data for display
  company_name?: string; 
}

// --- Reusable UI Components ---

function PainCard({ title, blurb, isSelected, onClick }: PainCardData & { isSelected: boolean, onClick: () => void }) {
  const baseClasses = "border-2 rounded-lg p-6 shadow-lg cursor-pointer transition-all duration-200 ease-in-out h-full flex flex-col";
  const selectedClasses = "bg-blue-600 border-blue-400";
  const deselectedClasses = "bg-gray-800 border-gray-700 hover:border-gray-500";
  const titleClasses = `font-bold text-xl mb-2 ${isSelected ? 'text-white' : 'text-blue-400'}`;
  const blurbClasses = `flex-grow ${isSelected ? 'text-gray-100' : 'text-gray-300'}`;

  return (
    <div onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : deselectedClasses}`}>
      <h3 className={titleClasses}>{title}</h3>
      <p className={blurbClasses}>{blurb}</p>
    </div>
  );
}

function QuestionCard({ question, options, selectedOption, onSelect }: { question: string, options: string[], selectedOption: any, onSelect: (option: any) => void }) {
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
            >
              {option}
            </button>
          ))}
        </div>
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

function InfoField({ label, value }: { label: string, value: string | number | null | undefined }) {
    return (
      <div>
        <label className="text-sm text-gray-400">{label}</label>
        <div className="mt-1 p-2 bg-gray-700 rounded-md border border-gray-600 text-gray-100">
          {value ? value : 'N/A'}
        </div>
      </div>
    );
}

// --- The Final Dashboard View Component ---
function FinalDashboard({ assessment, userAnswers, activatedTiles }) {
    const formatRevenue = (rev: number | null | undefined) => {
        if (!rev) return 'N/A';
        if (rev < 1_000_000_000) return `$${(rev / 1_000_000).toFixed(0)}M`;
        return `$${(rev / 1_000_000_000).toFixed(2)}B`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Left Column: Financial Profile & Considerations */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6 self-start">
            <h3 className="text-xl font-bold text-white">The {assessment.company_name || '...'} Company</h3>
            <InfoField label="Industry" value={assessment.classified_industry} />
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-300">Financial Profile</h4>
              <InfoField label="Revenue" value={formatRevenue(assessment.revenue)} />
              <InfoField label="Geographical Scope" value={userAnswers.geoScope} />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-300">Additional Considerations</h4>
              <InfoField label="Is your current ERP SAP?" value={userAnswers.isSap} />
              <InfoField label="Is your infrastructure currently On-prem?" value={userAnswers.isOnPrem} />
            </div>
          </div>

          {/* Right Column: Business Transformation Scope */}
          <div className="lg:col-span-2 space-y-8">
             <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="font-semibold text-lg text-blue-400">
                    Phase 1 Scope includes {activatedTiles.length} key modules based on your selections.
                </p>
             </div>
            <ScopeGrid activatedTiles={activatedTiles} />
          </div>
        </div>
    );
}


// --- The Main Page Component (The Wizard Controller) ---
export default function HomePage() {
  const [wizardStep, setWizardStep] = useState(0); // 0: input, 1: cards p1, 2: cards p2, 3: questions, 4: dashboard
  const [ticker, setTicker] = useState('');
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardTitles, setSelectedCardTitles] = useState<Set<string>>(new Set());

  // State for the user's survey answers
  const [userAnswers, setUserAnswers] = useState({
    geoScope: 'US-based only',
    isSap: 'Yes',
    isOnPrem: 'Yes',
  });

  const handleGenerate = async () => {
    if (!ticker) { setError("Please enter a company ticker."); return; }
    setIsLoading(true);
    setError(null);
    setWizardStep(0); // Show loading spinner on the input screen

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/assessment/${ticker}`);
      if (!response.ok) {
        const errorData = await response.json(); throw new Error(errorData.detail || 'An unknown error occurred');
      }
      const data: AssessmentData = await response.json();
      setAssessment({...data, company_name: ticker.toUpperCase()});
      setSelectedCardTitles(new Set(data.pain_cards.map(c => c.title)));
      setWizardStep(1); // Move to the first page of pain cards
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (cardTitle: string) => {
    const newSelection = new Set(selectedCardTitles);
    newSelection.has(cardTitle) ? newSelection.delete(cardTitle) : newSelection.add(cardTitle);
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

  // Sliced pain cards for pagination
  const painCardsPage1 = assessment?.pain_cards.slice(0, 4) || [];
  const painCardsPage2 = assessment?.pain_cards.slice(4, 8) || [];

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-900 text-white font-sans">
      <div className="text-center mb-12 w-full">
        <h1 className="text-5xl font-bold text-gray-100">Lead-Scope AI</h1>
        {wizardStep <= 2 && <p className="text-gray-400 mt-2">Enter a company ticker to generate CFO-level pain points.</p>}
        {wizardStep === 3 && <p className="text-gray-400 mt-2">Just a few more questions to tailor your results.</p>}
        {wizardStep === 4 && <p className="text-gray-400 mt-2">Based on your selections, here is the proposed initial transformation scope.</p>}
      </div>

      <div className="w-full max-w-7xl">
        {isLoading && <p className="text-center text-lg text-gray-400 animate-pulse">Analyzing... Please wait.</p>}
        {error && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}

        {!isLoading && (
          <>
            {wizardStep === 0 && (
              <div className="w-full max-w-md mx-auto animate-fade-in">
                <div className="flex gap-2">
                  <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="e.g., NFLX, MSFT" className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white" />
                  <button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors">Generate</button>
                </div>
              </div>
            )}
            
            {wizardStep === 1 && (
              <div className="animate-fade-in space-y-8">
                <p className="text-center text-lg text-gray-400">Select the relevant pain points (1/2).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {painCardsPage1.map((card) => <PainCard key={card.title} {...card} isSelected={selectedCardTitles.has(card.title)} onClick={() => handleCardClick(card.title)} />)}
                </div>
                <div className="text-center">
                  <button onClick={() => setWizardStep(2)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">Next →</button>
                </div>
              </div>
            )}
            
            {wizardStep === 2 && (
              <div className="animate-fade-in space-y-8">
                <p className="text-center text-lg text-gray-400">Select the relevant pain points (2/2).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {painCardsPage2.map((card) => <PainCard key={card.title} {...card} isSelected={selectedCardTitles.has(card.title)} onClick={() => handleCardClick(card.title)} />)}
                </div>
                <div className="flex justify-center gap-4">
                   <button onClick={() => setWizardStep(1)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">← Back</button>
                  <button onClick={() => setWizardStep(3)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">Next Step</button>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
                <div className="animate-fade-in space-y-8 max-w-lg mx-auto">
                    <QuestionCard question="Geographical Scope" options={['US-based only', 'Less than 5 countries', 'More than 5 countries']} selectedOption={userAnswers.geoScope} onSelect={(val) => setUserAnswers(prev => ({...prev, geoScope: val}))} />
                    <QuestionCard question="Is your current ERP SAP?" options={['Yes', 'No']} selectedOption={userAnswers.isSap} onSelect={(val) => setUserAnswers(prev => ({...prev, isSap: val}))} />
                    <QuestionCard question="Is your infrastructure currently On-prem?" options={['Yes', 'No']} selectedOption={userAnswers.isOnPrem} onSelect={(val) => setUserAnswers(prev => ({...prev, isOnPrem: val}))} />
                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={() => setWizardStep(2)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">← Back</button>
                        <button onClick={() => setWizardStep(4)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg">Generate Dashboard</button>
                    </div>
                </div>
            )}

            {wizardStep === 4 && assessment && (
              <div className="animate-fade-in space-y-8">
                <div className="text-center">
                  <button onClick={() => setWizardStep(3)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors mb-8">← Edit Selections</button>
                </div>
                <FinalDashboard assessment={assessment} userAnswers={userAnswers} activatedTiles={activatedTiles} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}