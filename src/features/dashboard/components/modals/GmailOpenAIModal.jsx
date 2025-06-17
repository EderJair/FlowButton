// src/features/dashboard/components/modals/GmailOpenAIModal.jsx

import React, { useState, useEffect } from 'react';
import { GmailIcon, OpenAI } from '../../../../assets/icons';
import { useGmailFlow } from '../../../../hooks/useGmailFlow';

const GmailOpenAIModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    destinatario: '',
    prompt: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  // Hook para gestionar el flujo Gmail + OpenAI
  const {
    isLoading,
    error,
    success,
    generateAndSendEmail,
    clearStates
  } = useGmailFlow();

  // Efecto para mostrar el modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ destinatario: '', prompt: '' });
      clearStates(); // Limpiar estados del hook
    }
  }, [isOpen, clearStates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.destinatario || !formData.prompt) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const result = await generateAndSendEmail(formData);
      
      // Si hay un callback onSubmit, ejecutarlo
      if (onSubmit) {
        onSubmit(formData, result);
      }
      
      // Mostrar mensaje de éxito
      alert('¡Email enviado exitosamente!');
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert(`Error al enviar el email: ${error.message}`);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleOverlayClick}
    >
      {/* Overlay con blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl w-full max-w-lg
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <GmailIcon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400">+</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <OpenAI className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Gmail + OpenAI</h2>
                <p className="text-sm text-gray-400">Emails inteligentes con IA</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          
          {/* Badge "Impulsado por IA" */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2">
              <span className="text-sm font-medium text-purple-300">
                ✨ Impulsado por Inteligencia Artificial
              </span>
            </div>
          </div>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campo de destinatario */}
          <div>
            <label htmlFor="destinatario" className="block text-sm font-medium text-gray-300 mb-2">
              Correo del destinatario
            </label>
            <input
              type="email"
              id="destinatario"
              name="destinatario"
              value={formData.destinatario}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              className="
                w-full px-4 py-3 rounded-lg 
                bg-white/10 border border-white/20 
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
              "
              required
            />
          </div>

          {/* Campo de prompt */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Instrucciones para la IA
            </label>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleInputChange}
              placeholder="Ej: Manda un correo de cumpleaños para mi hermana María, que sea cariñoso y alegre..."
              rows={4}
              className="
                w-full px-4 py-3 rounded-lg 
                bg-white/10 border border-white/20 
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 resize-none
              "
              required
            />            <p className="text-xs text-gray-400 mt-2">
              Describe qué tipo de correo quieres enviar y la IA lo redactará por ti
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm">
                ❌ {error}
              </p>
            </div>
          )}{/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-white/10 text-gray-300 border border-white/20
                hover:bg-white/20 transition-all duration-200
              "
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !formData.destinatario || !formData.prompt}
              className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-gradient-to-r from-blue-600 to-purple-600
                text-white border border-blue-500/30
                hover:from-blue-700 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <OpenAI className="w-4 h-4" />
                  Generar Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GmailOpenAIModal;
