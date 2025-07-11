// ==========================================
// 1. legalConsultorContratoService.js - CORREGIDO
// ==========================================

const LEGAL_CONSULTANT_CONFIG = {
  legalSystemUrl: 'https://n8n-jose.up.railway.app/webhook/chat'
};

export const legalConsultorContratoService = {
  // Subir contrato PDF solo (RAMA 2) - CORREGIDO
  uploadContractOnly: async (file, contractName = '', userId = 'default_user') => {
    try {
      console.log('📄 Subiendo contrato solo:', file.name);
      
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
      }
      
      const formData = new FormData();
      formData.append('file', file); // N8N espera 'file'
      formData.append('contract_name', contractName || file.name.replace('.pdf', ''));
      formData.append('user_id', userId);
      // CLAVE: Agregar operation_type explícitamente
      formData.append('operation_type', 'upload_only');
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Contrato subido exitosamente');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al subir contrato:', error);
      throw new Error(`Error al subir contrato: ${error.message}`);
    }
  },

  // Subir contrato + consulta inmediata (RAMA 1) - CORREGIDO
  uploadContractWithQuery: async (file, message, contractName = '', userId = 'default_user') => {
    try {
      console.log('📄💬 Subiendo contrato con consulta:', file.name);
      
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
      }
      
      if (!message || message.trim().length === 0) {
        throw new Error('La consulta no puede estar vacía');
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message.trim());
      formData.append('contract_name', contractName || file.name.replace('.pdf', ''));
      formData.append('user_id', userId);
      // CLAVE: Agregar operation_type explícitamente
      formData.append('operation_type', 'upload_and_consult');
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Contrato subido y consulta procesada');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al subir contrato con consulta:', error);
      throw new Error(`Error: ${error.message}`);
    }
  },

  // Solo consulta (RAMA 3) - SIN CAMBIOS
  sendChatMessage: async (message, userId = 'default_user') => {
    try {
      console.log('💬 Enviando consulta legal:', message);
      
      if (!message || message.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío');
      }
      
      const payload = {
        message: message.trim(),
        user_id: userId
        // operation_type se detecta automáticamente en el router
      };
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Consulta procesada exitosamente');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en consulta legal:', error);
      throw new Error(`Error en consulta legal: ${error.message}`);
    }
  },

  // El resto de funciones sin cambios...
  executeCommand: async (command, userId = 'default_user') => {
    try {
      console.log(`⚡ Ejecutando comando: ${command}`);
      
      const payload = {
        message: command,
        user_id: userId
      };
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Comando ejecutado exitosamente');
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al ejecutar comando:', error);
      throw new Error(`Error al ejecutar comando: ${error.message}`);
    }
  },

  // Funciones auxiliares sin cambios
  getFileInfo: (file) => {
    if (!file) return null;
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: formatFileSize(file.size),
      isValidPDF: file.type === 'application/pdf',
      isValidSize: file.size <= 10 * 1024 * 1024
    };
  },

  validateFile: (file) => {
    const errors = [];
    if (!file) {
      errors.push('No se ha seleccionado ningún contrato');
      return { isValid: false, errors };
    }
    if (file.type !== 'application/pdf') {
      errors.push('Solo se permiten contratos en formato PDF');
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('El contrato es demasiado grande. Máximo 10MB');
    }
    if (!file.name || file.name.length < 3) {
      errors.push('El nombre del archivo es inválido');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  formatResponse: (response) => {
    if (!response) return null;
    try {
      return {
        response: response.response || 'Sin respuesta',
        operationType: response.operation_type || 'unknown',
        contractId: response.contract_id || null,
        contractName: response.contract_name || null,
        userId: response.user_id || 'unknown',
        timestamp: response.timestamp || new Date().toISOString(),
        totalContracts: response.total_contracts || 0,
        success: response.success || false,
        fullResponse: response
      };
    } catch (error) {
      console.error('Error al formatear respuesta:', error);
      return {
        response: 'Error al procesar la respuesta',
        operationType: 'error',
        success: false,
        fullResponse: response
      };
    }
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default legalConsultorContratoService;
