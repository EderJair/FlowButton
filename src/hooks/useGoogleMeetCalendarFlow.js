// src/hooks/useGoogleMeetCalendarFlow.js

import { useState, useCallback } from 'react';
import { googleMeetCalendarService } from '@/services/googleMeetCalendarService.js';

export const useGoogleMeetCalendarFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setAppointmentData(null);
  }, []);

  // Crear cita - Llamado directo a N8N
  const createMeetAppointment = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('📅 Enviando solicitud de Google Meet a N8N:', formData);
      
      // Llamado directo al webhook N8N
      const response = await googleMeetCalendarService.createMeetAppointment(formData);
      
      setAppointmentData(response);
      setSuccess(true);
      
      return response;
    } catch (err) {
      console.error('❌ Error en el flow:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar conexión con N8N webhook
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConnected = await googleMeetCalendarService.checkWebhookStatus();
      return { connected: isConnected };
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
    appointmentData,
    
    // Funciones principales
    createMeetAppointment,
    checkConnection,
    clearStates,
  };
};