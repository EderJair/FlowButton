// src/features/dashboard/components/modals/LegalConsultantModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { OpenAI, DocumentCheckIcon } from '../../../../assets/icons';

const LegalConsultantModal = ({ isOpen, onClose, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mensaje inicial del asistente
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'assistant',
        content: '👨‍⚖️ ¡Hola! Soy tu Asistente Legal Inteligente. Puedo ayudarte con consultas jurídicas, análisis de contratos, interpretación de leyes y asesoramiento legal general. ¿En qué puedo asistirte hoy?',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efecto para mostrar el modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      // Limpiar chat al cerrar
      setTimeout(() => {
        setMessages([]);
        setInputMessage('');
      }, 300);
    }
  }, [isOpen]);

  // Simular respuesta del asistente (aquí conectarías con N8N)
  const sendToLegalAI = async (userMessage) => {
    try {
      // TODO: Aquí conectar con tu endpoint de N8N
      // const response = await fetch('TU_ENDPOINT_N8N', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage })
      // });
      
      // Por ahora, respuesta simulada
      const responses = [
        "Entiendo tu consulta legal. Según la legislación vigente, esto se rige por...",
        "En este caso particular, recomiendo considerar los siguientes aspectos legales...",
        "Esta situación se encuentra regulada en el artículo... del código...",
        "Para este tipo de consulta, es importante tener en cuenta que...",
        "Según la jurisprudencia reciente, los tribunales han establecido que..."
      ];
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      return responses[Math.floor(Math.random() * responses.length)];
      
    } catch (error) {
      console.error('Error consultando IA legal:', error);
      throw new Error('Error al procesar la consulta legal');
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

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden
          transition-all duration-300 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
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
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Abogado Consultor</h2>
                <p className="text-sm text-gray-400">Consultoría legal inteligente con IA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">IA Legal Online</span>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-lg p-4
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
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-60 mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 max-w-[80%]">
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
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-3">Consultas frecuentes:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 text-sm hover:bg-white/20 transition-colors"
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
