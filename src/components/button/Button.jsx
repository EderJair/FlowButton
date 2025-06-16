// src/components/Button/Button.jsx

import React from 'react';

// Definimos las props que aceptará nuestro botón
// Con valores por defecto para hacerlos opcionales
export const Button = ({
  children, // Esto será el texto o contenido dentro del botón (ej: "Comenzar")
  className = '', // Para añadir clases adicionales de Tailwind o CSS personalizado
  width = 'w-auto', // Ancho por defecto 'auto'
  height = 'h-auto', // Alto por defecto 'auto'
  variant = 'primary', // Para diferentes estilos de botón (ej: 'primary', 'secondary', 'outline')
  onClick, // La función que se ejecutará al hacer clic
  ...rest // Para pasar cualquier otra prop HTML estándar (ej: type, disabled)
}) => {
  // Definimos los estilos base para el botón
  const baseStyles = `
    inline-flex items-center justify-center
    px-8 py-4 // Padding por defecto, podemos ajustar con props si es necesario
    text-lg font-semibold text-center
    rounded-xl shadow-lg
    transition-all duration-300 ease-in-out
    hover:shadow-xl cursor-pointer
    focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900
  `;

  // Definimos los estilos específicos según la 'variant'
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `
        bg-blue-600 text-white
        hover:bg-blue-700
      `;
      break;
    case 'secondary':
      // Estilos para un botón secundario (ej: fondo claro, texto oscuro)
      variantStyles = `
        text-white
        border-2 border-white
        hover:bg-gray-600
        duration-100
      `;
      break;
    case 'outline':
      // Estilos para un botón con solo borde (como tu botón de Login)
      variantStyles = `
        bg-blue-500 text-white
        border-2 border-white
      `;
      break;
    // Puedes añadir más variantes aquí si las necesitas
    default:
      variantStyles = `
        bg-blue-600 text-white
        hover:bg-blue-700
      `;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${width} ${height} ${className}`}
      onClick={onClick}
      {...rest} // Pasa cualquier otra prop HTML como 'type', 'disabled', etc.
    >
      {children}
    </button>
  );
};