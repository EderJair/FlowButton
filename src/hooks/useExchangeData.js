// src/hooks/useExchangeData.js

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { exchangeService } from '../services/exchangeService';

export const useExchangeData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados de datos
  const [exchangeRates, setExchangeRates] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [stockIndices, setStockIndices] = useState(null);
  const [financialNews, setFinancialNews] = useState(null);
  const [conversion, setConversion] = useState(null);
  
  // Estados de UI
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('USD');
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // Ref para prevenir llamadas simultáneas
  const isLoadingRef = useRef(false);

  // Limpiar estados
  const clearStates = useCallback(() => {
    setError(null);
    setExchangeRates(null);
    setHistoricalData(null);
    setStockIndices(null);
    setFinancialNews(null);
    setConversion(null);
  }, []);

  // Obtener tipos de cambio
  const fetchExchangeRates = useCallback(async (baseCurrency = selectedBaseCurrency) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await exchangeService.getExchangeRates(baseCurrency);
      setExchangeRates(data);
      setSelectedBaseCurrency(baseCurrency);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedBaseCurrency]);

  // Obtener datos históricos
  const fetchHistoricalData = useCallback(async (fromCurrency, toCurrency, days = 7) => {
    try {
      const data = await exchangeService.getHistoricalRates(fromCurrency, toCurrency, days);
      setHistoricalData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Obtener índices bursátiles
  const fetchStockIndices = useCallback(async () => {
    try {
      const data = await exchangeService.getStockIndices();
      setStockIndices(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Obtener noticias financieras
  const fetchFinancialNews = useCallback(async () => {
    try {
      const data = await exchangeService.getFinancialNews();
      setFinancialNews(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  // Convertir moneda con throttle para evitar llamadas excesivas
  const convertCurrency = useCallback(async (amount, fromCurrency, toCurrency) => {
    // Validación temprana
    if (!amount || isNaN(amount) || amount <= 0) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await exchangeService.convertCurrency(amount, fromCurrency, toCurrency);
      setConversion(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);  // Cargar todos los datos principales
  const loadAllData = useCallback(async (baseCurrency) => {
    // Prevenir llamadas simultáneas
    if (isLoadingRef.current) {
      console.log('⏭️ Saltando loadAllData - ya está cargando');
      return;
    }
    
    const currency = baseCurrency || selectedBaseCurrency;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando carga de datos financieros...');
      
      // Cargar en paralelo
      const [rates, indices, news] = await Promise.all([
        exchangeService.getExchangeRates(currency),
        exchangeService.getStockIndices(),
        exchangeService.getFinancialNews()
      ]);
      
      setExchangeRates(rates);
      setStockIndices(indices);
      setFinancialNews(news);
      if (baseCurrency) setSelectedBaseCurrency(baseCurrency);
      
      console.log('✅ Datos financieros cargados exitosamente');
      return { rates, indices, news };
    } catch (err) {
      console.error('❌ Error cargando datos:', err.message);
      setError(err.message);
      throw err;
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []); // Eliminar selectedBaseCurrency de dependencias// Auto-refresh (actualización automática) - Usar useRef para evitar loops
  const autoRefreshRef = useRef(null);
  
  const startAutoRefresh = useCallback((intervalMs = 300000) => { // 5 minutos por defecto
    // Limpiar interval anterior
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
    }
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh datos financieros (cada 5 min)');
      loadAllData();
    }, intervalMs);
    
    autoRefreshRef.current = interval;
    setRefreshInterval(interval);
    return interval;
  }, [loadAllData]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
      setRefreshInterval(null);
    }
  }, []);
  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, []);
  // Utilidades derivadas con useMemo para evitar recálculos innecesarios
  const getTopCurrencies = useMemo(() => {
    if (!exchangeRates?.rates) return [];
    
    const currencies = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
    return currencies.map(currency => ({
      currency,
      rate: exchangeRates.rates[currency],
      change: Math.random() * 2 - 1 // Simular cambio %
    }));
  }, [exchangeRates]);

  const getTrendingPairs = useMemo(() => {
    if (!exchangeRates?.rates) return [];
    
    return [
      { pair: 'EUR/USD', rate: exchangeRates.rates.EUR, change: +0.45 },
      { pair: 'GBP/USD', rate: exchangeRates.rates.GBP, change: -0.23 },
      { pair: 'USD/JPY', rate: 1/exchangeRates.rates.JPY, change: +0.78 },
      { pair: 'USD/MXN', rate: 1/exchangeRates.rates.MXN, change: -1.12 }
    ];
  }, [exchangeRates]);

  return {
    // Estados
    isLoading,
    error,
    exchangeRates,
    historicalData,
    stockIndices,
    financialNews,
    conversion,
    selectedBaseCurrency,
    
    // Funciones principales
    fetchExchangeRates,
    fetchHistoricalData,
    fetchStockIndices,
    fetchFinancialNews,
    convertCurrency,
    loadAllData,
    clearStates,
    
    // Auto-refresh
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing: !!refreshInterval,
    
    // Utilidades
    getTopCurrencies,
    getTrendingPairs,
    
    // Setters
    setSelectedBaseCurrency
  };
};

export default useExchangeData;
