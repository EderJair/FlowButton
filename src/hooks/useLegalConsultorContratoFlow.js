// ==========================================
// 2. useLegalConsultorContratoFlow.js - ADAPTADO
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
  const [repositoryMode, setRepositoryMode] = useState(false); // Nuevo: modo repositorio
  const [availableContracts, setAvailableContracts] = useState([]); // Nuevo: contratos disponibles

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setContractData(null);
    setChatHistory([]);
  }, []);

  // Generar userId único
  const initializeUser = useCallback((userId = null) => {
    const newUserId = userId || `legal_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentUserId(newUserId);
    return newUserId;
  }, []);

  // Subir contrato solo (sin consulta)
  const uploadContractOnly = useCallback(async (file, contractName = '', userId = null) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      const validation = legalConsultorContratoService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      console.log('📄 Subiendo contrato solo:', file.name);
      
      const response = await legalConsultorContratoService.uploadContractOnly(
        file, 
        contractName, 
        activeUserId
      );
      
      const formatted = legalConsultorContratoService.formatResponse(response);
      
      setContractData(formatted);
      setSuccess(true);
      setCurrentUserId(activeUserId);
      
      return { raw: response, formatted: formatted, userId: activeUserId };
      
    } catch (err) {
      console.error('❌ Error al subir contrato:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser]);

  // Subir contrato + consulta inmediata
  const uploadContractWithQuery = useCallback(async (file, message, contractName = '', userId = null) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      const validation = legalConsultorContratoService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      
      console.log('📄💬 Subiendo contrato con consulta:', file.name);
      
      const response = await legalConsultorContratoService.uploadContractWithQuery(
        file, 
        message, 
        contractName, 
        activeUserId
      );
      
      const formatted = legalConsultorContratoService.formatResponse(response);
      
      // Agregar al historial como primera consulta
      const newChatEntry = {
        id: Date.now(),
        timestamp: formatted.timestamp,
        user_message: message,
        ai_response: formatted.response,
        type: 'upload_and_consult',
        contract_uploaded: true,
        contract_name: contractName || file.name
      };
      
      setContractData(formatted);
      setChatHistory([newChatEntry]);
      setSuccess(true);
      setCurrentUserId(activeUserId);
      setRepositoryMode(true); // Activar modo repositorio
      
      return { raw: response, formatted: formatted, chatEntry: newChatEntry, userId: activeUserId };
      
    } catch (err) {
      console.error('❌ Error al subir contrato con consulta:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser]);

  // Enviar consulta al repositorio
  const sendRepositoryQuery = useCallback(async (message, userId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log('💬 Enviando consulta al repositorio:', message);
      
      const response = await legalConsultorContratoService.sendChatMessage(message, activeUserId);
      const formatted = legalConsultorContratoService.formatResponse(response);
      
      const newChatEntry = {
        id: Date.now(),
        timestamp: formatted.timestamp,
        user_message: message,
        ai_response: formatted.response,
        type: 'repository_consultation',
        operation_type: formatted.operationType
      };
      
      setChatHistory(prev => [...prev, newChatEntry]);
      setCurrentUserId(activeUserId);
      setRepositoryMode(true);
      
      return { raw: response, formatted: formatted, chatEntry: newChatEntry };
      
    } catch (err) {
      console.error('❌ Error en consulta al repositorio:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser]);

  // Ejecutar comandos administrativos
  const executeCommand = useCallback(async (command, userId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      
      console.log(`⚡ Ejecutando comando: ${command}`);
      
      const response = await legalConsultorContratoService.executeCommand(command, activeUserId);
      const formatted = legalConsultorContratoService.formatResponse(response);
      
      // Si es comando /list, actualizar lista de contratos disponibles
      if (command === '/list' && formatted.fullResponse.operation_data) {
        setAvailableContracts(formatted.fullResponse.operation_data.contracts || []);
      }
      
      const newChatEntry = {
        id: Date.now(),
        timestamp: formatted.timestamp,
        user_message: command,
        ai_response: formatted.response,
        type: 'command_execution',
        command_type: command.split(' ')[0]
      };
      
      setChatHistory(prev => [...prev, newChatEntry]);
      setCurrentUserId(activeUserId);
      
      return { raw: response, formatted: formatted, chatEntry: newChatEntry };
      
    } catch (err) {
      console.error('❌ Error al ejecutar comando:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, initializeUser]);

  // Activar modo repositorio (para consultas sin subir archivo)
  const activateRepositoryMode = useCallback(async (userId = null) => {
    try {
      const activeUserId = userId || currentUserId || initializeUser();
      setRepositoryMode(true);
      setCurrentUserId(activeUserId);
      
      // Cargar lista de contratos disponibles
      await executeCommand('/list', activeUserId);
      
      return activeUserId;
    } catch (err) {
      console.error('Error al activar modo repositorio:', err);
      setError(err.message);
    }
  }, [currentUserId, initializeUser, executeCommand]);

  // Funciones auxiliares (sin cambios)
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

  // Obtener resumen de la sesión
  const getSessionSummary = useCallback(() => {
    return {
      userId: currentUserId,
      repositoryMode: repositoryMode,
      contractData: contractData,
      totalMessages: chatHistory.length,
      availableContracts: availableContracts.length,
      lastMessage: chatHistory[chatHistory.length - 1] || null,
      sessionActive: !!currentUserId
    };
  }, [currentUserId, repositoryMode, contractData, chatHistory, availableContracts]);

  const resetSession = useCallback(() => {
    clearStates();
    setCurrentUserId(null);
    setChatHistory([]);
    setRepositoryMode(false);
    setAvailableContracts([]);
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
    
    // Funciones principales (adaptadas)
    uploadContractOnly,
    uploadContractWithQuery,
    sendRepositoryQuery,
    executeCommand,
    activateRepositoryMode,
    
    // Funciones auxiliares
    initializeUser,
    getFileInfo,
    validateFile,
    clearStates,
    getSessionSummary,
    resetSession
  };
};

export default useLegalConsultorContratoFlow;