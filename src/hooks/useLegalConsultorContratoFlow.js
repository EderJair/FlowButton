// ==========================================
// useLegalConsultorContratoFlow.js - CORREGIDO PARA MANEJAR RESPUESTAS
// ==========================================

import { useState, useCallback } from 'react';
import legalConsultorContratoService from '../services/legalConsultorContratoService';

export const useLegalConsultorContratoFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contractData, setContractData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [repositoryMode, setRepositoryMode] = useState(false);
  const [availableContracts, setAvailableContracts] = useState([]);

  // NUEVOS ESTADOS para selección de contratos
  const [awaitingContractSelection, setAwaitingContractSelection] = useState(false);
  const [availableContractsForSelection, setAvailableContractsForSelection] = useState([]);
  const [originalQuery, setOriginalQuery] = useState('');

  // FUNCIÓN CRÍTICA: Extraer respuesta del formato del backend
  const extractAIResponse = useCallback((rawResponse) => {
    console.log('🔍 Extrayendo respuesta de:', rawResponse);
    
    try {
      // Si la respuesta es un array (como en tu ejemplo)
      if (Array.isArray(rawResponse) && rawResponse.length > 0) {
        const firstItem = rawResponse[0];
        if (firstItem && firstItem.output) {
          console.log('✅ Respuesta extraída del array:', firstItem.output);
          return firstItem.output;
        }
      }
      
      // Si la respuesta es un objeto directo
      if (rawResponse && typeof rawResponse === 'object') {
        if (rawResponse.output) return rawResponse.output;
        if (rawResponse.response) return rawResponse.response;
        if (rawResponse.ai_response) return rawResponse.ai_response;
        if (rawResponse.message) return rawResponse.message;
      }
      
      // Si es texto directo
      if (typeof rawResponse === 'string') {
        return rawResponse;
      }
      
      console.warn('⚠️ No se pudo extraer respuesta de:', rawResponse);
      return 'Respuesta procesada correctamente.';
      
    } catch (err) {
      console.error('❌ Error extrayendo respuesta:', err);
      return 'Error al procesar la respuesta.';
    }
  }, []);

  // FUNCIÓN AUXILIAR: Formatear respuesta mejorada
  const formatResponseImproved = useCallback((rawResponse) => {
    console.log('📊 Formateando respuesta mejorada:', rawResponse);
    
    const extractedResponse = extractAIResponse(rawResponse);
    
    return {
      response: extractedResponse,
      ai_response: extractedResponse,
      timestamp: new Date().toISOString(),
      success: true,
      error: null,
      fullResponse: rawResponse,
      operationData: rawResponse?.operation_data || null
    };
  }, [extractAIResponse]);

  // Generar userId único
  const initializeUser = useCallback((userId = null) => {
    const newUserId = userId || `legal_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentUserId(newUserId);
    console.log('👤 Usuario inicializado:', newUserId);
    return newUserId;
  }, []);

  // CORREGIDO: Subir contrato solo (operation_type: "upload_only")
  const uploadContractOnly = useCallback(async (file, contractName = '', userId = null) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('📄 Hook: uploadContractOnly iniciado');
      
      // Validaciones del service
      const fileValidation = legalConsultorContratoService.validateFile(file);
      if (!fileValidation.isValid) {
        throw new Error(fileValidation.errors.join(', '));
      }
      
      const nameValidation = legalConsultorContratoService.validateContractName(contractName);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(', '));
      }
      
      // Llamar al service con operation_type correcto
      const response = await legalConsultorContratoService.uploadContractOnly(
        file, 
        contractName.trim(), 
        activeUserId
      );
      
      console.log('📄 Respuesta raw uploadContractOnly:', response);
      
      // USAR FORMATEO MEJORADO
      const formatted = formatResponseImproved(response);
      
      // Verificar si hay error en la respuesta
      if (formatted.error) {
        throw new Error(formatted.error);
      }
      
      setContractData(formatted);
      setSuccess(true);
      setCurrentUserId(activeUserId);
      
      console.log('✅ Contrato subido exitosamente');
      
      return { 
        raw: response, 
        formatted: formatted, 
        userId: activeUserId,
        operationType: 'upload_only'
      };
      
    } catch (err) {
      console.error('❌ Error en uploadContractOnly:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser, formatResponseImproved]);

  // CORREGIDO: Subir contrato + consulta inmediata (operation_type: "upload_and_consult")
  const uploadContractWithQuery = useCallback(async (file, message, contractName = '', userId = null) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('📄💬 Hook: uploadContractWithQuery iniciado');
      
      // Validaciones del service
      const fileValidation = legalConsultorContratoService.validateFile(file);
      if (!fileValidation.isValid) {
        throw new Error(fileValidation.errors.join(', '));
      }
      
      const nameValidation = legalConsultorContratoService.validateContractName(contractName);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(', '));
      }
      
      const messageValidation = legalConsultorContratoService.validateMessage(message);
      if (!messageValidation.isValid) {
        throw new Error(messageValidation.errors.join(', '));
      }
      
      // Llamar al service con operation_type correcto
      const response = await legalConsultorContratoService.uploadContractWithQuery(
        file, 
        message.trim(), 
        contractName.trim(), 
        activeUserId
      );
      
      console.log('📄💬 Respuesta raw uploadContractWithQuery:', response);
      
      // USAR FORMATEO MEJORADO
      const formatted = formatResponseImproved(response);
      
      // Verificar si hay error en la respuesta
      if (formatted.error) {
        throw new Error(formatted.error);
      }
      
      // Agregar al historial como primera consulta
      const newChatEntry = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: formatted.timestamp,
        user_message: message.trim(),
        ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
        type: 'upload_and_consult',
        contract_uploaded: true,
        contract_name: contractName.trim() || file.name.replace('.pdf', ''),
        operation_type: 'upload_and_consult'
      };
      
      setContractData(formatted);
      setChatHistory([newChatEntry]);
      setSuccess(true);
      setCurrentUserId(activeUserId);
      setRepositoryMode(true); // Activar modo repositorio automáticamente
      
      console.log('✅ Contrato subido y consulta procesada');
      
      return { 
        raw: response, 
        formatted: formatted, 
        chatEntry: newChatEntry, 
        userId: activeUserId,
        operationType: 'upload_and_consult'
      };
      
    } catch (err) {
      console.error('❌ Error en uploadContractWithQuery:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser, formatResponseImproved]);

  // CORREGIDO: Enviar consulta al repositorio con manejo de selección
  const sendRepositoryQuery = useCallback(async (message, userId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('💬 Hook: sendRepositoryQuery iniciado');
      console.log('💬 Mensaje:', message);
      console.log('💬 ¿Esperando selección?', awaitingContractSelection);
      
      // Validación del mensaje
      const messageValidation = legalConsultorContratoService.validateMessage(message);
      if (!messageValidation.isValid) {
        throw new Error(messageValidation.errors.join(', '));
      }
      
      // Verificar que no sea un comando
      if (message.trim().startsWith('/')) {
        throw new Error('Los comandos deben enviarse usando executeCommand()');
      }
      
      // Llamar al service con operation_type correcto
      const response = await legalConsultorContratoService.sendChatMessage(
        message.trim(), 
        activeUserId
      );
      
      console.log('💬 Respuesta raw sendRepositoryQuery:', response);
      
      // USAR FORMATEO MEJORADO
      const formatted = formatResponseImproved(response);
      
      // Verificar si hay error en la respuesta
      if (formatted.error) {
        throw new Error(formatted.error);
      }
      
      console.log('📋 Respuesta formateada:', formatted);
      
      // NUEVO: Detectar si estamos esperando selección de contratos
      if (formatted.fullResponse?.awaiting_selection && formatted.fullResponse?.available_contracts) {
        console.log('📋 Esperando selección de contratos');
        
        setAwaitingContractSelection(true);
        setAvailableContractsForSelection(formatted.fullResponse.available_contracts);
        setOriginalQuery(formatted.fullResponse.original_message || message.trim());
        
        const selectionChatEntry = {
          id: `selection_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          timestamp: formatted.timestamp,
          user_message: message.trim(),
          ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
          type: 'contract_selection_list',
          operation_type: 'chat_only',
          requires_selection: true,
          available_contracts: formatted.fullResponse.available_contracts,
          original_query: formatted.fullResponse.original_message || message.trim()
        };
        
        setChatHistory(prev => [...prev, selectionChatEntry]);
        setCurrentUserId(activeUserId);
        setRepositoryMode(true);
        
        return { 
          raw: response, 
          formatted: formatted, 
          chatEntry: selectionChatEntry,
          operationType: 'chat_only',
          requiresSelection: true
        };
      }
      
      // NUEVO: Detectar si es resultado de selección procesada
      if (formatted.fullResponse?.selected_contracts_count > 0) {
        console.log('✅ Resultado de selección procesada');
        
        // Limpiar estado de selección
        setAwaitingContractSelection(false);
        setAvailableContractsForSelection([]);
        setOriginalQuery('');
        
        const resultChatEntry = {
          id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          timestamp: formatted.timestamp,
          user_message: `Selección: ${formatted.fullResponse.user_selection}`,
          ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
          type: 'consultation_with_selection',
          operation_type: 'chat_only',
          selected_contracts: formatted.fullResponse.selected_contracts || [],
          selection_method: formatted.fullResponse.selection_method
        };
        
        setChatHistory(prev => [...prev, resultChatEntry]);
        setCurrentUserId(activeUserId);
        
        return { 
          raw: response, 
          formatted: formatted, 
          chatEntry: resultChatEntry,
          operationType: 'consultation_result'
        };
      }
      
      // NUEVO: Detectar errores de selección
      if (formatted.fullResponse?.selection_error && formatted.fullResponse?.available_contracts) {
        console.log('❌ Error en selección - mostrar contratos de nuevo');
        
        const errorChatEntry = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          timestamp: formatted.timestamp,
          user_message: message.trim(),
          ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
          type: 'selection_error',
          operation_type: 'error',
          available_contracts: formatted.fullResponse.available_contracts
        };
        
        setChatHistory(prev => [...prev, errorChatEntry]);
        
        // Mantener estado de selección activo
        setAwaitingContractSelection(true);
        setAvailableContractsForSelection(formatted.fullResponse.available_contracts);
        
        return { 
          raw: response, 
          formatted: formatted, 
          chatEntry: errorChatEntry,
          operationType: 'selection_error'
        };
      }
      
      // Procesamiento normal (respuesta final o sin selección requerida)
      const newChatEntry = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: formatted.timestamp,
        user_message: message.trim(),
        ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
        type: 'chat_only',
        operation_type: 'chat_only'
      };
      
      setChatHistory(prev => [...prev, newChatEntry]);
      setCurrentUserId(activeUserId);
      setRepositoryMode(true);
      
      console.log('✅ Consulta al repositorio procesada');
      
      return { 
        raw: response, 
        formatted: formatted, 
        chatEntry: newChatEntry,
        operationType: 'chat_only'
      };
      
    } catch (err) {
      console.error('❌ Error en sendRepositoryQuery:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser, awaitingContractSelection, formatResponseImproved]);

  // NUEVA FUNCIÓN: Enviar selección directa (sin webhook)
  const sendContractSelection = useCallback(async (selection, userId = null) => {
    console.log('📋 Hook: sendContractSelection iniciado con:', selection);
    
    try {
      const activeUserId = userId || currentUserId;
      
      // Validar selección
      if (!selection || selection.trim().length === 0) {
        throw new Error('La selección no puede estar vacía');
      }
      
      // Enviar selección como mensaje normal a sendRepositoryQuery
      const result = await sendRepositoryQuery(selection.trim(), activeUserId);
      
      return result;
      
    } catch (err) {
      console.error('❌ Error enviando selección:', err);
      throw err;
    }
  }, [currentUserId, sendRepositoryQuery]);

  // CORREGIDO: Ejecutar comandos administrativos (operation_type: "command")
  const executeCommand = useCallback(async (command, userId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('⚡ Hook: executeCommand iniciado');
      
      // Validaciones del comando
      if (!command || command.trim().length === 0) {
        throw new Error('El comando no puede estar vacío');
      }
      
      if (!command.trim().startsWith('/')) {
        throw new Error('Los comandos deben empezar con "/"');
      }
      
      // Llamar al service con operation_type correcto
      const response = await legalConsultorContratoService.executeCommand(
        command.trim(), 
        activeUserId
      );
      
      console.log('⚡ Respuesta raw executeCommand:', response);
      
      // USAR FORMATEO MEJORADO
      const formatted = formatResponseImproved(response);
      
      // Verificar si hay error en la respuesta
      if (formatted.error) {
        throw new Error(formatted.error);
      }
      
      // Si es comando /list, actualizar lista de contratos disponibles
      if (command.trim() === '/list' && formatted.operationData?.contracts) {
        setAvailableContracts(formatted.operationData.contracts);
        console.log('📋 Lista de contratos actualizada:', formatted.operationData.contracts.length);
      }
      
      const newChatEntry = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: formatted.timestamp,
        user_message: command.trim(),
        ai_response: formatted.response, // RESPUESTA EXTRAÍDA CORRECTAMENTE
        type: 'command',
        command_type: command.trim().split(' ')[0],
        operation_type: 'command'
      };
      
      setChatHistory(prev => [...prev, newChatEntry]);
      setCurrentUserId(activeUserId);
      
      console.log('✅ Comando ejecutado exitosamente');
      
      return { 
        raw: response, 
        formatted: formatted, 
        chatEntry: newChatEntry,
        operationType: 'command'
      };
      
    } catch (err) {
      console.error('❌ Error en executeCommand:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser, formatResponseImproved]);

  // CORREGIDO: Activar modo repositorio (para consultas sin subir archivo)
  const activateRepositoryMode = useCallback(async (userId = null) => {
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('🏛️ Activando modo repositorio...');
      
      setRepositoryMode(true);
      setCurrentUserId(activeUserId);
      
      // Cargar lista de contratos disponibles usando comando /list
      try {
        await executeCommand('/list', activeUserId);
      } catch (listError) {
        console.warn('⚠️ No se pudo cargar la lista de contratos:', listError.message);
        // No lanzar error, solo advertencia
      }
      
      console.log('✅ Modo repositorio activado');
      
      return activeUserId;
    } catch (err) {
      console.error('❌ Error al activar modo repositorio:', err);
      setError(err.message);
      throw err;
    }
  }, [currentUserId, initializeUser, executeCommand]);

  // NUEVAS FUNCIONES: Helpers para selección
  const getSelectionSuggestions = useCallback(() => {
    if (!availableContractsForSelection.length) return [];
    
    return [
      {
        label: 'Todos los contratos',
        value: 'todos',
        description: `Analizar todos los ${availableContractsForSelection.length} contratos`
      },
      {
        label: 'Selección automática',
        value: 'auto',
        description: 'Seleccionar automáticamente los más relevantes'
      },
      {
        label: 'Primeros 3',
        value: '1,2,3',
        description: 'Seleccionar los primeros 3 contratos'
      }
    ];
  }, [availableContractsForSelection]);

  const validateSelection = useCallback((selection) => {
    if (!selection || selection.trim().length === 0) {
      return { isValid: false, error: 'La selección no puede estar vacía' };
    }
    
    const trimmed = selection.trim().toLowerCase();
    
    // Validar palabras clave
    if (['todos', 'auto', 'all'].includes(trimmed)) {
      return { isValid: true };
    }
    
    // Validar números
    const numberPattern = /^(\d+)(\s*,\s*\d+)*$/;
    if (numberPattern.test(selection.trim())) {
      const numbers = selection.trim().split(',').map(n => parseInt(n.trim()));
      const maxIndex = availableContractsForSelection.length;
      
      if (numbers.some(n => n < 1 || n > maxIndex)) {
        return { 
          isValid: false, 
          error: `Los números deben estar entre 1 y ${maxIndex}` 
        };
      }
      
      return { isValid: true };
    }
    
    return { 
      isValid: false, 
      error: 'Formato inválido. Usa números (1,3,5), "todos" o "auto"' 
    };
  }, [availableContractsForSelection]);

  // Funciones auxiliares
  const getFileInfo = useCallback((file) => {
    try {
      return legalConsultorContratoService.getFileInfo(file);
    } catch (err) {
      console.error('Error al obtener info del archivo:', err);
      return null;
    }
  }, []);

  const validateFile = useCallback((file) => {
    try {
      return legalConsultorContratoService.validateFile(file);
    } catch (err) {
      console.error('Error al validar archivo:', err);
      return { isValid: false, errors: [err.message] };
    }
  }, []);

  // NUEVO: Validar datos de entrada
  const validateInput = useCallback((file, message, contractName, operationType) => {
    const errors = [];
    
    // Validar según tipo de operación
    switch (operationType) {
      case 'upload_only':
        if (!file) errors.push('Archivo PDF requerido');
        if (!contractName?.trim()) errors.push('Nombre del contrato requerido');
        break;
        
      case 'upload_and_consult':
        if (!file) errors.push('Archivo PDF requerido');
        if (!contractName?.trim()) errors.push('Nombre del contrato requerido');
        if (!message?.trim()) errors.push('Consulta requerida');
        break;
        
      case 'chat_only':
        if (!message?.trim()) errors.push('Mensaje requerido');
        if (message?.trim().startsWith('/')) errors.push('Use executeCommand para comandos');
        break;
        
      case 'command':
        if (!message?.trim()) errors.push('Comando requerido');
        if (!message?.trim().startsWith('/')) errors.push('Los comandos deben empezar con "/"');
        break;
        
      default:
        errors.push('Tipo de operación no válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Obtener resumen de la sesión
  const getSessionSummary = useCallback(() => {
    return {
      userId: currentUserId,
      repositoryMode: repositoryMode,
      contractData: contractData,
      totalMessages: chatHistory.length,
      availableContracts: availableContracts.length,
      lastMessage: chatHistory[chatHistory.length - 1] || null,
      sessionActive: !!currentUserId,
      lastActivity: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].timestamp : null,
      awaitingSelection: awaitingContractSelection,
      selectionContracts: availableContractsForSelection.length
    };
  }, [currentUserId, repositoryMode, contractData, chatHistory, availableContracts, awaitingContractSelection, availableContractsForSelection]);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setContractData(null);
    console.log('🧹 Estados limpiados');
  }, []);

  // Resetear sesión completa
  const resetSession = useCallback(() => {
    clearStates();
    setCurrentUserId(null);
    setChatHistory([]);
    setRepositoryMode(false);
    setAvailableContracts([]);
    // Limpiar estados de selección
    setAwaitingContractSelection(false);
    setAvailableContractsForSelection([]);
    setOriginalQuery('');
    console.log('🔄 Sesión reseteda completamente');
  }, [clearStates]);

  return {
    // Estados principales
    isLoading,
    error,
    success,
    contractData,
    chatHistory,
    currentUserId,
    repositoryMode,
    availableContracts,
    
    // NUEVOS estados para selección
    awaitingContractSelection,
    availableContractsForSelection,
    originalQuery,
    
    // Funciones principales (CORREGIDAS con operation_type)
    uploadContractOnly,        // operation_type: "upload_only"
    uploadContractWithQuery,   // operation_type: "upload_and_consult" 
    sendRepositoryQuery,       // operation_type: "chat_only" - MODIFICADA
    executeCommand,            // operation_type: "command"
    activateRepositoryMode,
    
    // NUEVAS funciones
    sendContractSelection,
    getSelectionSuggestions,
    validateSelection,
    
    // Funciones auxiliares
    initializeUser,
    getFileInfo,
    validateFile,
    validateInput,
    clearStates,
    getSessionSummary,
    resetSession,
    
    // NUEVA función auxiliar
    extractAIResponse,
    formatResponseImproved
  };
};

export default useLegalConsultorContratoFlow;