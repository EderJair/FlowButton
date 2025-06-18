// src/hooks/useThrottle.js

import { useRef, useCallback } from 'react';

/**
 * Hook para throttle de funciones
 * @param {Function} func - Función a throttle
 * @param {number} delay - Retraso en milisegundos
 * @returns {Function} Función con throttle
 */
export const useThrottle = (func, delay) => {
  const lastRan = useRef(Date.now());

  const throttledFunction = useCallback((...args) => {
    if (Date.now() - lastRan.current >= delay) {
      func(...args);
      lastRan.current = Date.now();
    }
  }, [func, delay]);

  return throttledFunction;
};

export default useThrottle;
