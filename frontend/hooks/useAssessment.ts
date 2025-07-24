import { useState, useCallback } from 'react';
import { AssessmentData } from '../types';

interface UseAssessmentReturn {
  assessment: AssessmentData | null;
  isLoading: boolean;
  error: string | null;
  generateAssessment: (ticker: string) => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const useAssessment = (): UseAssessmentReturn => {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAssessment = useCallback(async (ticker: string) => {
    if (!ticker.trim()) {
      setError("Please enter a company ticker.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/${ticker}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unknown error occurred');
      }

      const data: AssessmentData = await response.json();
      setAssessment({ ...data, company_name: ticker.toUpperCase() });
    } catch (err: any) {
      console.error('Assessment generation failed:', err);
      setError(err.message || 'Failed to generate assessment');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    assessment,
    isLoading,
    error,
    generateAssessment,
    clearError,
  };
};