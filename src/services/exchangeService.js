// src/services/exchangeService.js

// Servicio para obtener datos de tipo de cambio y bolsa en tiempo real
export const exchangeService = {
    // Obtener tipos de cambio principales
  getExchangeRates: async (baseCurrency = 'USD') => {
    try {
      // console.log('💱 Obteniendo tipos de cambio...'); // Comentado para reducir logs
      
      // Usar API gratuita de exchangerate-api
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
        const data = await response.json();
      
      // console.log('✅ Tipos de cambio obtenidos'); // Comentado para reducir logs
      
      // Formatear datos principales
      return {
        base: data.base,
        date: data.date,
        timestamp: Date.now(),
        rates: {
          // Principales divisas
          EUR: data.rates.EUR,
          GBP: data.rates.GBP,
          JPY: data.rates.JPY,
          CHF: data.rates.CHF,
          CAD: data.rates.CAD,
          AUD: data.rates.AUD,
          // Latinoamérica
          MXN: data.rates.MXN,
          BRL: data.rates.BRL,
          ARS: data.rates.ARS,
          CLP: data.rates.CLP,
          COP: data.rates.COP,
          PEN: data.rates.PEN,
          // Crypto-friendly
          CNY: data.rates.CNY,
          INR: data.rates.INR,
          KRW: data.rates.KRW
        },
        allRates: data.rates
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo tipos de cambio:', error);
      throw new Error(`Error en tipos de cambio: ${error.message}`);
    }
  },

  // Obtener datos históricos (últimos 7 días)
  getHistoricalRates: async (fromCurrency = 'USD', toCurrency = 'EUR', days = 7) => {
    try {
      console.log(`📈 Obteniendo histórico ${fromCurrency} -> ${toCurrency}`);
      
      // Para demo, simular datos históricos (en producción usar API real)
      const historicalData = [];
      const currentDate = new Date();
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        // Simular fluctuación realista
        const baseRate = 0.85; // EUR example
        const variation = (Math.random() - 0.5) * 0.02; // ±1%
        const rate = baseRate + variation;
        
        historicalData.push({
          date: date.toISOString().split('T')[0],
          rate: parseFloat(rate.toFixed(4)),
          change: i === days ? 0 : parseFloat((variation * 100).toFixed(2))
        });
      }
      
      return historicalData;
      
    } catch (error) {
      console.error('❌ Error obteniendo histórico:', error);
      throw new Error(`Error en datos históricos: ${error.message}`);
    }
  },
  // Convertir cantidades - MEJORADO para manejar USD correctamente
  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    try {
      let rate;
      
      if (fromCurrency === toCurrency) {
        // Misma moneda
        rate = 1;
      } else if (fromCurrency === 'USD') {
        // De USD a otra moneda
        const exchangeData = await exchangeService.getExchangeRates('USD');
        
        if (!exchangeData.rates[toCurrency]) {
          throw new Error(`Moneda ${toCurrency} no disponible`);
        }
        
        rate = exchangeData.rates[toCurrency];
      } else if (toCurrency === 'USD') {
        // De otra moneda a USD
        const exchangeData = await exchangeService.getExchangeRates('USD');
        
        if (!exchangeData.rates[fromCurrency]) {
          throw new Error(`Moneda ${fromCurrency} no disponible`);
        }
        
        // Para convertir a USD, dividimos por la tasa
        rate = 1 / exchangeData.rates[fromCurrency];
      } else {
        // De una moneda a otra (ambas diferentes de USD)
        // Convertir primero a USD, luego a la moneda destino
        const exchangeData = await exchangeService.getExchangeRates('USD');
        
        if (!exchangeData.rates[fromCurrency] || !exchangeData.rates[toCurrency]) {
          throw new Error(`Una de las monedas (${fromCurrency} o ${toCurrency}) no está disponible`);
        }
        
        const fromUsdRate = 1 / exchangeData.rates[fromCurrency]; // to USD
        const toTargetRate = exchangeData.rates[toCurrency]; // from USD
        rate = fromUsdRate * toTargetRate;
      }
      
      const convertedAmount = amount * rate;
      
      return {
        original: {
          amount: amount,
          currency: fromCurrency
        },
        converted: {
          amount: parseFloat(convertedAmount.toFixed(2)),
          currency: toCurrency
        },
        rate: rate,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('❌ Error en conversión:', error);
      throw new Error(`Error en conversión: ${error.message}`);
    }
  },

  // Obtener datos de índices bursátiles principales
  getStockIndices: async () => {    try {
      // console.log('📊 Obteniendo índices bursátiles...'); // Comentado para reducir logs
      
      // Simulación de datos bursátiles (en producción usar API como Alpha Vantage)
      const indices = [
        {
          symbol: 'SPY',
          name: 'S&P 500',
          price: 430.25,
          change: +2.45,
          changePercent: +0.57,
          currency: 'USD'
        },
        {
          symbol: 'QQQ',
          name: 'NASDAQ',
          price: 367.80,
          change: -1.23,
          changePercent: -0.33,
          currency: 'USD'
        },
        {
          symbol: 'EWZ',
          name: 'Brazil ETF',
          price: 28.45,
          change: +0.85,
          changePercent: +3.08,
          currency: 'USD'
        },
        {
          symbol: 'EWW',
          name: 'Mexico ETF',
          price: 45.22,
          change: -0.12,
          changePercent: -0.26,
          currency: 'USD'
        }
      ];
      
      return {
        indices,
        timestamp: Date.now(),
        lastUpdate: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo índices:', error);
      throw new Error(`Error en índices bursátiles: ${error.message}`);
    }
  },

  // Obtener noticias financieras (simulado)
  getFinancialNews: async () => {
    try {
      const news = [
        {
          title: 'Fed mantiene tasas de interés estables',
          summary: 'La Reserva Federal decide mantener las tasas sin cambios...',
          impact: 'neutral',
          time: '2h ago'
        },
        {
          title: 'Euro se fortalece frente al dólar',
          summary: 'El EUR/USD alcanza niveles máximos del mes...',
          impact: 'positive',
          time: '4h ago'
        },
        {
          title: 'Mercados emergentes muestran volatilidad',
          summary: 'Los mercados latinoamericanos presentan movimientos mixtos...',
          impact: 'negative',
          time: '6h ago'
        }
      ];
      
      return news;
      
    } catch (error) {
      console.error('❌ Error obteniendo noticias:', error);
      throw new Error(`Error en noticias: ${error.message}`);
    }
  }
};

// Utilidades para formateo
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(amount);
};

export const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const getCurrencyFlag = (currency) => {
  const flags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CHF: '🇨🇭',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    MXN: '🇲🇽',
    BRL: '🇧🇷',
    ARS: '🇦🇷',
    CLP: '🇨🇱',
    COP: '🇨🇴',
    PEN: '🇵🇪',
    CNY: '🇨🇳',
    INR: '🇮🇳',
    KRW: '🇰🇷'
  };
  
  return flags[currency] || '💱';
};

export default exchangeService;
