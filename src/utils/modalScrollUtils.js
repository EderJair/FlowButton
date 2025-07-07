// src/utils/modalScrollUtils.js

/**
 * Utilidades para manejar el scroll en modales de manera consistente
 * Previene el scroll automático al abrir/cerrar modales
 */

let scrollPosition = { x: 0, y: 0 };

/**
 * Bloquea el scroll de la página cuando se abre un modal
 */
export const lockPageScroll = () => {
  // Guardar posición actual
  scrollPosition.y = window.scrollY;
  scrollPosition.x = window.scrollX;
  
  // Aplicar estilos para bloquear scroll
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition.y}px`;
  document.body.style.left = `-${scrollPosition.x}px`;
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  
  // Bloquear elementos scrollables
  const scrollableElements = document.querySelectorAll(
    '[data-scrollable], .overflow-auto, .overflow-y-auto, .overflow-x-auto, .overflow-scroll'
  );
  scrollableElements.forEach(element => {
    element.style.overflow = 'hidden';
    element.setAttribute('data-scroll-locked', 'true');
  });
  
  // Guardar posición en atributos para respaldo
  document.body.setAttribute('data-scroll-y', scrollPosition.y.toString());
  document.body.setAttribute('data-scroll-x', scrollPosition.x.toString());
};

/**
 * Restaura el scroll de la página cuando se cierra un modal
 */
export const unlockPageScroll = () => {
  // Limpiar estilos del body
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.overflow = '';
  document.body.style.width = '';
  document.body.style.height = '';
  
  // Restaurar elementos con scroll bloqueado
  const lockedElements = document.querySelectorAll('[data-scroll-locked]');
  lockedElements.forEach(element => {
    element.style.overflow = '';
    element.removeAttribute('data-scroll-locked');
  });
  
  // Limpiar atributos de datos
  document.body.removeAttribute('data-scroll-y');
  document.body.removeAttribute('data-scroll-x');
  
  // Restaurar posición sin animación
  window.scrollTo({
    top: scrollPosition.y,
    left: scrollPosition.x,
    behavior: 'instant'
  });
};

/**
 * Hook de React para manejar el scroll de modales
 */
export const useModalScroll = (isOpen) => {
  React.useEffect(() => {
    if (isOpen) {
      lockPageScroll();
      
      return () => {
        unlockPageScroll();
      };
    }
  }, [isOpen]);
};

/**
 * Función para manejar clics en el overlay
 */
export const createOverlayClickHandler = (onClose) => {
  return (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
};

/**
 * Función para manejar la tecla Escape
 */
export const useEscapeKey = (isOpen, onClose) => {
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
};

// Compatibilidad con React
if (typeof React !== 'undefined') {
  const React = require('react');
  
  useModalScroll.displayName = 'useModalScroll';
  useEscapeKey.displayName = 'useEscapeKey';
}
