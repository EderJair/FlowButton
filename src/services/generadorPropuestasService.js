// src/services/generadorPropuestasService.js

import { api } from './api.js';

// Servicio para el flujo Generador de Propuestas Comerciales - Conecta con N8N
export const generadorPropuestasService = {
  // Crear propuesta comercial - Conecta con el webhook de N8N
  createPropuesta: async (propuestaData) => {
    try {
      console.log('📄 Creando propuesta con datos del formulario:', propuestaData);
      
      // Transformar los datos del formulario para el backend N8N
      const backendData = {
        nombre_cliente: propuestaData.nombre_cliente,
        industria: propuestaData.industria,
        servicios_solicitados: propuestaData.servicios_solicitados,
        presupuesto_estimado: propuestaData.presupuesto_estimado,
        timeline: propuestaData.timeline,
        timestamp: new Date().toISOString(),
        type: 'create_proposal',
        source: 'flowbutton_proposal'
      };
      
      console.log('📤 Datos transformados para N8N:', backendData);
      
      // Endpoint específico para Generador de Propuestas
      const response = await api.post('/propuestas', backendData);
      
      console.log('✅ Respuesta del backend N8N:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al crear propuesta:', error);
      throw new Error(`Error en el servicio de Generador de Propuestas: ${error.message}`);
    }
  },

  // Obtener vista previa de la propuesta (sin crear)
  previewPropuesta: async (propuestaData) => {
    try {
      console.log('🔍 Obteniendo vista previa de la propuesta:', propuestaData);
      
      const backendData = {
        nombre_cliente: propuestaData.nombre_cliente,
        industria: propuestaData.industria,
        servicios_solicitados: propuestaData.servicios_solicitados,
        presupuesto_estimado: propuestaData.presupuesto_estimado,
        timeline: propuestaData.timeline,
        timestamp: new Date().toISOString(),
        type: 'preview_proposal',
        source: 'flowbutton_proposal'
      };
      
      const response = await api.post('/propuestas/preview', backendData);
      
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
      console.log('🔍 Verificando estado de N8N para Generador de Propuestas...');
      const response = await api.get('/health/propuestas');
      return response;
    } catch (error) {
      console.error('❌ Error al verificar estado de N8N:', error);
      throw new Error(`Error al verificar conexión: ${error.message}`);
    }
  },

  // Obtener propuestas recientes (funcionalidad adicional)
  getRecentProposals: async () => {
    try {
      console.log('📋 Obteniendo propuestas recientes...');
      
      const response = await api.get('/propuestas/recent');
      
      console.log('✅ Propuestas recientes obtenidas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener propuestas recientes:', error);
      throw new Error(`Error al obtener propuestas: ${error.message}`);
    }
  },

  // Método para descargar una propuesta como PDF
  downloadProposal: async (proposalId) => {
    try {
      console.log('📥 Descargando propuesta como PDF:', proposalId);
      
      const response = await api.get(`/propuestas/download/${proposalId}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      console.error('❌ Error al descargar propuesta:', error);
      throw new Error(`Error al descargar propuesta: ${error.message}`);
    }
  }
};

export default generadorPropuestasService;
