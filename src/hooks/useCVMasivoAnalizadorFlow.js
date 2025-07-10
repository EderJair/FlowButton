// src/hooks/useCVAnalysisFlow.js

import { useState, useCallback } from 'react';
import { cvAnalizadorMasivoService } from '../services/cvAnalizadorMasivoService';

export const useCVMasivoAnalizadorFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clearStates = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  const analyzeCVs = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cvAnalizadorMasivoService.analyzeCVs(data);
      setResult(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    result,
    analyzeCVs,
    clearStates
  };
};
