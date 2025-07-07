// src/hooks/useGeneradorPropuestaFlow.js

import { useState, useCallback } from 'react';
import { generadorPropuestasService } from '@/services/generadorPropuestasService.js';

export const useGeneradorPropuestaFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [propuestaData, setPropuestaData] = useState(null);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setPropuestaData(null);
  }, []);

  // Crear propuesta comercial
  const createPropuesta = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('📄 Enviando solicitud de propuesta al backend:', formData);
      
      const response = await generadorPropuestasService.createPropuesta(formData);
      
      setPropuestaData(response);
      setSuccess(true);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener vista previa de la propuesta (sin crear)
  const previewPropuesta = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generadorPropuestasService.previewPropuesta(formData);
      setPropuestaData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar conexión con N8N
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generadorPropuestasService.checkN8nStatus();
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
    propuestaData,
    
    // Funciones principales
    createPropuesta,
    previewPropuesta,
    checkConnection,
    clearStates,
  };
};
