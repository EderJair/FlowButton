// src/features/dashboard/components/modals/LegalConsultantModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { OpenAI, DocumentCheckIcon } from '../../../../assets/icons';
import { api } from '../../../../services/api';

const LegalConsultantModal = ({ isOpen, onClose, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  const [isExpanded, setIsExpanded] = useState(false); // 🔍 Estado para modo expandido
  const [sessionId, setSessionId] = useState(''); // 💾 ID único para la sesión
  const [timeRemaining, setTimeRemaining] = useState(600); // ⏰ 10 minutos en segundos
  const [isRestoredSession, setIsRestoredSession] = useState(false); // 🔄 Indica si es sesión restaurada
  const messagesEndRef = useRef(null);
  const storageTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
    // 💾 Configuración de almacenamiento temporal
  const STORAGE_DURATION = 10 * 60 * 1000; // 10 minutos en millisegundos
  const STORAGE_KEY_PREFIX = 'legal_chat_';

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);  // Efecto para mostrar el modal y mantener scroll habilitado
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      // 💾 NO limpiar mensajes al cerrar - mantener para restauración
      // Solo limpiar el input
      setTimeout(() => {
        setInputMessage('');
      }, 300);
    }
  }, [isOpen]);

  // 🔍 Función para alternar modo expandido
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    toast.success(
      isExpanded 
        ? 'Modo normal activado' 
        : 'Modo expandido activado',
      {
        icon: isExpanded ? '📱' : '🔍'
      }
    );  };

  // 💾 Funciones de almacenamiento temporal
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveMessagesToStorage = (messages, sessionId) => {
    try {
      const data = {
        messages,
        timestamp: Date.now(),
        expiresAt: Date.now() + STORAGE_DURATION
      };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(data));
      console.log('💾 Conversación guardada temporalmente:', sessionId);
    } catch (error) {
      console.warn('⚠️ Error guardando conversación:', error);
    }
  };
  const loadMessagesFromStorage = (sessionId) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Verificar si la conversación ha expirado
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
        console.log('🗑️ Conversación expirada eliminada:', sessionId);
        return null;
      }

      // 🔧 CORREGIR: Convertir timestamps de vuelta a objetos Date
      if (data.messages && Array.isArray(data.messages)) {
        data.messages = data.messages.map(message => ({
          ...message,
          timestamp: message.timestamp instanceof Date 
            ? message.timestamp 
            : new Date(message.timestamp)
        }));
      }

      console.log('📥 Conversación cargada desde storage con timestamps corregidos:', sessionId);
      return data;
    } catch (error) {
      console.warn('⚠️ Error cargando conversación:', error);
      return null;
    }
  };
  const clearExpiredConversations = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            if (Date.now() > data.expiresAt) {
              localStorage.removeItem(key);
              console.log('🗑️ Conversación expirada eliminada:', key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('⚠️ Error limpiando conversaciones expiradas:', error);
    }
  };

  const findMostRecentValidSession = () => {
    try {
      const keys = Object.keys(localStorage);
      let mostRecentSession = null;
      let mostRecentTime = 0;      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            
            // Verificar si la sesión sigue válida
            if (Date.now() < data.expiresAt && data.timestamp > mostRecentTime) {
              // 🔧 CORREGIR: Convertir timestamps de vuelta a objetos Date
              if (data.messages && Array.isArray(data.messages)) {
                data.messages = data.messages.map(message => ({
                  ...message,
                  timestamp: message.timestamp instanceof Date 
                    ? message.timestamp 
                    : new Date(message.timestamp)
                }));
              }
              
              mostRecentTime = data.timestamp;
              mostRecentSession = {
                sessionId: key.replace(STORAGE_KEY_PREFIX, ''),
                data: data
              };
            }
          }
        }
      });

      return mostRecentSession;
    } catch (error) {
      console.warn('⚠️ Error buscando sesión válida:', error);
      return null;
    }
  };

  const startCountdownTimer = () => {
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 🔧 Función auxiliar para formatear timestamps de manera segura
  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) return 'Ahora';
      
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      
      // Verificar si es una fecha válida
      if (isNaN(date.getTime())) return 'Ahora';
      
      return date.toLocaleTimeString();
    } catch (error) {
      console.warn('⚠️ Error formateando timestamp:', error);
      return 'Ahora';
    }
  };
  // 💾 Efecto para manejar el almacenamiento temporal
  useEffect(() => {
    if (isOpen) {
      // Limpiar conversaciones expiradas al abrir
      clearExpiredConversations();
      
      // Buscar sesión existente válida
      const existingSession = findMostRecentValidSession();
        if (existingSession) {
        // 🔄 RESTAURAR SESIÓN EXISTENTE
        console.log('🔄 Restaurando sesión existente:', existingSession.sessionId);
        
        setSessionId(existingSession.sessionId);
        setMessages(existingSession.data.messages);
        setIsRestoredSession(true); // 🔄 Marcar como sesión restaurada
        
        // Calcular tiempo restante basado en la expiración
        const timeLeft = Math.max(0, Math.floor((existingSession.data.expiresAt - Date.now()) / 1000));
        setTimeRemaining(timeLeft);
        
        // Solo iniciar countdown si queda tiempo
        if (timeLeft > 0) {
          startCountdownTimer();
          
          // Configurar timer para eliminar cuando expire
          storageTimerRef.current = setTimeout(() => {
            localStorage.removeItem(`${STORAGE_KEY_PREFIX}${existingSession.sessionId}`);
            console.log('🗑️ Conversación eliminada por timeout:', existingSession.sessionId);
            toast.info('⏰ La conversación ha expirado y fue eliminada', {
              icon: '🗑️'
            });
          }, timeLeft * 1000);
        } else {
          // Si no queda tiempo, eliminar la sesión
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${existingSession.sessionId}`);
          console.log('🗑️ Sesión expirada eliminada inmediatamente');
        }
        
        toast.success('🔄 Conversación anterior restaurada', {
          description: `Quedan ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} minutos`,
          icon: '💾'
        });
          } else {
        // 🆕 CREAR NUEVA SESIÓN
        console.log('🆕 Creando nueva sesión');
        
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setTimeRemaining(600); // Reset a 10 minutos
        setIsRestoredSession(false); // 🆕 Marcar como sesión nueva
        
        // Configurar mensaje inicial solo para nuevas sesiones
        setMessages([{
          id: 1,
          type: 'assistant',
          content: '👨‍⚖️ ¡Hola! Soy tu Asistente Legal Inteligente. Puedo ayudarte con consultas jurídicas, análisis de contratos, interpretación de leyes y asesoramiento legal general. ¿En qué puedo asistirte hoy?',
          timestamp: new Date()
        }]);
        
        // Iniciar timer de countdown
        startCountdownTimer();
        
        // Configurar timer para eliminar conversación después del tiempo límite
        storageTimerRef.current = setTimeout(() => {
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${newSessionId}`);
          console.log('🗑️ Conversación eliminada por timeout:', newSessionId);
          toast.info('⏰ La conversación ha expirado y fue eliminada', {
            icon: '🗑️'
          });
        }, STORAGE_DURATION);
        
        console.log('💾 Nueva sesión iniciada:', newSessionId);
      }
      
    } else {
      // Limpiar timers al cerrar PERO NO LIMPIAR MENSAJES
      if (storageTimerRef.current) {
        clearTimeout(storageTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    }

    return () => {
      if (storageTimerRef.current) {
        clearTimeout(storageTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isOpen]);

  // 💾 Efecto para guardar mensajes cuando cambien
  useEffect(() => {
    if (sessionId && messages.length > 1) { // Solo guardar si hay más que el mensaje inicial
      saveMessagesToStorage(messages, sessionId);
    }
  }, [messages, sessionId]);

  // 🚀 ENVIAR CONSULTA AL BACKEND ENDPOINT - CONSUMIR /api/lawyer-consult
  // 🔧 CORREGIDO: Ahora extrae correctamente iaResponse.output del backend
  const sendToLegalAI = async (userMessage) => {
    try {
      console.log('� Enviando consulta legal al backend:', userMessage);
      
      // Estructura de payload esperada por el backend
      const payload = { 
        message: userMessage,
        userContext: {
          timestamp: new Date().toISOString(),
          user_id: 'user_' + Date.now(),
          source: 'flowbutton_frontend',
          session_id: `session_${Date.now()}`
        },
        consultationType: 'legal_advice'
      };

      console.log('📋 Payload enviado:', payload);
      
      // 🎯 LLAMADA AL ENDPOINT EXISTENTE (NO CREAR BACKEND)
      const data = await api.post('/lawyer-consult', payload);

      console.log('📋 Respuesta completa del backend:', JSON.stringify(data, null, 2));
      console.log('🔍 Tipo de respuesta:', typeof data);
      console.log('🔍 Es array:', Array.isArray(data));
      console.log('🔍 Claves disponibles:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        // 🔍 PARSING ESPECÍFICO PARA BACKEND ABOGADO - BUSCAR iaResponse.output
      console.log('🔍 Analizando respuesta del backend...');
      
      // Caso 1: Respuesta con estructura { success: true, data: {...} }
      if (data && data.success && data.data) {
        console.log('📊 Estructura success/data detectada');
        
        // 🎯 BUSCAR ESPECÍFICAMENTE iaResponse.output
        if (data.data.iaResponse && data.data.iaResponse.output) {
          console.log('✅ Encontrado iaResponse.output:', data.data.iaResponse.output);
          return data.data.iaResponse.output;
        }
        
        // Fallback a otros campos en data
        const aiResponse = data.data.response || data.data.message || data.data.content || data.data.answer;
        if (aiResponse) {
          console.log('✅ Respuesta extraída de data.data:', aiResponse);
          return aiResponse;
        }
        
        // Si data.data es string directo
        if (typeof data.data === 'string') {
          console.log('✅ Respuesta directa como string:', data.data);
          return data.data;
        }
      }
      
      // Caso 2: Respuesta directa con iaResponse en el nivel raíz
      if (data && data.iaResponse && data.iaResponse.output) {
        console.log('✅ Encontrado iaResponse.output en nivel raíz:', data.iaResponse.output);
        return data.iaResponse.output;
      }
      
      // Caso 3: Respuesta directa sin wrapper success
      if (data && typeof data === 'object') {
        const directResponse = data.response || data.message || data.content || data.answer || data.result;
        if (directResponse) {
          console.log('✅ Respuesta directa del objeto:', directResponse);
          return directResponse;
        }
      }
      
      // Caso 4: Respuesta como string puro
      if (typeof data === 'string') {
        console.log('✅ Respuesta como string puro:', data);
        return data;
      }
      
      // Caso 5: Array con respuestas (para casos especiales de N8N)
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        
        // Buscar iaResponse.output en array
        if (firstItem && firstItem.iaResponse && firstItem.iaResponse.output) {
          console.log('✅ Encontrado iaResponse.output en array:', firstItem.iaResponse.output);
          return firstItem.iaResponse.output;
        }
        
        if (typeof firstItem === 'string') {
          return firstItem;
        } else if (firstItem && typeof firstItem === 'object') {
          const arrayResponse = firstItem.response || firstItem.message || firstItem.content;
          if (arrayResponse) {
            return arrayResponse;
          }
        }
      }
      
      console.warn('⚠️ No se encontró iaResponse.output, usando respuesta genérica');
      return "✅ Tu consulta ha sido procesada por el abogado consultor. La respuesta está siendo generada.";
      
    } catch (error) {
      console.error('❌ Error completo consultando IA legal:', error);
      
      // Manejo específico de errores HTTP/red
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🔌 No se pudo conectar con el servicio legal. Verifica tu conexión a internet.');
      } else if (error.message.includes('404')) {
        throw new Error('🔍 Endpoint legal no encontrado. Contacta al administrador del sistema.');
      } else if (error.message.includes('500')) {
        throw new Error('⚙️ Error interno del servidor legal. Intenta nuevamente en unos momentos.');
      } else if (error.message.includes('503')) {
        throw new Error('🔧 Servicio legal temporalmente no disponible. Intenta más tarde.');
      } else if (error.message.includes('429')) {
        throw new Error('⏱️ Demasiadas consultas. Espera un momento antes de volver a intentar.');
      } else if (error.message.includes('400')) {
        throw new Error('📝 Error en la consulta enviada. Verifica el mensaje e intenta nuevamente.');
      } else if (error.message.includes('401')) {
        throw new Error('🔐 Error de autorización. Verifica tu sesión.');
      } else {
        throw new Error(`⚖️ Error al procesar consulta legal: ${error.message}`);
      }
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Obtener respuesta de la IA
      const aiResponse = await sendToLegalAI(userMessage.content);
      
      // Agregar respuesta del asistente
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      toast.error('Error en consulta legal', {
        description: error.message,
        icon: '⚖️'
      });
      
      // Mensaje de error del asistente
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '❌ Disculpa, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejemplos de consultas rápidas
  const quickQuestions = [
    "¿Cómo redactar un contrato de trabajo?",
    "¿Cuáles son mis derechos como consumidor?",
    "¿Qué es un poder notarial?",
    "¿Cómo hacer un testamento?",
    "¿Qué hacer en caso de accidente laboral?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        bg-black/50 backdrop-blur-sm
        p-4
      `}
      onClick={handleOverlayClick}
    >
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          ${isExpanded 
            ? 'w-[95vw] h-[95vh] max-w-none max-h-none' 
            : 'w-full max-w-4xl h-[80vh] max-h-[600px]'
          }
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <OpenAI className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400">+</span>
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <DocumentCheckIcon className="w-5 h-5 text-amber-400" />
                </div>
              </div>              <div>
                <h2 className="text-xl font-bold text-white">Abogado Consultor</h2>
                <p className="text-sm text-gray-400">
                  {isExpanded ? 'Modo Expandido - Consultoría legal inteligente con IA' : 'Consultoría legal inteligente con IA'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">IA Legal Online</span>
              </div>
              
              {/* 🔍 Botón de expansión/contracción */}
              <button
                onClick={toggleExpanded}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 group"
                title={isExpanded ? "Contraer ventana" : "Expandir ventana"}
              >
                {isExpanded ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m5.5 11v4.5M9 20H4.5M9 20l-5.5 5.5m11-5.5v4.5m0-4.5H19.5m-4.5 4.5l5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>        </div>        {/* 💾 Notificación de almacenamiento temporal */}
        <div className={`px-6 py-3 border-b flex items-center justify-between ${
          isRestoredSession 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isRestoredSession 
                ? 'bg-green-500/20' 
                : 'bg-amber-500/20'
            }`}>
              <span className="text-xs">{isRestoredSession ? '�' : '�💾'}</span>
            </div>
            <div>
              <p className={`text-sm ${
                isRestoredSession ? 'text-green-200' : 'text-amber-200'
              }`}>
                <span className="font-medium">
                  {isRestoredSession ? 'Conversación restaurada' : 'Conversación temporal'}
                </span> - {isRestoredSession ? 'Continuando sesión anterior' : 'Se guardará por tiempo limitado'}
              </p>
              <p className={`text-xs ${
                isRestoredSession ? 'text-green-300/80' : 'text-amber-300/80'
              }`}>
                ID: {sessionId.slice(-8)} {isRestoredSession && '(restaurada)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className={`text-xs ${
                isRestoredSession ? 'text-green-300' : 'text-amber-300'
              }`}>⏰</span>
              <span className={`text-sm font-mono ${
                isRestoredSession ? 'text-green-200' : 'text-amber-200'
              }`}>
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
            <div className={`text-xs ${
              isRestoredSession ? 'text-green-300/60' : 'text-amber-300/60'
            }`}>restante</div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >                <div
                  className={`
                    rounded-lg p-4 break-words overflow-hidden
                    ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'}
                    ${message.type === 'user' 
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100' 
                      : 'bg-white/10 border border-white/20 text-gray-100'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {message.type === 'assistant' && (
                      <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">⚖️</span>
                      </div>
                    )}                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                        {message.content}
                      </p>                      <span className="text-xs opacity-60 mt-2 block">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`bg-white/10 border border-white/20 rounded-lg p-4 break-words overflow-hidden ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">⚖️</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-3">Consultas frecuentes:</p>
              <div className={`grid gap-2 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 text-sm hover:bg-white/20 transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-6 border-t border-white/10 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu consulta legal aquí..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-blue-500/30 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    Enviar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalConsultantModal;
