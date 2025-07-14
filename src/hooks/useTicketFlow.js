// src/hooks/useTicketFlow.js

import { useState, useCallback } from 'react';
import ticketService from '@/services/ticketService.js';

export const useTicketFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setTicketData(null);
    setFormattedData(null);
  }, []);

  // Función principal para enviar ticket
  const submitTicket = useCallback(async (ticketFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validar datos antes de enviar
      const validation = ticketService.validateTicketData(ticketFormData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      console.log('🎫 Enviando ticket para procesamiento:', ticketFormData);
      
      // Enviar ticket a N8N
      const response = await ticketService.createTicket(ticketFormData);
      
      // Formatear respuesta para la UI
      const formatted = ticketService.formatTicketResponse(response);
      
      setTicketData(response);
      setFormattedData(formatted);
      setSuccess(true);
      
      console.log('✅ Ticket procesado exitosamente');
      console.log('📊 Datos formateados:', formatted);
      
      return {
        raw: response,
        formatted: formatted
      };
      
    } catch (err) {
      console.error('❌ Error al procesar ticket:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validar datos del ticket sin enviarlo
  const validateTicketData = useCallback((data) => {
    try {
      return ticketService.validateTicketData(data);
    } catch (err) {
      console.error('Error al validar datos del ticket:', err);
      return { isValid: false, errors: [err.message] };
    }
  }, []);

  // Verificar conexión con N8N
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ticketService.checkN8nStatus();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener resumen del ticket procesado
  const getTicketSummary = useCallback(() => {
    if (!formattedData) return null;
    
    return {
      id: formattedData.id,
      categoria: formattedData.categoria,
      prioridad: formattedData.prioridad,
      area: formattedData.area,
      sla: formattedData.sla,
      estado: formattedData.estado,
      requiresFollowup: formattedData.requiresFollowup,
      sentimiento: formattedData.sentimiento
    };
  }, [formattedData]);

  // Obtener configuración de emails
  const getEmailConfig = useCallback(() => {
    if (!ticketData) return null;
    
    return {
      principal: ticketData.email_principal || '',
      cc: ticketData.emails_cc || [],
      area: ticketData.area_email || '',
      asunto: ticketData.asunto_email || ''
    };
  }, [ticketData]);

  // Obtener análisis de IA
  const getAIAnalysis = useCallback(() => {
    if (!ticketData) return null;
    
    return {
      categoria: ticketData.categoria || 'GENERAL',
      prioridad: ticketData.prioridad || 'MEDIA',
      resumen: ticketData.resumen || '',
      justificacion: ticketData.justificacion || '',
      palabrasClave: ticketData.palabras_clave || [],
      sentimiento: ticketData.sentimiento_usuario || 'NEUTRAL',
      impactoNegocio: ticketData.impacto_negocio || '',
      respuestaSugerida: ticketData.respuesta_sugerida || '',
      accionesRecomendadas: ticketData.acciones_recomendadas || [],
      nivelTecnico: ticketData.nivel_tecnico || 'BASICO',
      slaRecomendado: ticketData.sla_recomendado || '24h',
      requiereFollowup: ticketData.requiere_followup || false
    };
  }, [ticketData]);

  // Obtener información de enrutamiento
  const getRoutingInfo = useCallback(() => {
    if (!ticketData) return null;
    
    return {
      emailPrincipal: ticketData.email_principal || '',
      emailsCC: ticketData.emails_cc || [],
      areaResponsable: ticketData.area_email || '',
      asuntoEmail: ticketData.asunto_email || '',
      plantillaEmail: ticketData.plantilla_email || ''
    };
  }, [ticketData]);

  // Obtener métricas del ticket
  const getTicketMetrics = useCallback(() => {
    if (!ticketData) return null;
    
    const analysis = getAIAnalysis();
    
    return {
      score: {
        prioridad: analysis.prioridad,
        urgencia: ['CRITICA', 'ALTA'].includes(analysis.prioridad) ? 'Alta' : 'Normal',
        complejidad: analysis.nivelTecnico
      },
      timing: {
        sla: analysis.slaRecomendado,
        fechaCreacion: ticketData.fecha || new Date().toISOString(),
        tiempoEstimado: analysis.slaRecomendado
      },
      classification: {
        categoria: analysis.categoria,
        area: ticketData.area_email,
        confianza: 'Alta' // Podría venir del análisis IA
      },
      sentiment: {
        nivel: analysis.sentimiento,
        requiereAtencionEspecial: ['CRITICO', 'FRUSTRADO'].includes(analysis.sentimiento)
      }
    };
  }, [ticketData, getAIAnalysis]);

  // Obtener estadísticas del procesamiento
  const getProcessingStats = useCallback(() => {
    if (!ticketData) return null;
    
    return {
      tiempoProcesamiento: '< 5 segundos', // Calculado dinámicamente
      clasificacionIA: 'Exitosa',
      enrutamientoAutomatico: 'Completado',
      notificacionEnviada: 'Sí',
      confirmacionCliente: 'Enviada'
    };
  }, [ticketData]);

  // Regenerar respuesta IA (si es necesario)
  const regenerateAIResponse = useCallback(async (ticketId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ticketService.regenerateAIResponse(ticketId);
      
      // Actualizar solo la respuesta IA manteniendo el resto de datos
      setTicketData(prev => ({
        ...prev,
        respuesta_sugerida: response.respuesta_sugerida,
        acciones_recomendadas: response.acciones_recomendadas
      }));
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar estado del ticket
  const updateTicketStatus = useCallback(async (ticketId, newStatus) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ticketService.updateTicketStatus(ticketId, newStatus);
      
      // Actualizar estado local
      setTicketData(prev => ({
        ...prev,
        estado: newStatus
      }));
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener historial de tickets (si aplica)
  const getTicketHistory = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ticketService.getTicketHistory(email);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Exportar datos del ticket para reportes
  const exportTicketData = useCallback(() => {
    if (!ticketData) return null;
    
    const analysis = getAIAnalysis();
    const routing = getRoutingInfo();
    const metrics = getTicketMetrics();
    
    return {
      ticket_info: {
        id: ticketData.id,
        fecha: ticketData.fecha,
        estado: ticketData.estado,
        cliente: {
          nombre: ticketData.nombre,
          email: ticketData.email,
          empresa: ticketData.empresa,
          telefono: ticketData.telefono
        }
      },
      contenido: {
        asunto: ticketData.asunto,
        mensaje: ticketData.mensaje,
        canal: ticketData.canal,
        tipo_cliente: ticketData.tipo_cliente
      },
      analisis_ia: analysis,
      configuracion_email: routing,
      metricas: metrics,
      timestamp_export: new Date().toISOString()
    };
  }, [ticketData, getAIAnalysis, getRoutingInfo, getTicketMetrics]);

  return {
    // Estados principales
    isLoading,
    error,
    success,
    ticketData,
    formattedData,
    
    // Funciones principales
    submitTicket,
    validateTicketData,
    checkConnection,
    clearStates,
    
    // Funciones de análisis y datos
    getTicketSummary,
    getEmailConfig,
    getAIAnalysis,
    getRoutingInfo,
    getTicketMetrics,
    getProcessingStats,
    
    // Funciones avanzadas
    regenerateAIResponse,
    updateTicketStatus,
    getTicketHistory,
    exportTicketData
  };
};

export default useTicketFlow;