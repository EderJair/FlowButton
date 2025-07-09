// src/hooks/useCvAnalizadorFlow.js

import { useState, useCallback } from 'react';
import cvAnalizadorService from '@/services/cvAnalizadorService.js';

export const useCvAnalizadorFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setAnalysisData(null);
    setFormattedData(null);
  }, []);

  // Función principal para analizar CV
  const analyzeCVFile = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validar archivo antes de enviar
      const validation = cvAnalizadorService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      console.log('📄 Enviando CV para análisis:', file.name);
      
      // Enviar archivo a N8N
      const response = await cvAnalizadorService.analyzeCV(file);
      
      // Formatear respuesta para la UI
      const formatted = cvAnalizadorService.formatAnalysisResponse(response);
      
      setAnalysisData(response);
      setFormattedData(formatted);
      setSuccess(true);
      
      console.log('✅ Análisis completado exitosamente');
      console.log('📊 Datos formateados:', formatted);
      
      return {
        raw: response,
        formatted: formatted
      };
      
    } catch (err) {
      console.error('❌ Error en análisis de CV:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener información del archivo sin procesarlo
  const getFileInfo = useCallback((file) => {
    try {
      return cvAnalizadorService.getFileInfo(file);
    } catch (err) {
      console.error('Error al obtener info del archivo:', err);
      return null;
    }
  }, []);

  // Validar archivo sin procesarlo
  const validateFile = useCallback((file) => {
    try {
      return cvAnalizadorService.validateFile(file);
    } catch (err) {
      console.error('Error al validar archivo:', err);
      return { isValid: false, errors: [err.message] };
    }
  }, []);

  // Verificar conexión con N8N
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cvAnalizadorService.checkN8nStatus();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener resumen rápido del análisis
  const getAnalysisSummary = useCallback(() => {
    if (!formattedData) return null;
    
    return {
      score: formattedData.score,
      recommendation: formattedData.recommendation,
      level: formattedData.level,
      area: formattedData.area,
      nextSteps: formattedData.nextSteps,
      hasRedFlags: formattedData.redFlags.length > 0,
      strengthsCount: formattedData.strengths.length,
      testsCount: formattedData.tests.length
    };
  }, [formattedData]);

  // Obtener recomendaciones de pruebas técnicas
  const getTestRecommendations = useCallback(() => {
    if (!analysisData) return [];
    
    const critical = analysisData.recomendaciones_pruebas?.validaciones_criticas || [];
    const complementary = analysisData.recomendaciones_pruebas?.validaciones_complementarias || [];
    const optional = analysisData.recomendaciones_pruebas?.opcional_si_avanza || [];
    
    return {
      critical,
      complementary,
      optional,
      total: critical.length + complementary.length + optional.length
    };
  }, [analysisData]);

  // Obtener información salarial
  const getSalaryInfo = useCallback(() => {
    if (!analysisData) return null;
    
    const salary = analysisData.estimacion_salarial || {};
    
    return {
      range: salary.rango_estimado || {},
      factors: salary.factores_salario || [],
      negotiability: salary.negociabilidad || 'No definido',
      benchmark: salary.benchmark_nivel || {},
      context: salary.contexto_mercado || ''
    };
  }, [analysisData]);

  // Obtener alertas para el reclutador
  const getRecruiterAlerts = useCallback(() => {
    if (!analysisData) return null;
    
    const alerts = analysisData.alertas_reclutador || {};
    
    return {
      redFlags: alerts.red_flags || [],
      pointsToClarity: alerts.puntos_aclarar || [],
      verificationsNeeded: alerts.verificaciones_sugeridas || [],
      hasAlerts: (alerts.red_flags || []).length > 0
    };
  }, [analysisData]);

  // Obtener mensaje del asistente IA
  const getAIMessage = useCallback(() => {
    if (!analysisData) return null;
    
    const aiData = analysisData.ia_assistant_summary || {};
    
    return {
      message: aiData.mensaje_reclutador || '',
      immediateAction: aiData.accion_inmediata || '',
      interviewPrep: aiData.preparacion_entrevista || '',
      questions: aiData.questions_to_ask || []
    };
  }, [analysisData]);

  return {
    // Estados principales
    isLoading,
    error,
    success,
    analysisData,
    formattedData,
    
    // Funciones principales
    analyzeCVFile,
    getFileInfo,
    validateFile,
    checkConnection,
    clearStates,
    
    // Funciones de utilidad para obtener datos específicos
    getAnalysisSummary,
    getTestRecommendations,
    getSalaryInfo,
    getRecruiterAlerts,
    getAIMessage
  };
};

export default useCvAnalizadorFlow;