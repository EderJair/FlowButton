// src/services/gmailService.js

import { api } from './api.js';

// Servicio para el flujo Gmail + OpenAI
export const gmailService = {
  // Generar y enviar email con IA
  generateAndSendEmail: async (emailData) => {
    try {
      const response = await api.post('/gmail/generate-send', {
        destinatario: emailData.destinatario,
        prompt: emailData.prompt,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      console.error('Error al generar y enviar email:', error);
      throw new Error(`Error en el servicio de Gmail: ${error.message}`);
    }
  },

  // Solo generar email (sin enviar)
  generateEmail: async (prompt) => {
    try {
      const response = await api.post('/gmail/generate', {
        prompt,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      console.error('Error al generar email:', error);
      throw new Error(`Error al generar email: ${error.message}`);
    }
  },

  // Enviar email previamente generado
  sendEmail: async (emailData) => {
    try {
      const response = await api.post('/gmail/send', {
        destinatario: emailData.destinatario,
        asunto: emailData.asunto,
        contenido: emailData.contenido,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  },

  // Obtener historial de emails enviados
  getEmailHistory: async (limit = 10, offset = 0) => {
    try {
      const response = await api.get(`/gmail/history?limit=${limit}&offset=${offset}`);
      return response;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  },

  // Verificar estado de la conexión Gmail
  checkGmailConnection: async () => {
    try {
      const response = await api.get('/gmail/status');
      return response;
    } catch (error) {
      console.error('Error al verificar conexión Gmail:', error);
      throw new Error(`Error de conexión Gmail: ${error.message}`);
    }
  }
};

export default gmailService;
