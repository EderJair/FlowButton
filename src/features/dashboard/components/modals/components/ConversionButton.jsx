// src/features/dashboard/components/modals/components/ConversionButton.jsx

import React from 'react';

const ConversionButton = React.memo(({ 
  isLoading, 
  disabled, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`
        w-full px-4 py-3 rounded-lg font-medium 
        bg-gradient-to-r from-blue-600 to-purple-600 
        text-white border border-blue-500/30 
        hover:from-blue-700 hover:to-purple-700 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-200 
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Convirtiendo...
        </>
      ) : (
        <>
          <span>🔄</span>
          Convertir
        </>
      )}
    </button>
  );
});

ConversionButton.displayName = 'ConversionButton';

export default ConversionButton;
