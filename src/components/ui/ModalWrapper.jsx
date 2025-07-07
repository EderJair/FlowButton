// src/components/ui/ModalWrapper.jsx

import React, { useEffect } from 'react';

/**
 * Wrapper para modales que maneja consistentemente:
 * 1. Centrado perfecto en pantalla
 * 2. Prevención de scroll automático
 * 3. Mantener scroll de página habilitado después de cerrar
 * 4. Animaciones suaves
 */
const ModalWrapper = ({ 
  isOpen, 
  isVisible, 
  onClose, 
  children, 
  className = '',
  overlayClassName = '',
  preventScrollBehavior = true,
  size = 'default' // 'small', 'default', 'large', 'full'
}) => {
  
  // Efecto para manejar el scroll cuando se abre/cierra el modal
  useEffect(() => {
    if (!preventScrollBehavior) return;
    
    if (isOpen) {
      // Guardar posición actual del scroll
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Bloquear scroll del body manteniendo la posición
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Marcar elementos scrollables para restaurar después
      const scrollableElements = document.querySelectorAll(
        '[data-scrollable], .overflow-auto, .overflow-y-auto, .overflow-x-auto, .overflow-scroll'
      );
      scrollableElements.forEach(element => {
        element.style.overflow = 'hidden';
        element.setAttribute('data-scroll-locked', 'true');
      });
      
      // Guardar posición para restaurar
      document.body.setAttribute('data-scroll-y', scrollY.toString());
      document.body.setAttribute('data-scroll-x', scrollX.toString());
      
      return () => {
        // Restaurar scroll al cerrar
        const savedScrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0');
        const savedScrollX = parseInt(document.body.getAttribute('data-scroll-x') || '0');
        
        // Limpiar estilos del body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // Restaurar elementos con scroll
        const lockedElements = document.querySelectorAll('[data-scroll-locked]');
        lockedElements.forEach(element => {
          element.style.overflow = '';
          element.removeAttribute('data-scroll-locked');
        });
        
        // Limpiar atributos de datos
        document.body.removeAttribute('data-scroll-y');
        document.body.removeAttribute('data-scroll-x');
        
        // Restaurar posición de scroll sin causar saltos
        window.scrollTo({
          top: savedScrollY,
          left: savedScrollX,
          behavior: 'instant'  // Importante: sin animación para evitar scroll automático
        });
      };
    }
  }, [isOpen, preventScrollBehavior]);

  // Función para manejar clics en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Función para manejar la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Obtener clases de tamaño
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-full max-w-md h-auto max-h-[70vh]';
      case 'large':
        return 'w-full max-w-6xl h-[90vh] max-h-[90vh]';
      case 'full':
        return 'w-[95vw] h-[95vh] max-w-none max-h-none';
      default:
        return 'w-full max-w-4xl h-[85vh] max-h-[85vh]';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        bg-black/10 backdrop-blur-sm
        overflow-hidden
        p-4 sm:p-6
        ${overlayClassName}
      `}
      onClick={handleOverlayClick}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      {/* Modal Content */}
      <div 
        className={`
          relative
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
          ${getSizeClasses()}
          mx-auto my-auto
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
