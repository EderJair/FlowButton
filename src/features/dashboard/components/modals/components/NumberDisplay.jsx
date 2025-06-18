// src/features/dashboard/components/modals/components/NumberDisplay.jsx

import React from 'react';

// Componente optimizado para mostrar números con formateo estable
const NumberDisplay = React.memo(({ 
  value, 
  decimals = 4, 
  prefix = '', 
  suffix = '', 
  className = '', 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-600 rounded h-4 w-16 ${className}`} />
    );
  }

  const formattedValue = typeof value === 'number' ? value.toFixed(decimals) : '---';
  
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
});

NumberDisplay.displayName = 'NumberDisplay';

// Componente optimizado para mostrar porcentajes
const PercentageDisplay = React.memo(({ 
  value, 
  showSign = true, 
  className = '', 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-600 rounded h-3 w-12 ${className}`} />
    );
  }

  const isPositive = value >= 0;
  const sign = showSign ? (isPositive ? '+' : '') : '';
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  
  return (
    <span className={`font-mono tabular-nums ${colorClass} ${className}`}>
      {sign}{Math.abs(value).toFixed(2)}%
    </span>
  );
});

PercentageDisplay.displayName = 'PercentageDisplay';

// Componente optimizado para mostrar monedas
const CurrencyDisplay = React.memo(({ 
  amount, 
  currency, 
  decimals = 2, 
  className = '', 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-600 rounded h-4 w-20 ${className}`} />
    );
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formattedAmount = typeof amount === 'number' ? formatter.format(amount) : '---';
  
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {formattedAmount}
    </span>
  );
});

CurrencyDisplay.displayName = 'CurrencyDisplay';

export { NumberDisplay, PercentageDisplay, CurrencyDisplay };
