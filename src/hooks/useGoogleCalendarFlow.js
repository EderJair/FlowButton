// src/hooks/useGoogleCalendarFlow.js

import { useState, useCallback } from 'react';
import { googleCalendarService } from '@/services/googleCalendarService.js';

export const useGoogleCalendarFlow = () => {
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

  // Crear cita con IA
  const createAppointment = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('📅 Enviando solicitud de cita al backend:', formData);
      
      const response = await googleCalendarService.createAppointment(formData);
      
      setAppointmentData(response);
      setSuccess(true);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener vista previa de la cita (sin crear)
  const previewAppointment = useCallback(async (mensaje) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await googleCalendarService.previewAppointment(mensaje);
      setAppointmentData(response);
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
      const response = await googleCalendarService.checkN8nStatus();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener citas del día (opcional para futuras funcionalidades)
  const getTodayAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await googleCalendarService.getTodayAppointments();
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
    appointmentData,
    
    // Funciones principales
    createAppointment,
    previewAppointment,
    checkConnection,
    getTodayAppointments,
    clearStates,
  };
};
