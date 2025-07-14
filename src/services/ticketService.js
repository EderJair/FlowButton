// src/services/ticketService.js

class TicketService {
  constructor() {
    // URL de tu webhook N8N (reemplaza con tu URL real)
    this.n8nWebhookUrl = 'https://n8n-jose.up.railway.app/webhook/recibir-ticket';
    this.apiTimeout = 30000; // 30 segundos timeout
  }

  // Validar datos del ticket antes de enviar
  validateTicketData(data) {
    const errors = [];
    
    // Validaciones requeridas
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email inválido');
    }
    
    if (!data.asunto || data.asunto.trim().length < 5) {
      errors.push('El asunto debe tener al menos 5 caracteres');
    }
    
    if (!data.mensaje || data.mensaje.trim().length < 10) {
      errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    // Validaciones opcionales pero recomendadas
    if (data.telefono && !this.isValidPhone(data.telefono)) {
      errors.push('Formato de teléfono inválido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar formato de email
  isValidEmail(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  // Validar formato de teléfono
  isValidPhone(phone) {
    // Acepta formatos: +51999123456, 999123456, +51 999 123 456, etc.
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  // Enviar ticket a N8N
  async createTicket(ticketData) {
    try {
      console.log('🌐 Enviando ticket a N8N...');
      
      // Preparar datos para el webhook
      const payload = {
        nombre: ticketData.nombre?.trim(),
        email: ticketData.email?.trim().toLowerCase(),
        empresa: ticketData.empresa?.trim() || '',
        telefono: ticketData.telefono?.trim() || '',
        asunto: ticketData.asunto?.trim(),
        mensaje: ticketData.mensaje?.trim(),
        tipo_cliente: ticketData.tipo_cliente || 'Regular',
        canal: ticketData.canal || 'Web',
        timestamp: new Date().toISOString(),
        // Información adicional para contexto
        user_agent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      };

      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TicketSystem/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.apiTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Ticket procesado por N8N:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al enviar ticket a N8N:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout: El servidor tardó demasiado en responder');
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión: Verifica tu conexión a internet');
      }
      
      throw new Error(error.message || 'Error desconocido al procesar el ticket');
    }
  }

  // Formatear respuesta de N8N para la UI
  formatTicketResponse(rawResponse) {
    try {
      return {
        id: rawResponse.id || 'N/A',
        categoria: rawResponse.categoria || 'GENERAL',
        prioridad: rawResponse.prioridad || 'MEDIA',
        area: rawResponse.area_email || 'Soporte General',
        sla: rawResponse.sla_recomendado || '24h',
        estado: rawResponse.estado || 'Nuevo',
        requiresFollowup: rawResponse.requiere_followup || false,
        sentimiento: rawResponse.sentimiento_usuario || 'NEUTRAL',
        
        // Información adicional formateada
        cliente: {
          nombre: rawResponse.nombre,
          email: rawResponse.email,
          empresa: rawResponse.empresa
        },
        
        analisis: {
          resumen: rawResponse.resumen,
          justificacion: rawResponse.justificacion,
          palabrasClave: rawResponse.palabras_clave || [],
          impacto: rawResponse.impacto_negocio
        },
        
        respuesta: {
          sugerida: rawResponse.respuesta_sugerida,
          acciones: rawResponse.acciones_recomendadas || []
        },
        
        enrutamiento: {
          emailPrincipal: rawResponse.email_principal,
          emailsCC: rawResponse.emails_cc || [],
          asuntoEmail: rawResponse.asunto_email
        },
        
        timestamps: {
          creacion: rawResponse.fecha,
          procesamiento: rawResponse.fecha_procesamiento || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error al formatear respuesta:', error);
      return {
        id: 'ERROR',
        categoria: 'GENERAL',
        prioridad: 'MEDIA',
        area: 'Soporte',
        sla: '24h',
        estado: 'Error',
        requiresFollowup: true,
        sentimiento: 'NEUTRAL'
      };
    }
  }

  // Verificar estado de N8N
  async checkN8nStatus() {
    try {
      // Enviar un ping básico al webhook
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(5000)
      });
      
      return {
        status: response.ok ? 'online' : 'offline',
        responseTime: Date.now(),
        message: response.ok ? 'N8N está funcionando correctamente' : 'N8N no responde'
      };
    } catch (error) {
      return {
        status: 'offline',
        responseTime: null,
        message: 'Error al conectar con N8N: ' + error.message
      };
    }
  }

  // Regenerar respuesta IA (función avanzada)
  async regenerateAIResponse(ticketId) {
    try {
      // Este endpoint necesitaría implementarse en N8N
      const response = await fetch(`${this.n8nWebhookUrl}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticket_id: ticketId }),
        signal: AbortSignal.timeout(this.apiTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error al regenerar respuesta IA: ' + error.message);
    }
  }

  // Actualizar estado del ticket
  async updateTicketStatus(ticketId, newStatus) {
    try {
      // Este endpoint necesitaría implementarse en N8N
      const response = await fetch(`${this.n8nWebhookUrl}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ticket_id: ticketId, 
          new_status: newStatus 
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error al actualizar estado: ' + error.message);
    }
  }

  // Obtener historial de tickets por email
  async getTicketHistory(email) {
    try {
      // Este endpoint necesitaría implementarse en N8N
      const response = await fetch(`${this.n8nWebhookUrl}/history?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error al obtener historial: ' + error.message);
    }
  }

  // Utilidades para categorías y prioridades
  getCategoryInfo(categoria) {
    const categorias = {
      'TECNICO': {
        icon: '🔧',
        nombre: 'Técnico',
        color: 'blue',
        descripcion: 'Problemas técnicos y sistemas'
      },
      'FACTURACION': {
        icon: '💰',
        nombre: 'Facturación',
        color: 'green',
        descripcion: 'Cobros, pagos y facturas'
      },
      'COMERCIAL': {
        icon: '🏢',
        nombre: 'Comercial',
        color: 'purple',
        descripcion: 'Ventas y consultas comerciales'
      },
      'RRHH': {
        icon: '👥',
        nombre: 'Recursos Humanos',
        color: 'orange',
        descripcion: 'Temas de personal y nómina'
      },
      'LEGAL': {
        icon: '⚖️',
        nombre: 'Legal',
        color: 'red',
        descripcion: 'Contratos y temas legales'
      },
      'GENERAL': {
        icon: '📝',
        nombre: 'General',
        color: 'gray',
        descripcion: 'Consultas generales'
      }
    };

    return categorias[categoria] || categorias['GENERAL'];
  }

  getPriorityInfo(prioridad) {
    const prioridades = {
      'CRITICA': {
        icon: '🚨',
        nombre: 'Crítica',
        color: 'red',
        descripcion: 'Requiere atención inmediata',
        sla: '30min - 2h',
        nivel: 4
      },
      'ALTA': {
        icon: '⚠️',
        nombre: 'Alta',
        color: 'orange',
        descripcion: 'Importante, resolver pronto',
        sla: '2h - 8h',
        nivel: 3
      },
      'MEDIA': {
        icon: '📝',
        nombre: 'Media',
        color: 'yellow',
        descripcion: 'Resolver en tiempo normal',
        sla: '8h - 24h',
        nivel: 2
      },
      'BAJA': {
        icon: '💬',
        nombre: 'Baja',
        color: 'green',
        descripcion: 'No urgente',
        sla: '24h - 72h',
        nivel: 1
      }
    };

    return prioridades[prioridad] || prioridades['MEDIA'];
  }

  // Obtener información de sentimiento
  getSentimentInfo(sentimiento) {
    const sentimientos = {
      'CRITICO': {
        icon: '😡',
        nombre: 'Crítico',
        color: 'red',
        descripcion: 'Cliente muy molesto o desesperado'
      },
      'FRUSTRADO': {
        icon: '😤',
        nombre: 'Frustrado',
        color: 'orange',
        descripcion: 'Cliente molesto o decepcionado'
      },
      'URGENTE': {
        icon: '⏰',
        nombre: 'Urgente',
        color: 'yellow',
        descripcion: 'Cliente necesita respuesta rápida'
      },
      'NEUTRAL': {
        icon: '😐',
        nombre: 'Neutral',
        color: 'blue',
        descripcion: 'Tono profesional y calmado'
      },
      'SATISFECHO': {
        icon: '😊',
        nombre: 'Satisfecho',
        color: 'green',
        descripcion: 'Cliente contento o agradecido'
      }
    };

    return sentimientos[sentimiento] || sentimientos['NEUTRAL'];
  }

  // Generar estadísticas del ticket
  generateTicketStats(ticketData) {
    const categoria = this.getCategoryInfo(ticketData.categoria);
    const prioridad = this.getPriorityInfo(ticketData.prioridad);
    const sentimiento = this.getSentimentInfo(ticketData.sentimiento_usuario);

    return {
      categoria,
      prioridad,
      sentimiento,
      metricas: {
        tiempoRespuestaEsperado: prioridad.sla,
        nivelUrgencia: prioridad.nivel,
        requiereEscalamiento: prioridad.nivel >= 3,
        requiereFollowup: ticketData.requiere_followup
      },
      recomendaciones: {
        contactoInmediato: prioridad.nivel === 4,
        validacionAdicional: sentimiento.nombre === 'Crítico',
        monitoreoCercano: ticketData.requiere_followup
      }
    };
  }

  // Validar configuración del servicio
  validateConfiguration() {
    const issues = [];

    if (!this.n8nWebhookUrl || this.n8nWebhookUrl.includes('tu-n8n-instance')) {
      issues.push('URL de webhook N8N no configurada');
    }

    if (!process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      issues.push('Variable de entorno NEXT_PUBLIC_N8N_WEBHOOK_URL no definida');
    }

    return {
      isValid: issues.length === 0,
      issues,
      config: {
        webhookUrl: this.n8nWebhookUrl,
        timeout: this.apiTimeout
      }
    };
  }

  // Generar reporte de ticket para export
  generateTicketReport(ticketData) {
    const stats = this.generateTicketStats(ticketData);
    
    return {
      resumen_ejecutivo: {
        id: ticketData.id,
        estado: ticketData.estado,
        prioridad: stats.prioridad.nombre,
        categoria: stats.categoria.nombre,
        tiempo_procesamiento: '< 5 segundos',
        sla_asignado: stats.prioridad.sla
      },
      informacion_cliente: {
        nombre: ticketData.nombre,
        email: ticketData.email,
        empresa: ticketData.empresa || 'No especificada',
        telefono: ticketData.telefono || 'No proporcionado',
        tipo_cliente: ticketData.tipo_cliente || 'Regular',
        sentimiento_detectado: stats.sentimiento.nombre
      },
      contenido_ticket: {
        asunto: ticketData.asunto,
        mensaje: ticketData.mensaje,
        canal_origen: ticketData.canal || 'Web',
        fecha_creacion: ticketData.fecha
      },
      analisis_ia: {
        categoria_asignada: ticketData.categoria,
        prioridad_asignada: ticketData.prioridad,
        justificacion: ticketData.justificacion,
        palabras_clave_detectadas: ticketData.palabras_clave || [],
        resumen_tecnico: ticketData.resumen,
        impacto_negocio: ticketData.impacto_negocio,
        nivel_tecnico: ticketData.nivel_tecnico || 'BASICO'
      },
      configuracion_respuesta: {
        area_asignada: ticketData.area_email,
        email_principal: ticketData.email_principal,
        emails_copia: ticketData.emails_cc || [],
        respuesta_automatica: ticketData.respuesta_sugerida,
        acciones_recomendadas: ticketData.acciones_recomendadas || []
      },
      metricas_procesamiento: {
        tiempo_clasificacion: '2-3 segundos',
        confianza_ia: 'Alta',
        enrutamiento_automatico: 'Exitoso',
        notificacion_enviada: true,
        requiere_seguimiento: ticketData.requiere_followup
      },
      proximos_pasos: {
        sla_respuesta: stats.prioridad.sla,
        escalamiento_automatico: stats.recomendaciones.contactoInmediato,
        monitoreo_especial: stats.recomendaciones.monitoreoCercano,
        validacion_adicional: stats.recomendaciones.validacionAdicional
      },
      metadata: {
        version_sistema: '1.0.0',
        timestamp_reporte: new Date().toISOString(),
        generado_por: 'Sistema Automatizado de Tickets'
      }
    };
  }

  // Limpiar y sanitizar datos de entrada
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
      .replace(/[<>\"']/g, '') // Remover caracteres potencialmente peligrosos
      .substring(0, 1000); // Limitar longitud
  }

  // Detectar posibles problemas en el ticket
  detectIssues(ticketData) {
    const issues = [];
    
    // Detectar información faltante crítica
    if (!ticketData.empresa && ticketData.tipo_cliente === 'Enterprise') {
      issues.push('Cliente Enterprise sin empresa especificada');
    }
    
    if (!ticketData.telefono && ticketData.prioridad === 'CRITICA') {
      issues.push('Ticket crítico sin teléfono de contacto');
    }
    
    // Detectar inconsistencias
    if (ticketData.sentimiento_usuario === 'CRITICO' && ticketData.prioridad === 'BAJA') {
      issues.push('Inconsistencia: sentimiento crítico con prioridad baja');
    }
    
    // Detectar posibles problemas de spam
    const mensaje = (ticketData.mensaje || '').toLowerCase();
    const spamIndicators = ['ganar dinero', 'oferta especial', 'click aquí', 'premio'];
    const spamCount = spamIndicators.filter(indicator => mensaje.includes(indicator)).length;
    
    if (spamCount >= 2) {
      issues.push('Posible spam detectado');
    }
    
    return issues;
  }
}

// Crear instancia singleton del servicio
const ticketService = new TicketService();

export default ticketService;