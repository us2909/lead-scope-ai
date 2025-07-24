'use client';

import React, { useState, useEffect } from 'react';
import PainCard from '../components/PainCard';
import QuestionCard from '../components/QuestionCard';
import FinalDashboard from '../components/FinalDashboard';
import { useAssessment } from '../hooks/useAssessment';
import { usePainCardSelection } from '../hooks/usePainCardSelection';
import { UserAnswers } from '../types';

const HomePage: React.FC = () => {
  const [wizardStep, setWizardStep] = useState(0); // 0: input, 1: cards p1, 2: cards p2, 3: questions, 4: dashboard
  const [ticker, setTicker] = useState('');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    geoScope: 'US-based only',
    isSap: 'Yes',
    isOnPrem: 'Yes',
  });

  const { assessment, isLoading, error, generateAssessment, clearError } = useAssessment();
  const { selectedCardTitles, activatedTiles, handleCardClick, initializeSelection } = usePainCardSelection();

  // Initialize pain card selection when assessment is loaded
  useEffect(() => {
    if (assessment) {
      initializeSelection(assessment);
      setWizardStep(1);
    }
  }, [assessment, initializeSelection]);

  const handleGenerate = async () => {
    clearError();
    setWizardStep(0); // Show loading spinner on the input screen
    await generateAssessment(ticker);
  };

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value.toUpperCase());
    if (error) clearError();
  };

  const handleUserAnswerChange = (key: keyof UserAnswers) => (value: string) => {
    setUserAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Pagination for pain cards
  const painCardsPage1 = assessment?.pain_cards.slice(0, 4) || [];
  const painCardsPage2 = assessment?.pain_cards.slice(4, 8) || [];

  const renderInputStep = () => (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={ticker} 
          onChange={handleTickerChange}
          placeholder="e.g., NFLX, MSFT" 
          className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
          disabled={isLoading}
          aria-label="Company ticker input"
          maxLength={5}
        />
        <button 
          onClick={handleGenerate} 
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors"
          disabled={isLoading || !ticker.trim()}
          aria-label="Generate assessment"
        >
          Generate
        </button>
      </div>
    </div>
  );

  const renderPainCardsStep = (cards: typeof painCardsPage1, stepNumber: number) => (
    <div className="animate-fade-in space-y-8">
      <p className="text-center text-lg text-gray-400">
        Select the relevant pain points ({stepNumber}/2).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <PainCard 
            key={card.title} 
            {...card} 
            isSelected={selectedCardTitles.has(card.title)} 
            onClick={() => handleCardClick(card.title)} 
          />
        ))}
      </div>
      <div className={`${stepNumber === 1 ? 'text-center' : 'flex justify-center gap-4'}`}>
        {stepNumber === 2 && (
          <button 
            onClick={() => setWizardStep(1)} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg"
            aria-label="Go back to previous step"
          >
            ← Back
          </button>
        )}
        <button 
          onClick={() => setWizardStep(stepNumber === 1 ? 2 : 3)} 
          className={`${stepNumber === 1 ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 px-8 rounded-md transition-colors text-lg`}
          aria-label={stepNumber === 1 ? "Go to next page" : "Proceed to questions"}
        >
          {stepNumber === 1 ? 'Next →' : 'Next Step'}
        </button>
      </div>
    </div>
  );

  const renderQuestionsStep = () => (
    <div className="animate-fade-in space-y-8 max-w-lg mx-auto">
      <QuestionCard 
        question="Geographical Scope" 
        options={['US-based only', 'Less than 5 countries', 'More than 5 countries']} 
        selectedOption={userAnswers.geoScope} 
        onSelect={handleUserAnswerChange('geoScope')} 
      />
      <QuestionCard 
        question="Is your current ERP SAP?" 
        options={['Yes', 'No']} 
        selectedOption={userAnswers.isSap} 
        onSelect={handleUserAnswerChange('isSap')} 
      />
      <QuestionCard 
        question="Is your infrastructure currently On-prem?" 
        options={['Yes', 'No']} 
        selectedOption={userAnswers.isOnPrem} 
        onSelect={handleUserAnswerChange('isOnPrem')} 
      />
      <div className="flex justify-center gap-4 pt-4">
        <button 
          onClick={() => setWizardStep(2)} 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg"
          aria-label="Go back to pain card selection"
        >
          ← Back
        </button>
        <button 
          onClick={() => setWizardStep(4)} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg"
          aria-label="Generate final dashboard"
        >
          Generate Dashboard
        </button>
      </div>
    </div>
  );

  const renderDashboardStep = () => assessment && (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <button 
          onClick={() => setWizardStep(3)} 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors mb-8"
          aria-label="Edit selections"
        >
          ← Edit Selections
        </button>
      </div>
      <FinalDashboard 
        assessment={assessment} 
        userAnswers={userAnswers} 
        activatedTiles={activatedTiles} 
      />
    </div>
  );

  const getHeaderText = () => {
    switch (wizardStep) {
      case 0:
        return "Enter a company ticker to generate CFO-level pain points.";
      case 1:
      case 2:
        return "Enter a company ticker to generate CFO-level pain points.";
      case 3:
        return "Just a few more questions to tailor your results.";
      case 4:
        return "Based on your selections, here is the proposed initial transformation scope.";
      default:
        return "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-900 text-white font-sans">
      <div className="text-center mb-12 w-full">
        <h1 className="text-5xl font-bold text-gray-100">Lead-Scope AI</h1>
        <p className="text-gray-400 mt-2">{getHeaderText()}</p>
      </div>

      <div className="w-full max-w-7xl">
        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-400">Analyzing... Please wait.</p>
          </div>
        )}
        
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-500 font-semibold">Error: {error}</p>
            <button 
              onClick={clearError}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <>
            {wizardStep === 0 && renderInputStep()}
            {wizardStep === 1 && renderPainCardsStep(painCardsPage1, 1)}
            {wizardStep === 2 && renderPainCardsStep(painCardsPage2, 2)}
            {wizardStep === 3 && renderQuestionsStep()}
            {wizardStep === 4 && renderDashboardStep()}
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;