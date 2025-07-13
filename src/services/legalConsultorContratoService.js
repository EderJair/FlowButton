// ==========================================
// legalConsultorContratoService.js - CORREGIDO
// ==========================================

const LEGAL_CONSULTANT_CONFIG = {
  legalSystemUrl: 'https://n8n-jose.up.railway.app/webhook-test/chat'
};

export const legalConsultorContratoService = {
  // CORREGIDO: Subir contrato PDF solo (operation_type: "upload_only")
  uploadContractOnly: async (file, contractName = '', userId = 'default_user') => {
    try {
      console.log('📄 Service: uploadContractOnly');
      console.log('• File:', file?.name);
      console.log('• Contract Name:', contractName);
      console.log('• User ID:', userId);
      
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
      }
      
      if (!contractName?.trim()) {
        throw new Error('El nombre del contrato es requerido');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contract_name', contractName.trim());
      formData.append('user_id', userId);
      // CRÍTICO: Agregar operation_type explícitamente
      formData.append('operation_type', 'upload_only');
      formData.append('webhook_url', LEGAL_CONSULTANT_CONFIG.legalSystemUrl);
      formData.append('execution_mode', 'test');
      
      console.log('📤 Enviando FormData:', {
        file_name: file.name,
        contract_name: contractName.trim(),
        user_id: userId,
        operation_type: 'upload_only'
      });
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Contrato subido exitosamente:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al subir contrato:', error);
      throw new Error(`Error al subir contrato: ${error.message}`);
    }
  },

  // CORREGIDO: Subir contrato + consulta inmediata (operation_type: "upload_and_consult")
  uploadContractWithQuery: async (file, message, contractName = '', userId = 'default_user') => {
    try {
      console.log('📄💬 Service: uploadContractWithQuery');
      console.log('• File:', file?.name);
      console.log('• Message:', message);
      console.log('• Contract Name:', contractName);
      console.log('• User ID:', userId);
      
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Solo se permiten archivos PDF');
      }
      
      if (!message || message.trim().length === 0) {
        throw new Error('La consulta no puede estar vacía');
      }
      
      if (!contractName?.trim()) {
        throw new Error('El nombre del contrato es requerido');
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message.trim());
      formData.append('contract_name', contractName.trim());
      formData.append('user_id', userId);
      // CRÍTICO: Agregar operation_type explícitamente
      formData.append('operation_type', 'upload_and_consult');
      formData.append('webhook_url', LEGAL_CONSULTANT_CONFIG.legalSystemUrl);
      formData.append('execution_mode', 'test');
      
      console.log('📤 Enviando FormData:', {
        file_name: file.name,
        message: message.trim(),
        contract_name: contractName.trim(),
        user_id: userId,
        operation_type: 'upload_and_consult'
      });
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Contrato subido y consulta procesada:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al subir contrato con consulta:', error);
      throw new Error(`Error: ${error.message}`);
    }
  },

  // CORREGIDO: Solo consulta (operation_type: "chat_only")
  sendChatMessage: async (message, userId = 'default_user') => {
    try {
      console.log('💬 Service: sendChatMessage');
      console.log('• Message:', message);
      console.log('• User ID:', userId);
      
      if (!message || message.trim().length === 0) {
        throw new Error('El mensaje no puede estar vacío');
      }
      
      // Verificar que no sea un comando (los comandos van por executeCommand)
      if (message.trim().startsWith('/')) {
        throw new Error('Los comandos deben enviarse usando executeCommand()');
      }
      
      const payload = {
        message: message.trim(),
        user_id: userId,
        // CRÍTICO: Agregar operation_type explícitamente
        operation_type: 'chat_only',
        webhook_url: LEGAL_CONSULTANT_CONFIG.legalSystemUrl,
        execution_mode: 'test'
      };
      
      console.log('📤 Enviando JSON:', payload);
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Consulta procesada exitosamente:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en consulta legal:', error);
      throw new Error(`Error en consulta legal: ${error.message}`);
    }
  },

  // CORREGIDO: Ejecutar comandos (operation_type: "command")
  executeCommand: async (command, userId = 'default_user') => {
    try {
      console.log('⚡ Service: executeCommand');
      console.log('• Command:', command);
      console.log('• User ID:', userId);
      
      if (!command || command.trim().length === 0) {
        throw new Error('El comando no puede estar vacío');
      }
      
      // Verificar que sea un comando válido
      if (!command.trim().startsWith('/')) {
        throw new Error('Los comandos deben empezar con "/"');
      }
      
      const payload = {
        message: command.trim(),
        user_id: userId,
        // CRÍTICO: Agregar operation_type explícitamente
        operation_type: 'command',
        webhook_url: LEGAL_CONSULTANT_CONFIG.legalSystemUrl,
        execution_mode: 'test'
      };
      
      console.log('📤 Enviando comando JSON:', payload);
      
      const response = await fetch(LEGAL_CONSULTANT_CONFIG.legalSystemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Comando ejecutado exitosamente:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error al ejecutar comando:', error);
      throw new Error(`Error al ejecutar comando: ${error.message}`);
    }
  },

  // Funciones auxiliares mejoradas
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

  // CORREGIDO: Validar nombre de contrato
  validateContractName: (contractName) => {
    const errors = [];
    if (!contractName || contractName.trim().length === 0) {
      errors.push('El nombre del contrato es requerido');
    }
    if (contractName && contractName.trim().length < 3) {
      errors.push('El nombre del contrato debe tener al menos 3 caracteres');
    }
    if (contractName && contractName.trim().length > 100) {
      errors.push('El nombre del contrato no puede exceder 100 caracteres');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // MEJORADO: Formatear respuesta con mejor manejo de errores
  formatResponse: (response) => {
    if (!response) return null;
    try {
      return {
        response: response.response || response.ai_response || response.message || 'Sin respuesta',
        operationType: response.operation_type || 'unknown',
        contractId: response.contract_id || response.contractId || null,
        contractName: response.contract_name || response.contractName || null,
        userId: response.user_id || response.userId || 'unknown',
        timestamp: response.timestamp || new Date().toISOString(),
        totalContracts: response.total_contracts || response.totalContracts || 0,
        success: response.success !== false, // Default true unless explicitly false
        error: response.error || null,
        operationData: response.operation_data || response.operationData || null,
        fullResponse: response
      };
    } catch (error) {
      console.error('Error al formatear respuesta:', error);
      return {
        response: 'Error al procesar la respuesta',
        operationType: 'error',
        success: false,
        error: error.message,
        fullResponse: response
      };
    }
  },

  // NUEVO: Validar mensaje/consulta
  validateMessage: (message) => {
    const errors = [];
    if (!message || message.trim().length === 0) {
      errors.push('El mensaje no puede estar vacío');
    }
    if (message && message.trim().length > 1000) {
      errors.push('El mensaje no puede exceder 1000 caracteres');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // NUEVO: Detectar tipo de operación automáticamente
  detectOperationType: (hasFile, hasMessage, isCommand) => {
    if (isCommand) return 'command';
    if (hasFile && hasMessage) return 'upload_and_consult';
    if (hasFile && !hasMessage) return 'upload_only';
    if (!hasFile && hasMessage) return 'chat_only';
    return 'unknown';
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