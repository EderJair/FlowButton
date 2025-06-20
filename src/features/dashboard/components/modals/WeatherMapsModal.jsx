// src/features/dashboard/components/modals/WeatherMapsModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WeatherIcon, MapIcon, OpenAI } from '../../../../assets/icons';
import weatherService from '../../../../services/weatherService';
import weatherChatService from '../../../../services/weatherChatService';
import WeatherCharts from '../../../../components/weather/WeatherCharts';

const WeatherMapsModal = ({ isOpen, onClose, onSubmit }) => {
  // Constantes para el caché
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en milisegu                                         <div className={`rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'} ${      <div className={`rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'} ${dos
  const WEATHER_CACHE_KEY = 'weather_cache';
  const FORECAST_CACHE_KEY = 'forecast_cache';

  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Lima, Perú');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'forecast', 'maps', 'ai'
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para modo expandido
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Referencia para el scroll automático del chat
  const chatContainerRef = useRef(null);

  // Funciones de caché
  const getCacheKey = (location, type) => `${type}_${location.toLowerCase().replace(/\s+/g, '_')}`;
  
  const saveToCache = (location, data, type) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        location: location
      };
      localStorage.setItem(getCacheKey(location, type), JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error guardando en caché:', error);
    }
  };

  const getFromCache = (location, type) => {
    try {
      const cached = localStorage.getItem(getCacheKey(location, type));
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const now = Date.now();
      
      // Verificar si el caché ha expirado
      if (now - cacheData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(getCacheKey(location, type));
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('Error leyendo caché:', error);
      return null;
    }
  };

  const clearExpiredCache = () => {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        if (key.includes('weather_') || key.includes('forecast_')) {
          try {
            const cached = JSON.parse(localStorage.getItem(key));
            if (cached && (now - cached.timestamp > CACHE_DURATION)) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // Si hay error parsing, remover el item
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Error limpiando caché:', error);
    }
  };
  // Función para cargar datos del clima
  const loadWeatherData = async (location = currentLocation) => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpiar caché expirado antes de verificar
      clearExpiredCache();
      
      // Verificar caché primero
      const cachedWeather = getFromCache(location, 'weather');
      const cachedForecast = getFromCache(location, 'forecast');
      
      if (cachedWeather && cachedForecast) {
        setWeatherData(cachedWeather);
        setForecastData(cachedForecast);
        setCurrentLocation(cachedWeather.location);
        
        toast.success(`Datos del clima cargados desde caché para ${cachedWeather.location}`, {
          icon: '💾',
          description: 'Datos guardados localmente'
        });
        
        setIsLoading(false);
        return;
      }
      
      // Si no hay caché válido, hacer petición a la API
      const [weather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setCurrentLocation(weather.location);
      
      // Guardar en caché
      saveToCache(weather.location, weather, 'weather');
      saveToCache(weather.location, forecast, 'forecast');
      
      // Verificar si está usando datos mock
      const isUsingMock = weather.location === 'Lima, PE' && weather.temperature === 22;
      if (isUsingMock) {
        toast.info(`Mostrando datos de ejemplo para ${location}`, {
          icon: '🔄',
          description: 'API key no válida o no activada - Guardado en caché'
        });
      } else {
        toast.success(`Datos del clima actualizados para ${weather.location}`, {
          icon: '🌤️',
          description: 'Datos guardados en caché por 30 minutos'
        });
      }
    } catch (error) {
      // Si hay error, cargar datos mock como fallback
      const mockWeather = await weatherService.getMockCurrentWeather();
      const mockForecast = await weatherService.getMockForecast();
      
      setWeatherData(mockWeather);
      setForecastData(mockForecast);
      
      toast.warning('Usando datos de ejemplo', {
        icon: '🔄',
        description: 'Problema con la API del clima'
      });
      console.error('Error loading weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Función para obtener ubicación actual del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no soportada en este navegador');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await weatherService.getCurrentWeatherByCoords(latitude, longitude);
          const forecast = await weatherService.getForecast(weather.location);
          
          setWeatherData(weather);
          setForecastData(forecast);
          setCurrentLocation(weather.location);
          
          // Verificar si está usando datos mock
          const isUsingMock = weather.location === 'Lima, PE';
          if (isUsingMock) {
            toast.info('Ubicación detectada, mostrando datos de ejemplo', {
              icon: '📍',
              description: 'API key no válida o no activada'
            });
          } else {
            toast.success(`Ubicación detectada: ${weather.location}`, {
              icon: '📍'
            });
          }
        } catch (error) {
          // Usar datos mock en caso de error
          const mockWeather = await weatherService.getMockCurrentWeather();
          const mockForecast = await weatherService.getMockForecast();
          
          setWeatherData(mockWeather);
          setForecastData(mockForecast);
          
          toast.warning('Usando datos de ejemplo para tu ubicación', {
            icon: '📍'
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        toast.error('No se pudo obtener la ubicación');
        console.error('Geolocation error:', error);
      }
    );
  };

  const aiSuggestions = [
    "¿Es buen día para actividades al aire libre?",
    "¿Cómo estará el clima para el fin de semana?",
    "¿Qué ropa me recomiendas usar hoy?",
    "¿Habrá lluvia en los próximos días?"
  ];  // Efecto para mostrar el modal y prevenir scroll
  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      // Mantener la posición actual de scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      setTimeout(() => setIsVisible(true), 50);
      // Limpiar caché expirado al abrir el modal
      clearExpiredCache();
      // Cargar datos meteorológicos al abrir (verificará caché automáticamente)
      if (!weatherData) {
        loadWeatherData();
      }
    } else {
      // Restaurar scroll del body
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      setIsVisible(false);
    }
    
    // Cleanup al desmontar el componente
    return () => {
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [isOpen]);
  // Efecto para scroll automático del chat
  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length > 0) {
      const scrollToBottom = () => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };
      
      // Pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory]);
  const handleLocationChange = (location) => {
    if (location.trim()) {
      setCurrentLocation(location);
      toast.info(`Cambiando ubicación a ${location}`, {
        icon: '📍'
      });
      loadWeatherData(location);
    }
  };

  // Función para alternar modo expandido
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    toast.success(
      isExpanded 
        ? 'Modo normal activado' 
        : 'Modo expandido activado',
      {
        icon: isExpanded ? '📱' : '🔍'
      }
    );
  };
  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    
    try {
      // Preparar el contexto meteorológico para enviar al backend
      const weatherContext = weatherData ? {
        location: weatherData.location,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        pressure: weatherData.pressure,
        visibility: weatherData.visibility,
        feelsLike: weatherData.feelsLike,
        forecast: forecastData.slice(0, 3) // Próximos 3 días
      } : null;

      // Enviar mensaje al backend
      const response = await weatherChatService.sendMessage(aiQuery, weatherContext);
      
      // Agregar al historial de chat
      const newMessage = {
        id: Date.now(),
        question: aiQuery,
        answer: response.message,
        timestamp: new Date(),
        isError: response.isError || false,
        isFallback: response.fallback || false
      };
        setChatHistory(prev => [...prev, newMessage]);
      setAiResponse(response.message);
      
      // Scroll inmediato después de agregar el mensaje
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
      setAiQuery(''); // Limpiar el input
      
      if (response.isError && !response.fallback) {
        toast.error('Error al conectar con el asistente IA', {
          icon: '⚠️',
          description: 'Usando respuesta local'
        });
      } else if (response.fallback) {
        toast.warning('Backend temporalmente no disponible', {
          icon: '🔄',
          description: 'Usando respuesta local'
        });
      } else {
        toast.success('Análisis de IA completado', {
          icon: '🤖',
          description: 'Respuesta generada por tu backend'
        });
      }
      
    } catch (error) {
      console.error('Error en consulta de IA:', error);
      setAiResponse('Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta de nuevo.');
      toast.error('Error en el asistente meteorológico');
    } finally {
      setIsAiLoading(false);
    }
  };

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
        overflow-hidden
      `}
      onClick={handleOverlayClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-blue-900/95 to-cyan-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          ${isExpanded 
            ? 'w-[95vw] h-[95vh] max-w-none max-h-none' 
            : 'w-full max-w-6xl h-[85vh]'
          }
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <WeatherIcon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400">+</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-green-400" />
                </div>
              </div>              <div>
                <h2 className="text-xl font-bold text-white">Meteorología + Google Maps</h2>
                <p className="text-sm text-gray-400">
                  {isExpanded ? 'Modo Expandido - Información meteorológica inteligente con IA' : 'Información meteorológica inteligente con IA'}
                </p>
              </div>
            </div>              <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-gray-400">
                  {weatherData?.location === 'Lima, PE' && weatherData?.temperature === 22 
                    ? 'Datos de Ejemplo' 
                    : 'API Weather Online'
                  }
                </span>
              </div>
              
              {/* Botón de expansión/contracción */}
              <button
                onClick={toggleExpanded}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 group"
                title={isExpanded ? "Contraer ventana" : "Expandir ventana"}
              >
                {isExpanded ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m5.5 11v4.5M9 20H4.5M9 20l-5.5 5.5m11-5.5v4.5m0-4.5H19.5m-4.5 4.5l5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>
        </div>        {/* Location Selector */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">📍 Ubicación:</span>
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  loadWeatherData(currentLocation);
                }
              }}
              placeholder="Ingresa una ciudad..."
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[200px]"
            />
            <button 
              onClick={() => loadWeatherData(currentLocation)}
              disabled={isLoading}
              className="text-xs bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '⏳' : '🔄'} Buscar
            </button>
            <button 
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="text-xs bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '⏳' : '�'} Mi Ubicación
            </button>
          </div>
          {error && (
            <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-1">
              {error}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-white/10">
          <div className="flex gap-1">            {[
              { id: 'current', label: 'Clima Actual', icon: '🌤️' },
              { id: 'forecast', label: 'Pronóstico', icon: '📊' },
              { id: 'charts', label: 'Gráficos', icon: '📈' },
              { id: 'maps', label: 'Mapa', icon: '🗺️' },
              { id: 'ai', label: 'IA Meteorológica', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Current Weather Tab */}
          {activeTab === 'current' && (
            <div className="p-6 h-full overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Cargando datos meteorológicos...</p>
                  </div>
                </div>
              ) : weatherData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                  {/* Current Conditions */}
                  <div className="col-span-1 md:col-span-2 bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Condiciones Actuales</h3>
                    <div className="flex items-center gap-6">
                      <div className="text-6xl">{weatherData.icon}</div>
                      <div>
                        <div className="text-4xl font-bold text-white">{weatherData.temperature}°C</div>
                        <div className="text-lg text-gray-300 capitalize">{weatherData.condition}</div>
                        <div className="text-sm text-gray-400">Sensación térmica: {weatherData.feelsLike || weatherData.temperature}°C</div>
                      </div>
                    </div>
                    {weatherData.sunrise && weatherData.sunset && (
                      <div className="mt-4 flex gap-6 text-sm text-gray-300">
                        <div>🌅 Amanecer: {weatherData.sunrise}</div>
                        <div>🌇 Atardecer: {weatherData.sunset}</div>
                      </div>
                    )}
                  </div>

                  {/* Weather Details */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Detalles</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">💧 Humedad</span>
                        <span className="text-white">{weatherData.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">💨 Viento</span>
                        <span className="text-white">{weatherData.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">🌡️ Presión</span>
                        <span className="text-white">{weatherData.pressure} hPa</span>
                      </div>                      <div className="flex justify-between">
                        <span className="text-gray-300">☀️ Índice UV</span>
                        <span className="text-white">{weatherData.uvIndex || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">👁️ Visibilidad</span>
                        <span className="text-white">{weatherData.visibility} km</span>
                      </div>                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6">Pronóstico de 7 días</h3>              <div className="grid gap-4">
                {forecastData.map((day, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20 flex items-center justify-between hover:bg-white/15 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{day.icon}</span>
                      <div>
                        <div className="font-medium text-white capitalize">{day.day}</div>
                        <div className="text-sm text-gray-300 capitalize">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-white">{day.temp}°C</div>
                      {day.maxTemp && day.minTemp && (
                        <div className="text-sm text-gray-300">
                          Max: {day.maxTemp}° Min: {day.minTemp}°
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6">📈 Análisis Gráfico del Clima</h3>
              <WeatherCharts 
                forecastData={forecastData} 
                weatherData={weatherData} 
              />
            </div>
          )}

          {/* Maps Tab */}
          {activeTab === 'maps' && (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6">Mapa Meteorológico</h3>
              <div className="bg-white/10 rounded-xl p-8 border border-white/20 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-300 text-lg">Integración con Google Maps</p>
                  <p className="text-gray-400 text-sm mt-2">Próximamente: Mapa interactivo con capas meteorológicas</p>
                  {weatherData?.coords && (
                    <div className="mt-4 text-xs text-gray-400">
                      📍 Coordenadas: {weatherData.coords.lat.toFixed(4)}, {weatherData.coords.lon.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="p-6 h-full overflow-y-auto flex flex-col">
              <h3 className="text-xl font-semibold text-white mb-6">🤖 Asistente IA Meteorológico</h3>
                {/* Chat History */}              <div ref={chatContainerRef} className={`flex-1 mb-6 space-y-4 overflow-y-auto ${isExpanded ? 'max-h-[60vh]' : 'max-h-60'}`}>
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p>Inicia una conversación con el asistente meteorológico</p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="space-y-3">                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className={`bg-blue-600/30 border border-blue-500/30 rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
                          <p className="text-white text-sm">{chat.question}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                        {/* AI Response */}
                      <div className="flex justify-start">
                        <div className={`rounded-lg px-4 py-2 ${isExpanded ? 'max-w-[70%]' : 'max-w-[80%]'} ${
                          chat.isError 
                            ? 'bg-red-600/20 border border-red-500/30' 
                            : chat.isFallback 
                              ? 'bg-yellow-600/20 border border-yellow-500/30'
                              : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30'
                        }`}>
                          <div className="flex items-start gap-2">
                            <div className="text-lg">🤖</div>                            <div className="flex-1">
                              <p className="text-white text-sm whitespace-pre-wrap">{chat.answer}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-300">
                                  {chat.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {chat.isFallback && (
                                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                                    Local
                                  </span>
                                )}
                                {!chat.isFallback && !chat.isError && (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    Backend
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* AI Query Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiQuery();
                      }
                    }}
                    placeholder="Escribe tu pregunta sobre el clima..."
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    onClick={handleAiQuery}
                    disabled={!aiQuery.trim() || isAiLoading}
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-500/30 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <OpenAI className="w-4 h-4" />
                        Enviar
                      </>
                    )}
                  </button>
                </div>
              </div>              {/* AI Suggestions - Solo mostrar en primera interacción */}
              {chatHistory.length === 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-3">💡 Preguntas sugeridas:</p>
                  <div className={`grid gap-2 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setAiQuery(suggestion)}
                        disabled={isAiLoading}
                        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 text-sm hover:bg-white/20 transition-colors disabled:opacity-50 text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}{/* Connection Status */}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherMapsModal;
