// src/hooks/useGmailFlow.js

import { useState, useCallback } from 'react';
import { gmailService } from '../services/gmailService.js';

export const useGmailFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailData, setEmailData] = useState(null);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setEmailData(null);
  }, []);

  // Generar y enviar email
  const generateAndSendEmail = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Enviando datos al backend:', formData);
      
      const response = await gmailService.generateAndSendEmail(formData);
      
      setEmailData(response);
      setSuccess(true);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Solo generar email (para preview)
  const generateEmailPreview = useCallback(async (prompt) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await gmailService.generateEmail(prompt);
      setEmailData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);  // Verificar conexión N8N
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await gmailService.checkN8nStatus();
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
    emailData,
    
    // Funciones
    generateAndSendEmail,
    generateEmailPreview,
    checkConnection,
    clearStates,
  };
};
