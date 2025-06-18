// src/features/dashboard/components/modals/ExchangeStockModal.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { ShoppingCartIcon, GrowthIcon } from '../../../../assets/icons';
import { useExchangeData } from '../../../../hooks/useExchangeData';
import { useDebounce } from '../../../../hooks/useDebounce';
import { TopCurrenciesDisplay, TrendingPairsDisplay, ConversionButton, CurrencyDisplay } from './components';
import { formatCurrency, formatPercentage, getCurrencyFlag } from '../../../../services/exchangeService';

const ExchangeStockModal = ({ isOpen, onClose, onSubmit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('exchange'); // 'exchange', 'converter', 'stocks'
    // Estados del convertidor
  const [converterForm, setConverterForm] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'PEN' // Cambiar default a PEN para facilitar pruebas
  });
  // Hook para datos financieros
  const {
    isLoading,
    error,
    exchangeRates,
    stockIndices,
    financialNews,
    conversion,
    convertCurrency,
    loadAllData,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing,
    getTopCurrencies,
    getTrendingPairs
  } = useExchangeData();  // Datos memoizados para evitar recálculos
  const topCurrencies = useMemo(() => getTopCurrencies, [getTopCurrencies]);
  const trendingPairs = useMemo(() => getTrendingPairs, [getTrendingPairs]);
  
  // Lista completa de monedas disponibles (incluyendo USD)
  const availableCurrencies = useMemo(() => {
    if (!exchangeRates) return ['USD'];
    
    const currencies = new Set(['USD']); // Siempre incluir USD
    
    // Agregar todas las monedas de rates
    Object.keys(exchangeRates.rates).forEach(currency => {
      currencies.add(currency);
    });
    
    return Array.from(currencies).sort();
  }, [exchangeRates]);
  
  // Debounce para auto-conversión
  const debouncedAmount = useDebounce(converterForm.amount, 1000);
  const debouncedFromCurrency = useDebounce(converterForm.fromCurrency, 500);
  const debouncedToCurrency = useDebounce(converterForm.toCurrency, 500);
  // Efecto para mostrar el modal - SOLO depende de isOpen
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
      // Cargar datos iniciales solo una vez al abrir
      loadAllData();
      // Iniciar auto-refresh cada 5 minutos (reducido de 2 minutos)
      startAutoRefresh(300000);
    } else {
      setIsVisible(false);
      stopAutoRefresh();
    }
  }, [isOpen]); // SOLO isOpen como dependencia  // Limpiar al cerrar
  useEffect(() => {
    if (!isOpen) {
      setConverterForm({ amount: '', fromCurrency: 'USD', toCurrency: 'PEN' });
    }
  }, [isOpen]);

  // Auto-conversión con debounce (solo si hay datos válidos)
  useEffect(() => {
    if (activeTab === 'converter' && 
        debouncedAmount && 
        !isNaN(debouncedAmount) && 
        parseFloat(debouncedAmount) > 0 &&
        debouncedFromCurrency && 
        debouncedToCurrency &&
        debouncedFromCurrency !== debouncedToCurrency) {
      
      console.log('🔄 Auto-conversión con debounce:', {
        amount: debouncedAmount,
        from: debouncedFromCurrency,
        to: debouncedToCurrency
      });
      
      convertCurrency(
        parseFloat(debouncedAmount),
        debouncedFromCurrency,
        debouncedToCurrency
      ).catch(() => {
        // Silenciar errores de auto-conversión
      });
    }
  }, [debouncedAmount, debouncedFromCurrency, debouncedToCurrency, activeTab, convertCurrency]);

  // Manejar conversión de moneda
  const handleConvert = useCallback(async (e) => {
    e.preventDefault();
    
    if (!converterForm.amount || isNaN(converterForm.amount)) {
      toast.error('Cantidad inválida', {
        description: 'Ingresa una cantidad numérica válida',
        icon: '💱'
      });
      return;
    }

    try {
      await convertCurrency(
        parseFloat(converterForm.amount),
        converterForm.fromCurrency,
        converterForm.toCurrency
      );
      
      toast.success('Conversión realizada', {
        description: 'Tipo de cambio actualizado',
        icon: '✅'
      });
    } catch (error) {
      toast.error('Error en conversión', {
        description: error.message,
        icon: '❌'
      });
    }
  }, [converterForm, convertCurrency]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400">+</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GrowthIcon className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Tipo de Cambio + Bolsa</h2>
                <p className="text-sm text-gray-400">Información financiera en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Indicador de actualización */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAutoRefreshing ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-xs text-gray-400">
                  {isAutoRefreshing ? 'Auto-actualización' : 'Manual'}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4">
            {[
              { id: 'exchange', label: 'Tipos de Cambio', icon: '💱' },
              { id: 'converter', label: 'Convertidor', icon: '🔄' },
              { id: 'stocks', label: 'Bolsa', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                  ${activeTab === tab.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {isLoading && !exchangeRates && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                <span className="text-gray-400">Cargando datos financieros...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">❌ {error}</p>
            </div>
          )}

          {/* Tab: Tipos de Cambio */}
          {activeTab === 'exchange' && exchangeRates && (
            <div className="space-y-6">
              {/* Información base */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Información General</h3>
                  <span className="text-sm text-gray-400">Base: {exchangeRates.base}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Fecha</p>
                    <p className="text-white font-medium">{exchangeRates.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Última actualización</p>
                    <p className="text-white font-medium">{new Date(exchangeRates.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Monedas disponibles</p>
                    <p className="text-white font-medium">{Object.keys(exchangeRates.allRates).length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      En vivo
                    </span>
                  </div>
                </div>
              </div>              {/* Principales divisas y pares trending optimizados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopCurrenciesDisplay 
                  currencies={topCurrencies} 
                  baseCurrency={exchangeRates.base}
                  isLoading={isLoading && !exchangeRates}
                />
                
                <TrendingPairsDisplay 
                  pairs={trendingPairs}
                  isLoading={isLoading && !exchangeRates}
                />
              </div>

              {/* Noticias financieras */}
              {financialNews && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Noticias Financieras</h3>
                  <div className="space-y-3">
                    {financialNews.map((news, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium">{news.title}</h4>
                          <span className="text-gray-400 text-sm">{news.time}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{news.summary}</p>
                        <span className={`
                          inline-block px-2 py-1 rounded text-xs
                          ${news.impact === 'positive' ? 'bg-green-500/20 text-green-400' : 
                            news.impact === 'negative' ? 'bg-red-500/20 text-red-400' : 
                            'bg-gray-500/20 text-gray-400'}
                        `}>
                          {news.impact === 'positive' ? '📈 Positivo' : 
                           news.impact === 'negative' ? '📉 Negativo' : '➖ Neutral'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Convertidor */}
          {activeTab === 'converter' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Convertidor de Monedas</h3>
                
                <form onSubmit={handleConvert} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cantidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={converterForm.amount}
                        onChange={(e) => setConverterForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="100"
                      />
                    </div>                    {/* De */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        De
                      </label>
                      <select
                        value={converterForm.fromCurrency}
                        onChange={(e) => setConverterForm(prev => ({ ...prev, fromCurrency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {availableCurrencies.map(currency => (
                          <option key={currency} value={currency} className="bg-gray-800">
                            {getCurrencyFlag(currency)} {currency}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* A */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        A
                      </label>
                      <select
                        value={converterForm.toCurrency}
                        onChange={(e) => setConverterForm(prev => ({ ...prev, toCurrency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {availableCurrencies.map(currency => (
                          <option key={currency} value={currency} className="bg-gray-800">
                            {getCurrencyFlag(currency)} {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>                  <ConversionButton 
                    isLoading={isLoading}
                    disabled={!converterForm.amount}
                  />
                </form>

                {/* Resultado de conversión */}
                {conversion && (
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 text-lg">                        <div className="text-white">
                          <CurrencyDisplay
                            amount={conversion.original.amount}
                            currency={conversion.original.currency}
                            className="font-mono"
                          />
                        </div>
                        <span className="text-blue-400">→</span>
                        <div className="text-green-400">
                          <CurrencyDisplay
                            amount={conversion.converted.amount}
                            currency={conversion.converted.currency}
                            className="font-mono text-xl font-bold"
                          />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Tipo de cambio: 1 {conversion.original.currency} = {conversion.rate.toFixed(4)} {conversion.converted.currency}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Actualizado: {new Date(conversion.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Bolsa */}
          {activeTab === 'stocks' && stockIndices && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Índices Bursátiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stockIndices.indices.map((index) => (
                    <div key={index.symbol} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{index.name}</h4>
                          <p className="text-gray-400 text-sm">{index.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-mono text-lg">
                            {formatCurrency(index.price, index.currency)}
                          </p>
                          <p className={`text-sm ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {index.change >= 0 ? '+' : ''}{index.change} ({formatPercentage(index.changePercent)})
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${index.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min(Math.abs(index.changePercent) * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-4 text-center">
                  Última actualización: {new Date(stockIndices.lastUpdate).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Datos actualizados cada 5 minutos</span>
              <span>•</span>
              <span>Fuente: APIs financieras</span>
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeStockModal;
