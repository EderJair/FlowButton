// src/services/googleCalendarService.js

import { api } from './api.js';

// Servicio para el flujo Google Calendar + IA - Conecta con N8N
export const googleCalendarService = {
  // Crear cita con IA - Conecta con el webhook de N8N
  createAppointment: async (appointmentData) => {
    try {
      console.log('📅 Creando cita con datos del modal:', appointmentData);
      
      // Transformar los datos del modal para el backend N8N
      const backendData = {
        mensaje: appointmentData.mensaje,
        timestamp: new Date().toISOString(),
        type: 'create_appointment',
        source: 'flowbutton_calendar'
      };
      
      console.log('📤 Datos transformados para N8N:', backendData);
      
      // Endpoint específico para Google Calendar (ajusta según tu configuración N8N)
      const response = await api.post('/google-calendar', backendData);
      
      console.log('✅ Respuesta del backend N8N:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al crear cita:', error);
      throw new Error(`Error en el servicio de Google Calendar: ${error.message}`);
    }
  },

  // Obtener vista previa de la cita (análisis de IA sin crear)
  previewAppointment: async (mensaje) => {
    try {
      console.log('🔍 Obteniendo vista previa de la cita:', mensaje);
      
      const backendData = {
        mensaje,
        timestamp: new Date().toISOString(),
        type: 'preview_appointment',
        source: 'flowbutton_calendar'
      };
      
      const response = await api.post('/google-calendar/preview', backendData);
      
      console.log('✅ Vista previa obtenida:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener vista previa:', error);
      throw new Error(`Error al obtener vista previa: ${error.message}`);
    }
  },

  // Verificar estado de conexión con N8N
  checkN8nStatus: async () => {
    try {
      console.log('🔍 Verificando estado de N8N para Google Calendar...');
      const response = await api.get('/health/google-calendar');
      return response;
    } catch (error) {
      console.error('❌ Error al verificar estado de N8N:', error);
      throw new Error(`Error al verificar conexión: ${error.message}`);
    }
  },

  // Obtener citas del día actual (funcionalidad adicional)
  getTodayAppointments: async () => {
    try {
      console.log('📋 Obteniendo citas del día...');
      
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/google-calendar/appointments?date=${today}`);
      
      console.log('✅ Citas del día obtenidas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener citas del día:', error);
      throw new Error(`Error al obtener citas: ${error.message}`);
    }
  },

  // Método para cancelar una cita (futuro)
  cancelAppointment: async (appointmentId) => {
    try {
      const backendData = {
        appointmentId,
        timestamp: new Date().toISOString(),
        type: 'cancel_appointment',
        source: 'flowbutton_calendar'
      };
      
      console.log('🚫 Cancelando cita:', appointmentId);
      const response = await api.post('/google-calendar/cancel', backendData);
      return response;
    } catch (error) {
      console.error('❌ Error al cancelar cita:', error);
      throw new Error(`Error al cancelar cita: ${error.message}`);
    }
  },

  // Método para modificar una cita (futuro)
  updateAppointment: async (appointmentId, newData) => {
    try {
      const backendData = {
        appointmentId,
        mensaje: newData.mensaje,
        timestamp: new Date().toISOString(),
        type: 'update_appointment',
        source: 'flowbutton_calendar'
      };
      
      console.log('📝 Actualizando cita:', appointmentId);
      const response = await api.post('/google-calendar/update', backendData);
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar cita:', error);
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }
  }
};

export default googleCalendarService;
