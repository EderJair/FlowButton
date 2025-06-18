// src/features/dashboard/components/modals/components/CurrencyDisplay.jsx

import React from 'react';
import { getCurrencyFlag } from '../../../../../services/exchangeService';
import { NumberDisplay, PercentageDisplay } from './NumberDisplay';

// Componente optimizado para mostrar una moneda individual
const CurrencyItem = React.memo(({ currency, rate, change, baseCurrency, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-600 rounded"></div>
          <div>
            <div className="w-12 h-4 bg-gray-600 rounded mb-1"></div>
            <div className="w-20 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-4 bg-gray-600 rounded mb-1"></div>
          <div className="w-12 h-3 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-xl">{getCurrencyFlag(currency)}</span>
        <div>
          <p className="text-white font-medium">{currency}</p>
          <p className="text-gray-400 text-sm">1 {baseCurrency} =</p>
        </div>
      </div>      <div className="text-right">
        <NumberDisplay 
          value={rate} 
          decimals={4} 
          className="text-white"
          loading={isLoading}
        />
        <div className="mt-1">
          <PercentageDisplay 
            value={change} 
            className="text-sm"
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
});

CurrencyItem.displayName = 'CurrencyItem';

// Componente optimizado para mostrar lista de monedas principales
const TopCurrenciesDisplay = React.memo(({ currencies, baseCurrency, isLoading }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Principales Divisas</h3>
      <div className="space-y-3">
        {isLoading ? (
          // Mostrar skeleton loading
          Array.from({ length: 6 }).map((_, index) => (
            <CurrencyItem key={index} isLoading={true} />
          ))
        ) : (
          currencies.map((item) => (
            <CurrencyItem
              key={item.currency}
              currency={item.currency}
              rate={item.rate}
              change={item.change}
              baseCurrency={baseCurrency}
            />
          ))
        )}
      </div>
    </div>
  );
});

TopCurrenciesDisplay.displayName = 'TopCurrenciesDisplay';

// Componente optimizado para pares trending
const TrendingPairsDisplay = React.memo(({ pairs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Pares Populares</h3>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg animate-pulse">
              <div>
                <div className="w-16 h-4 bg-gray-600 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-700 rounded"></div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-gray-600 rounded mb-1"></div>
                <div className="w-12 h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Pares Populares</h3>
      <div className="space-y-3">
        {pairs.map((pair) => (
          <div key={pair.pair} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">{pair.pair}</p>
              <p className="text-gray-400 text-sm">Tipo de cambio</p>
            </div>            <div className="text-right">
              <NumberDisplay 
                value={pair.rate} 
                decimals={4} 
                className="text-white"
                loading={isLoading}
              />
              <div className="mt-1">
                <PercentageDisplay 
                  value={pair.change} 
                  className="text-sm"
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TrendingPairsDisplay.displayName = 'TrendingPairsDisplay';

export { TopCurrenciesDisplay, TrendingPairsDisplay, CurrencyItem };
