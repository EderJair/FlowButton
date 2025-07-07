// src/services/gmailService.js
import { api } from './api.js';

// Servicio para el flujo Gmail + OpenAI - Adaptado para tu backend N8N
export const gmailService = {
  // Generar y enviar email con IA - Conecta con tu endpoint /api/send-email
  generateAndSendEmail: async (emailData) => {
    try {
      console.log('📧 Enviando email con datos del modal:', emailData);

      // Transformar los datos del modal a lo que espera tu backend
      const backendData = {
        subject: 'Email generado con IA', // Puedes hacer esto configurable
        message: emailData.prompt, // El prompt se usa como message  
        recipients: emailData.destinatario, // destinatario se mapea a recipients
        timestamp: new Date().toISOString()
      };

      console.log('📤 Datos transformados para tu backend:', backendData);

      const response = await api.post('/send-email', backendData);

      console.log('✅ Respuesta del backend:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al generar y enviar email:', error);
      throw new Error(`Error en el servicio de Gmail: ${error.message}`);
    }
  },

  // Verificar estado de conexión con N8N
  checkN8nStatus: async () => {
    try {
      console.log('🔍 Verificando estado de N8N...');
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('❌ Error al verificar estado de N8N:', error);
      throw new Error(`Error al verificar conexión: ${error.message}`);
    }
  },

  // Método alternativo si quieres enviar con subject personalizado
  sendCustomEmail: async (emailData) => {
    try {
      const backendData = {
        subject: emailData.subject || 'Email generado con IA',
        message: emailData.message || emailData.prompt,
        recipients: emailData.recipients || emailData.destinatario,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Enviando email personalizado:', backendData);
      const response = await api.post('/send-email', backendData);
      return response;
    } catch (error) {
      console.error('❌ Error al enviar email personalizado:', error);
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }
};

export default gmailService;