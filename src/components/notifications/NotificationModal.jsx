// src/components/notifications/NotificationModal.jsx

import React, { useEffect, useState } from 'react';

const NotificationModal = ({ isOpen, onClose, type, title, message, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Auto cerrar después de 3 segundos si autoClose está habilitado
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Esperar a que termine la animación
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  // Configuración de colores según el tipo
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/30',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/30',
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/30',
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-400'
        };
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/30',
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-400'
        };
    }
  };

  const config = getTypeConfig();

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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br ${config.bgColor}
          backdrop-blur-md border ${config.borderColor}
          rounded-2xl shadow-2xl w-full max-w-md
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              w-12 h-12 ${config.iconBg} rounded-full 
              flex items-center justify-center flex-shrink-0
            `}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="
                text-gray-400 hover:text-white transition-colors
                w-8 h-8 flex items-center justify-center rounded-lg 
                hover:bg-white/10 flex-shrink-0
              "
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar (para auto close) */}
          {autoClose && (
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all duration-3000 ease-linear`}
                style={{
                  width: isVisible ? '0%' : '100%',
                  transition: isVisible ? 'width 3s linear' : 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
