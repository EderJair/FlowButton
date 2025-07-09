// src/services/cvAnalizadorService.js

const CV_ANALYZER_CONFIG = {
  analyzeUrl: 'https://n8n-jose.up.railway.app/webhook/cvAnalizador'
};

export const cvAnalizadorService = {
  // Analizar CV enviando el archivo PDF
  analyzeCV: async (file) => {
    try {
      console.log('🔍 Enviando CV para análisis:', file.name);
      
      // Validar que sea un archivo PDF
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
      }
      
      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
      }
      
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      // Endpoint de tu N8N
      const url = CV_ANALYZER_CONFIG.analyzeUrl;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      
      console.log('✅ CV analizado exitosamente');
      console.log('📊 Resultado del análisis:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al analizar CV:', error);
      throw new Error(`Error al analizar CV: ${error.message}`);
    }
  },

  // Verificar estado del servicio N8N
  checkN8nStatus: async () => {
    try {
      console.log('🔍 Verificando estado del servicio N8N...');
      
      // Usar la misma URL para verificar estado
      const url = CV_ANALYZER_CONFIG.analyzeUrl;
      
      const response = await fetch(url, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Servicio N8N no disponible: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('✅ Servicio N8N operativo');
      return result;
      
    } catch (error) {
      console.error('❌ Error al verificar N8N:', error);
      throw new Error(`Error de conexión con N8N: ${error.message}`);
    }
  },

  // Obtener información del archivo antes de procesar
  getFileInfo: (file) => {
    if (!file) return null;
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: formatFileSize(file.size),
      isValidPDF: file.type === 'application/pdf',
      isValidSize: file.size <= 10 * 1024 * 1024 // 10MB
    };
  },

  // Validar archivo antes de enviar
  validateFile: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('No se ha seleccionado ningún archivo');
      return { isValid: false, errors };
    }
    
    // Validar tipo
    if (file.type !== 'application/pdf') {
      errors.push('Solo se permiten archivos PDF');
    }
    
    // Validar tamaño
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('El archivo es demasiado grande. Máximo 10MB');
    }
    
    // Validar nombre
    if (!file.name || file.name.length < 3) {
      errors.push('El nombre del archivo es inválido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Formatear respuesta del análisis para mostrar en UI
  formatAnalysisResponse: (response) => {
    if (!response) return null;
    
    try {
      return {
        // Datos principales
        score: response.evaluacion_cv?.puntuacion_idoneidad || 0,
        recommendation: response.insights_estrategicos?.decision_recomendada || 'NO_DEFINIDO',
        level: response.evaluacion_cv?.nivel_tecnico || 'No definido',
        area: response.evaluacion_cv?.area_optima_identificada || 'No definido',
        
        // Resumen ejecutivo
        summary: response.perfil_candidato?.resumen_ejecutivo || 'No disponible',
        experience: response.perfil_candidato?.años_experiencia_relevante || 0,
        
        // Análisis salarial
        salary: {
          min: response.estimacion_salarial?.rango_estimado?.minimo || 0,
          max: response.estimacion_salarial?.rango_estimado?.maximo || 0,
          currency: response.estimacion_salarial?.rango_estimado?.moneda || 'PEN'
        },
        
        // Fortalezas
        strengths: response.analisis_competencias?.fortalezas_validadas || [],
        
        // Competencias a validar
        toValidate: response.analisis_competencias?.competencias_a_validar || [],
        
        // Pruebas recomendadas
        tests: response.recomendaciones_pruebas?.validaciones_criticas || [],
        
        // Red flags
        redFlags: response.alertas_reclutador?.red_flags || [],
        
        // Próximos pasos
        nextSteps: response.ia_assistant_summary?.accion_inmediata || 'No definido',
        
        // Preguntas sugeridas
        questions: response.ia_assistant_summary?.questions_to_ask || [],
        
        // Metadatos
        metadata: {
          timestamp: response.process_metadata?.timestamp || new Date().toISOString(),
          confidence: response.process_metadata?.confidence_score || 0,
          processingTime: response.process_metadata?.processing_time || 'No disponible'
        },
        
        // Respuesta completa para casos avanzados
        fullResponse: response
      };
    } catch (error) {
      console.error('Error al formatear respuesta:', error);
      return {
        score: 0,
        recommendation: 'ERROR',
        level: 'Error',
        area: 'Error en análisis',
        summary: 'Error al procesar la respuesta',
        fullResponse: response
      };
    }
  }
};

// Función helper para formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default cvAnalizadorService;