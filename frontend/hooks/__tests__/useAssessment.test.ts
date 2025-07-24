import { renderHook, act } from '@testing-library/react';
import { useAssessment } from '../useAssessment';

// Mock fetch
global.fetch = jest.fn();

const mockAssessmentData = {
  pain_cards: [
    {
      title: 'Test Pain',
      blurb: 'Test description',
      triggered_tiles: ['TEST-TILE'],
      triggering_keywords: ['test'],
    },
  ],
  scope_summary: 'Test scope',
  activated_tiles: ['TEST-TILE'],
  all_tiles: {},
  industry: 'Technology',
  revenue: 1000000,
  classified_industry: 'TMT',
  geo_scope: 'US-based only',
};

describe('useAssessment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAssessment());

    expect(result.current.assessment).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should generate assessment successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAssessmentData,
    });

    const { result } = renderHook(() => useAssessment());

    await act(async () => {
      await result.current.generateAssessment('AAPL');
    });

    expect(result.current.assessment).toEqual({
      ...mockAssessmentData,
      company_name: 'AAPL',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle empty ticker', async () => {
    const { result } = renderHook(() => useAssessment());

    await act(async () => {
      await result.current.generateAssessment('');
    });

    expect(result.current.error).toBe('Please enter a company ticker.');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Company not found' }),
    });

    const { result } = renderHook(() => useAssessment());

    await act(async () => {
      await result.current.generateAssessment('INVALID');
    });

    expect(result.current.error).toBe('Company not found');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.assessment).toBeNull();
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useAssessment());

    // Manually set an error state
    act(() => {
      result.current.generateAssessment('');
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});