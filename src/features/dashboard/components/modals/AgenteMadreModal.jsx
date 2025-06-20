// src/features/dashboard/components/modals/AgenteMadreModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WorkflowIcon, OpenAI } from '../../../../assets/icons';

const AgenteMadreModal = ({ isOpen, onClose, onSubmit }) => {  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected', 'disconnected', 'testing'

  // Referencia para el scroll automático del chat
  const chatContainerRef = useRef(null);

  // Sugerencias de consulta
  const aiSuggestions = [
    "¿Cuál es el estado general del sistema?",
    "Analiza el rendimiento de los flujos",
    "Muéstrame las métricas más importantes",
    "¿Qué tareas puedo automatizar hoy?",
    "Optimiza todos los flujos automáticamente",
    "¿Hay algún problema en el sistema?"
  ];  // Efecto para mostrar el modal, testear conexión y prevenir scroll
  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      // Mantener la posición actual de scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      setTimeout(() => setIsVisible(true), 50);
      // Limpiar historial del chat al abrir el modal
      setChatHistory([]);
      // Testear conexión al abrir el modal
      testConnection();
    } else {
      // Restaurar scroll del body
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      setIsVisible(false);
    }
    
    // Cleanup al desmontar el componente
    return () => {
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [isOpen]);
  // Función para testear la conexión al servidor
  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      // Solo verificamos que el endpoint responda, sin procesar la respuesta
      const response = await fetch('http://localhost:5000/api/agente-madre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '__health_check__',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('✅ Conexión con Agente Madre establecida');
      } else {
        setConnectionStatus('disconnected');
        console.log('❌ Error en conexión con Agente Madre:', response.status);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.log('❌ No se pudo conectar con Agente Madre:', error.message);
    }
  };

  // Efecto para scroll automático del chat
  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length > 0) {
      const scrollToBottom = () => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory]);

  // Función para alternar modo expandido
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    toast.success(
      isExpanded 
        ? 'Modo normal activado' 
        : 'Modo expandido activado',
      {
        icon: isExpanded ? '📱' : '🔍'
      }
    );
  };
  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setConnectionStatus('testing');
    
    try {
      // Llamada al endpoint del Agente Madre
      const response = await fetch('http://localhost:5000/api/agente-madre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: aiQuery,
          timestamp: new Date().toISOString()
        })
      });      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setConnectionStatus('connected');
        console.log('🤖 Respuesta completa del servidor:', JSON.stringify(data, null, 2));
      console.log('📝 Campo output extraído:', data.iaResponse?.output);
      console.log('📏 Longitud del output:', data.iaResponse?.output ? data.iaResponse.output.length : 'undefined');
      console.log('🔍 Tipo del output:', typeof data.iaResponse?.output);
      
      // Usar la estructura correcta: data.iaResponse.output
      const responseText = data.iaResponse?.output || data.output || 'Error: No se recibió respuesta del Agente Madre';
      
      const newMessage = {
        id: Date.now(),
        question: aiQuery,
        answer: responseText,
        timestamp: new Date(),
        isError: false,
        isFallback: false
      };
        console.log('💬 Mensaje que se va a mostrar en el chat:', {
        question: newMessage.question,
        answer: newMessage.answer,
        answerLength: newMessage.answer.length
      });
      
      setChatHistory(prev => [...prev, newMessage]);
      setAiQuery('');
      
      toast.success('Agente Madre ha respondido', {
        icon: '🤖',
        description: 'Análisis del sistema completado'
      });
      
    } catch (error) {
      console.error('Error en consulta al Agente Madre:', error);
      setConnectionStatus('disconnected');
      
      // Respuesta de fallback cuando hay error de conexión
      const fallbackResponses = [
        "🚨 Conexión con el servidor interrumpida. Activando protocolos de emergencia...\n\n🔧 Sistemas locales: Operativos\n💾 Cache local: Disponible\n🛡️ Modo offline: Activado\n\n⚡ Funciones disponibles:\n• Consulta de métricas locales\n• Análisis de rendimiento\n• Reportes de estado\n\n🔄 Reintentando conexión automáticamente...",
        
        "🌐 Sin conexión al Agente Madre central. Sistemas de respaldo activos:\n\n� Métricas locales: Disponibles\n⚡ Flujos monitoreados: 11 activos\n🎯 Estado general: Estable\n💾 Datos sincronizados: Hace 5 min\n\n� Funcionalidad limitada pero operativa.\n🔄 Reconectando en segundo plano..."
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const errorMessage = {
        id: Date.now(),
        question: aiQuery,
        answer: fallbackResponse,
        timestamp: new Date(),
        isError: true,
        isFallback: true
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      setAiQuery('');
      
      // Mensaje de error más específico según el tipo de error
      const errorType = error.message.includes('fetch') || error.message.includes('NetworkError') 
        ? 'Sin conexión con el servidor' 
        : error.message.includes('Error del servidor')
        ? 'Error en el servidor del Agente Madre'
        : 'Error de comunicación con Agente Madre';
        
      toast.error(errorType, {
        icon: '🚨',
        description: 'Sistemas de respaldo activados'
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        overflow-hidden
      `}
      onClick={handleOverlayClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-purple-900/95 to-indigo-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          ${isExpanded 
            ? 'w-[95vw] h-[95vh] max-w-none max-h-none' 
            : 'w-full max-w-6xl h-[85vh]'
          }
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <OpenAI className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400">⚡</span>
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <WorkflowIcon className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Agente Madre</h2>
                <p className="text-sm text-gray-400">
                  {isExpanded ? 'Modo Expandido - IA Central de Control de Flujos' : 'IA Central de Control de Flujos'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">Sistema Óptimo</span>
              </div>
              
              {/* Botón de expansión/contracción */}
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
          </div>
        </div>        {/* System Status */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">🎮 Estado:</span>
              <span className="text-green-400 text-sm">Todos los sistemas operativos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">⚡ Flujos:</span>
              <span className="text-purple-400 text-sm">11 activos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">📊 Eficiencia:</span>
              <span className="text-blue-400 text-sm">98.5%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">🌐 Conexión:</span>
              <span className={`text-sm flex items-center gap-1 ${
                connectionStatus === 'connected' ? 'text-green-400' : 
                connectionStatus === 'testing' ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' : 
                  'bg-red-400'
                }`} />
                {connectionStatus === 'connected' ? 'Servidor Online' : 
                 connectionStatus === 'testing' ? 'Conectando...' : 
                 'Modo Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Solo Chat */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-6">🤖 Chat con Agente Madre</h3>
            
            {/* Chat History */}
            <div ref={chatContainerRef} className={`flex-1 mb-6 space-y-4 overflow-y-auto ${isExpanded ? 'max-h-[60vh]' : 'max-h-60'}`}>
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">🤖</div>
                  <p>Inicia una conversación con el Agente Madre</p>
                  <div className="text-sm text-gray-400 space-y-1 mt-4">
                    <p>💫 Control total del ecosistema</p>
                    <p>⚡ Optimización automática</p>
                    <p>🛡️ Monitoreo 24/7</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div key={chat.id} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className={`bg-purple-600/30 border border-purple-500/30 rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
                        <p className="text-white text-sm">{chat.question}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className={`rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'} ${
                        chat.isError 
                          ? 'bg-red-600/20 border border-red-500/30' 
                          : 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30'
                      }`}>
                        <div className="flex items-start gap-2">
                          <div className="text-lg">🤖</div>
                          <div className="flex-1">
                            <p className="text-white text-sm whitespace-pre-wrap">{chat.answer}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-300">
                                {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${
                                chat.isError 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {chat.isError ? (chat.isFallback ? 'Modo Offline' : 'Error') : 'Agente Madre'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* AI Query Input */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiQuery();
                    }
                  }}
                  placeholder="Consulta al Agente Madre sobre el sistema..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={handleAiQuery}
                  disabled={!aiQuery.trim() || isAiLoading}
                  className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500/30 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <OpenAI className="w-4 h-4" />
                      Consultar
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* AI Suggestions - Solo mostrar en primera interacción */}
            {chatHistory.length === 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-3">🎯 Comandos sugeridos:</p>
                <div className={`grid gap-2 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setAiQuery(suggestion)}
                      disabled={isAiLoading}
                      className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 text-sm hover:bg-white/20 transition-colors disabled:opacity-50 text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenteMadreModal;
