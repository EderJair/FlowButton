// src/services/weatherService.js

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  constructor() {
    if (!API_KEY) {
      console.warn('⚠️ OpenWeatherMap API key not found. Using mock data.');
    } else {
      console.log('🔑 OpenWeatherMap API key loaded');
    }
  }

  // Obtener clima actual por ciudad
  async getCurrentWeather(city) {
    if (!API_KEY) {
      console.warn('🔄 No API key - Using mock data');
      return this.getMockCurrentWeather();
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ API key inválida o no activada. Usando datos mock.');
          return this.getMockCurrentWeather();
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos reales obtenidos de OpenWeatherMap');
      return this.formatCurrentWeather(data);
    } catch (error) {
      console.error('🔄 Error con API, usando datos mock:', error);
      return this.getMockCurrentWeather();
    }
  }
  // Obtener pronóstico de 5 días
  async getForecast(city) {
    if (!API_KEY) {
      console.warn('🔄 No API key - Using mock forecast');
      return this.getMockForecast();
    }

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ API key inválida para pronóstico. Usando datos mock.');
          return this.getMockForecast();
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Pronóstico real obtenido de OpenWeatherMap');
      return this.formatForecast(data);
    } catch (error) {
      console.error('🔄 Error con API forecast, usando datos mock:', error);
      return this.getMockForecast();
    }
  }
  // Obtener clima por coordenadas
  async getCurrentWeatherByCoords(lat, lon) {
    if (!API_KEY) {
      console.warn('🔄 No API key - Using mock data for coordinates');
      return this.getMockCurrentWeather();
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ API key inválida para coordenadas. Usando datos mock.');
          return this.getMockCurrentWeather();
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos por coordenadas obtenidos de OpenWeatherMap');
      return this.formatCurrentWeather(data);
    } catch (error) {
      console.error('🔄 Error con API coordinates, usando datos mock:', error);
      return this.getMockCurrentWeather();
    }
  }

  // Formatear datos del clima actual
  formatCurrentWeather(data) {
    return {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s a km/h
      pressure: data.main.pressure,
      uvIndex: 0, // No disponible en la API gratuita
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 'N/A',
      icon: this.getWeatherIcon(data.weather[0].icon),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      feelsLike: Math.round(data.main.feels_like),
      coords: {
        lat: data.coord.lat,
        lon: data.coord.lon
      }
    };
  }
  // Formatear pronóstico
  formatForecast(data) {
    const forecast = [];
    const dailyData = {};

    // Agrupar por día
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          temps: [],
          conditions: [],
          icons: [],
          hourlyData: [] // Guardar datos horarios para gráficos
        };
      }

      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].conditions.push(item.weather[0].description);
      dailyData[dayKey].icons.push(item.weather[0].icon);
      dailyData[dayKey].hourlyData.push({
        time: date.getHours(),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].description,
        icon: this.getWeatherIcon(item.weather[0].icon)
      });
    });

    // Convertir a formato de pronóstico
    Object.values(dailyData).slice(0, 7).forEach((day, index) => {
      const maxTemp = Math.round(Math.max(...day.temps));
      const minTemp = Math.round(Math.min(...day.temps));
      const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length);

      forecast.push({
        day: index === 0 ? 'Hoy' : 
             index === 1 ? 'Mañana' : 
             day.date.toLocaleDateString('es-ES', { weekday: 'long' }),
        temp: avgTemp,
        maxTemp,
        minTemp,
        condition: day.conditions[0],
        icon: this.getWeatherIcon(day.icons[0]),
        hourlyData: day.hourlyData // Incluir datos horarios
      });
    });

    return forecast;
  }

  // Convertir códigos de iconos a emojis
  getWeatherIcon(iconCode) {
    const iconMap = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };

    return iconMap[iconCode] || '🌤️';
  }

  // Datos mock de respaldo
  getMockCurrentWeather() {
    return Promise.resolve({
      location: 'Lima, PE',
      temperature: 22,
      condition: 'parcialmente nublado',
      humidity: 65,
      windSpeed: 15,
      pressure: 1013,
      uvIndex: 6,
      visibility: 10,
      icon: '⛅',
      sunrise: '06:30',
      sunset: '18:15',
      feelsLike: 24,
      coords: { lat: -12.0464, lon: -77.0428 }
    });
  }

  getMockForecast() {
    return Promise.resolve([
      { day: 'Hoy', temp: 22, maxTemp: 25, minTemp: 19, condition: 'parcialmente nublado', icon: '⛅' },
      { day: 'Mañana', temp: 25, maxTemp: 28, minTemp: 21, condition: 'soleado', icon: '☀️' },
      { day: 'jueves', temp: 20, maxTemp: 23, minTemp: 17, condition: 'lluvia ligera', icon: '🌧️' },
      { day: 'viernes', temp: 23, maxTemp: 26, minTemp: 20, condition: 'nublado', icon: '☁️' },
      { day: 'sábado', temp: 26, maxTemp: 29, minTemp: 23, condition: 'soleado', icon: '☀️' },
      { day: 'domingo', temp: 24, maxTemp: 27, minTemp: 21, condition: 'parcialmente nublado', icon: '⛅' },
      { day: 'lunes', temp: 21, maxTemp: 24, minTemp: 18, condition: 'lluvia', icon: '🌧️' }
    ]);
  }
}

export default new WeatherService();
