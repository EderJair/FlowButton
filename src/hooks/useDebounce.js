// src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {*} value - Valor a debounce
 * @param {number} delay - Retraso en milisegundos
 * @returns {*} Valor debounced
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de callbacks
 * @param {Function} callback - Función a debounce
 * @param {number} delay - Retraso en milisegundos
 * @param {Array} deps - Dependencias
 * @returns {Function} Función debounced
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(timer);
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

export default useDebounce;
