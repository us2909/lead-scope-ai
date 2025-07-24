import { useState, useCallback, useMemo } from 'react';
import { AssessmentData } from '../types';

interface UsePainCardSelectionReturn {
  selectedCardTitles: Set<string>;
  activatedTiles: string[];
  handleCardClick: (cardTitle: string) => void;
  initializeSelection: (assessment: AssessmentData) => void;
}

export const usePainCardSelection = (): UsePainCardSelectionReturn => {
  const [selectedCardTitles, setSelectedCardTitles] = useState<Set<string>>(new Set());
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);

  const handleCardClick = useCallback((cardTitle: string) => {
    setSelectedCardTitles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(cardTitle)) {
        newSelection.delete(cardTitle);
      } else {
        newSelection.add(cardTitle);
      }
      return newSelection;
    });
  }, []);

  const initializeSelection = useCallback((assessmentData: AssessmentData) => {
    setAssessment(assessmentData);
    setSelectedCardTitles(new Set(assessmentData.pain_cards.map(card => card.title)));
  }, []);

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

  return {
    selectedCardTitles,
    activatedTiles,
    handleCardClick,
    initializeSelection,
  };
};