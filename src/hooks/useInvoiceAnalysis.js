// src/hooks/useInvoiceAnalysis.js

import { useState, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';

export const useInvoiceAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progress, setProgress] = useState({
    step: '', // 'upload', 'ocr', 'backend'
    progress: 0,
    message: ''
  });

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setAnalysisResult(null);
    setProgress({ step: '', progress: 0, message: '' });
  }, []);

  // Callback para actualizar progreso
  const updateProgress = useCallback((progressData) => {
    const messages = {
      upload: 'Subiendo imagen a la nube...',
      ocr: 'Extrayendo texto de la imagen...',
      backend: 'Procesando con IA...'
    };
    
    setProgress({
      step: progressData.step,
      progress: progressData.progress,
      message: messages[progressData.step] || 'Procesando...'
    });
  }, []);

  // Analizar factura con flujo completo (Cloudinary + OCR + Backend)
  const analyzeInvoice = useCallback(async (invoiceData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setProgress({ step: '', progress: 0, message: 'Iniciando análisis...' });
    
    try {
      console.log('🚀 Iniciando análisis completo de factura:', invoiceData.file.name);
      
      const response = await invoiceService.analyzeInvoice(invoiceData, updateProgress);
      
      setAnalysisResult(response);
      setSuccess(true);
      setProgress({ step: 'complete', progress: 100, message: '¡Análisis completado!' });
      
      console.log('✅ Análisis completado exitosamente');
      return response;
    } catch (err) {
      console.error('❌ Error en análisis:', err);
      setError(err.message);
      setProgress({ step: 'error', progress: 0, message: 'Error en el análisis' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateProgress]);

  // Analizar factura solo con OCR local (sin backend)
  const analyzeInvoiceLocal = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setProgress({ step: 'ocr', progress: 0, message: 'Extrayendo texto...' });
    
    try {
      console.log('🚀 Iniciando análisis local de factura:', file.name);
      
      const response = await invoiceService.analyzeInvoiceLocal(
        file,
        (progressValue) => {
          setProgress({
            step: 'ocr',
            progress: progressValue,
            message: `Extrayendo texto... ${progressValue}%`
          });
        }
      );
      
      setAnalysisResult(response);
      setSuccess(true);
      setProgress({ step: 'complete', progress: 100, message: '¡Texto extraído!' });
      
      console.log('✅ Análisis local completado');
      return response;
    } catch (err) {
      console.error('❌ Error en análisis local:', err);
      setError(err.message);
      setProgress({ step: 'error', progress: 0, message: 'Error en extracción' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener historial de facturas
  const getHistory = useCallback(async (limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await invoiceService.getInvoiceHistory(limit, offset);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar estado del servicio
  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await invoiceService.checkAnalysisStatus();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return {
    // Estados
    isLoading,
    error,
    success,
    analysisResult,
    progress,
    
    // Funciones
    analyzeInvoice,
    analyzeInvoiceLocal,
    getHistory,
    checkStatus,
    clearStates,
  };
};

export default useInvoiceAnalysis;
