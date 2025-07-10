// src/features/dashboard/components/modals/AgenteSegurosModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Shield, Car, Home, Heart, Building, Phone, DollarSign } from 'lucide-react';

const AgenteSegurosModal = ({ isOpen, onClose, onSubmit }) => {
  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [clientProfile, setClientProfile] = useState({
    nombre: '',
    edad: '',
    ubicacion: 'Lima, Perú',
    tipoSeguro: '',
    presupuesto: ''
  });

  // Referencia para el scroll automático del chat
  const chatContainerRef = useRef(null);

  // Sugerencias especializadas en seguros
  const insuranceSuggestions = [
    "Quiero cotizar un seguro de auto",
    "Necesito información sobre seguros de salud",
    "¿Cuánto cuesta un seguro de vida?",
    "Compara seguros de hogar en Lima",
    "Seguro para mi negocio pequeño",
    "¿Qué aseguradora me conviene más?"
  ];

  // Tipos de seguro con iconos
  const insuranceTypes = [
    { id: 'auto', name: 'Seguro de Auto', icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { id: 'hogar', name: 'Seguro de Hogar', icon: Home, color: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 'salud', name: 'Seguro de Salud', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 'vida', name: 'Seguro de Vida', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'negocio', name: 'Seguro de Negocio', icon: Building, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  ];

  // Efecto para mostrar el modal y testear conexión
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
      setChatHistory([]);
      testConnection();
      // Mensaje de bienvenida automático
      setTimeout(() => {
        addWelcomeMessage();
      }, 1000);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Mensaje de bienvenida del agente
  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      question: null,
      answer: `¡Hola! 👋 Soy tu Asesor Virtual de Seguros especializado en el mercado peruano.

🛡️ **Te puedo ayudar con:**
• Cotizar seguros personalizados
• Comparar diferentes aseguradoras (Rímac, Pacífico, La Positiva)
• Explicar coberturas y beneficios
• Procesar tu contratación
• Resolver todas tus dudas sobre seguros

💡 **¿Qué necesitas hoy?**
Puedes decirme algo como:
• "Quiero cotizar un seguro de auto para mi Honda Civic"
• "Necesito información sobre seguros de salud en Lima"
• "Compara seguros de hogar en mi zona"
• "¿Cuánto cuesta un seguro de vida para 35 años?"

¿En qué te puedo ayudar? 😊`,
      timestamp: new Date(),
      isError: false,
      isWelcome: true
    };
    setChatHistory([welcomeMessage]);
  };

  // Función para testear la conexión al servidor N8N
  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch('https://n8n-jose.up.railway.app/webhook/chat-seguros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '__health_check__',
          clienteId: 'health_check',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('✅ Conexión con Agente de Seguros establecida');
      } else {
        setConnectionStatus('disconnected');
        console.log('❌ Error en conexión:', response.status);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.log('❌ No se pudo conectar:', error.message);
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

  // Función principal para enviar mensaje al agente
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setConnectionStatus('testing');
    
    try {
      // Llamada al webhook de N8N en Railway
      const response = await fetch('https://n8n-jose.up.railway.app/webhook/chat-seguros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          clienteId: `cliente_${Date.now()}`,
          canal: 'web',
          perfil: clientProfile,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setConnectionStatus('connected');
      
      console.log('🤖 Respuesta del Agente de Seguros:', data);
      
      // Extraer respuesta del agente - Adaptado para N8N AI Agent
      const responseText = data.respuesta || 
                          data.output || 
                          data.response || 
                          data.message ||
                          'Error: No se recibió respuesta del agente';
      
      const newMessage = {
        id: Date.now(),
        question: userMessage,
        answer: responseText,
        timestamp: new Date(),
        isError: false,
        cotizacionData: data.cotizacionData || null,
        tipoRespuesta: data.tipoRespuesta || 'general'
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      setUserMessage('');
      
      // Toast personalizado según tipo de respuesta
      const toastMessage = data.tipoRespuesta === 'cotizacion' 
        ? 'Cotización generada exitosamente'
        : data.tipoRespuesta === 'comparacion'
        ? 'Comparación de seguros completada'
        : 'Agente de Seguros ha respondido';
        
      toast.success(toastMessage, {
        icon: '🛡️',
        description: 'Análisis personalizado completado'
      });
      
    } catch (error) {
      console.error('Error en consulta al Agente de Seguros:', error);
      setConnectionStatus('disconnected');
      
      // Respuesta de fallback especializada en seguros
      const fallbackResponses = [
        `🚨 Conexión interrumpida. Activando sistemas de respaldo...\n\n🛡️ **Información básica disponible:**\n• Rímac Seguros: Líder del mercado peruano\n• Pacífico Seguros: Excelente servicio al cliente\n• La Positiva: Opciones económicas\n\n💰 **Rangos de precios típicos:**\n• Seguro Auto: S/ 1,200 - S/ 3,500/año\n• Seguro Salud: S/ 150 - S/ 800/mes\n• Seguro Vida: S/ 300 - S/ 1,200/año\n\n🔄 Reconectando para cotización personalizada...`,
        
        `🌐 Sin conexión al servidor. Datos locales activos:\n\n📊 **Aseguradoras principales Perú:**\n🥇 Rímac: 35% del mercado\n🥈 Pacífico: 28% del mercado\n🥉 La Positiva: 15% del mercado\n\n📞 **Contactos directos:**\n• Rímac: (01) 411-1111\n• Pacífico: (01) 513-5000\n• La Positiva: (01) 518-4000\n\n🔄 Reestableciendo conexión para asesoría completa...`
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const errorMessage = {
        id: Date.now(),
        question: userMessage,
        answer: fallbackResponse,
        timestamp: new Date(),
        isError: true,
        isFallback: true
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      setUserMessage('');
      
      toast.error('Conexión interrumpida', {
        icon: '🚨',
        description: 'Información básica disponible'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para seleccionar tipo de seguro rápido
  const selectInsuranceType = (type) => {
    setUserMessage(`Necesito información sobre ${type.name.toLowerCase()}`);
    setClientProfile(prev => ({ ...prev, tipoSeguro: type.id }));
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
        fixed inset-0 z-[9999] flex items-center justify-center
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
          relative bg-gradient-to-br from-blue-900/95 to-indigo-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
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
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400">🇵🇪</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Agente de Seguros IA</h2>
                <p className="text-sm text-gray-400">
                  {isExpanded ? 'Modo Expandido - Asesor Especializado en Seguros Perú' : 'Asesor Especializado en Seguros Perú'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">Agente Activo</span>
              </div>
              
              {/* Botón de expansión */}
              <button
                onClick={toggleExpanded}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
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
        </div>

        {/* Status Bar Especializado */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">🛡️ Agente:</span>
              <span className="text-blue-400 text-sm">Seguros Perú Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">🏢 Aseguradoras:</span>
              <span className="text-green-400 text-sm">Rímac, Pacífico, La Positiva</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">💰 Moneda:</span>
              <span className="text-yellow-400 text-sm">Soles Peruanos (S/)</span>
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
                {connectionStatus === 'connected' ? 'Railway Online' : 
                 connectionStatus === 'testing' ? 'Conectando...' : 
                 'Modo Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Tipos de Seguro - Acceso Rápido */}
        {chatHistory.length <= 1 && (
          <div className="px-6 py-3 bg-gradient-to-r from-blue-600/10 to-green-600/10 border-b border-white/10">
            <p className="text-sm text-gray-300 mb-2">🚀 Acceso rápido por tipo de seguro:</p>
            <div className="flex gap-2 overflow-x-auto">
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => selectInsuranceType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${type.bg} border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap`}
                >
                  <type.icon className={`w-4 h-4 ${type.color}`} />
                  <span className="text-white text-sm">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content - Chat */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto flex flex-col">
            
            {/* Chat History */}
            <div ref={chatContainerRef} className={`flex-1 mb-6 space-y-4 overflow-y-auto ${isExpanded ? 'max-h-[60vh]' : 'max-h-60'}`}>
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">🛡️</div>
                  <p>Conectando con tu Asesor de Seguros...</p>
                  <div className="text-sm text-gray-400 space-y-1 mt-4">
                    <p>💫 Cotizaciones en tiempo real</p>
                    <p>⚡ Comparación de aseguradoras</p>
                    <p>🛡️ Especializado en mercado peruano</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div key={chat.id} className="space-y-3">
                    {/* User Message */}
                    {chat.question && (
                      <div className="flex justify-end">
                        <div className={`bg-blue-600/30 border border-blue-500/30 rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
                          <p className="text-white text-sm">{chat.question}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className={`rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'} ${
                        chat.isError 
                          ? 'bg-red-600/20 border border-red-500/30' 
                          : chat.isWelcome
                          ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30'
                          : 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30'
                      }`}>
                        <div className="flex items-start gap-2">
                          <div className="text-lg">🛡️</div>
                          <div className="flex-1">
                            <p className="text-white text-sm whitespace-pre-wrap">{chat.answer}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-300">
                                {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${
                                chat.isError 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : chat.isWelcome
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : chat.tipoRespuesta === 'cotizacion'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {chat.isError ? (chat.isFallback ? 'Modo Offline' : 'Error') : 
                                 chat.isWelcome ? 'Bienvenida' :
                                 chat.tipoRespuesta === 'cotizacion' ? 'Cotización' :
                                 chat.tipoRespuesta === 'comparacion' ? 'Comparación' :
                                 'Asesor IA'}
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

            {/* Message Input */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Pregunta sobre seguros: cotización, comparación, coberturas..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isLoading}
                  className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-green-600 text-white border border-blue-500/30 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Consultar
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Suggestions - Solo mostrar al inicio */}
            {chatHistory.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-3">💡 Consultas populares:</p>
                <div className={`grid gap-2 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {insuranceSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setUserMessage(suggestion)}
                      disabled={isLoading}
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

export default AgenteSegurosModal;