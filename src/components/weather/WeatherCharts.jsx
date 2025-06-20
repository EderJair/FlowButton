// src/components/weather/WeatherCharts.jsx

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeatherCharts = ({ forecastData, weatherData }) => {
  // Verificar si tenemos datos horarios reales
  const hasRealHourlyData = forecastData[0]?.hourlyData && forecastData[0].hourlyData.length > 0;
  const isUsingRealData = weatherData?.location !== 'Lima, PE' || weatherData?.temperature !== 22;
  // Extraer datos para el gráfico de temperatura
  const temperatureData = {
    labels: forecastData.map(day => day.day),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: forecastData.map(day => day.temp),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      ...(forecastData[0]?.maxTemp ? [{
        label: 'Temp. Máxima (°C)',
        data: forecastData.map(day => day.maxTemp || day.temp + 3),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }] : []),
      ...(forecastData[0]?.minTemp ? [{
        label: 'Temp. Mínima (°C)',
        data: forecastData.map(day => day.minTemp || day.temp - 3),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }] : []),
    ],
  };
  // Datos simulados de temperatura por horas (basados en datos reales si están disponibles)
  const hourlyData = {
    labels: (() => {
      // Si tenemos datos horarios reales del primer día del pronóstico
      if (forecastData[0]?.hourlyData && forecastData[0].hourlyData.length > 0) {
        return forecastData[0].hourlyData.map(hour => `${hour.time}:00`);
      }
      // Sino, generar horas del día
      return Array.from({ length: 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(i, 0, 0, 0);
        return hour.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      });
    })(),
    datasets: [
      {
        label: 'Temperatura por Hora (°C)',
        data: (() => {
          // Si tenemos datos horarios reales
          if (forecastData[0]?.hourlyData && forecastData[0].hourlyData.length > 0) {
            return forecastData[0].hourlyData.map(hour => hour.temp);
          }
          // Sino, simular basado en temperatura actual
          return Array.from({ length: 24 }, (_, i) => {
            const baseTemp = weatherData?.temperature || 22;
            const hourVariation = Math.sin((i - 6) * Math.PI / 12) * 8;
            const randomVariation = (Math.random() - 0.5) * 4;
            return Math.round(baseTemp + hourVariation + randomVariation);
          });
        })(),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 3,
      },
    ],
  };

  // Datos de condiciones meteorológicas
  const conditionsData = {
    labels: ['Humedad', 'Viento', 'Presión', 'Visibilidad'],
    datasets: [
      {
        label: 'Condiciones Actuales',
        data: [
          weatherData?.humidity || 65,
          weatherData?.windSpeed || 15,
          (weatherData?.pressure || 1013) / 10, // Dividir para mejor escala
          weatherData?.visibility || 10,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">      {/* Gráfico de Pronóstico de Temperatura */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            📈 Pronóstico de Temperatura (7 días)
          </h3>
          <div className={`px-2 py-1 rounded text-xs ${isUsingRealData ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {isUsingRealData ? '✅ API Data' : '🔄 Demo'}
          </div>
        </div>
        <div className="h-64">
          <Line data={temperatureData} options={chartOptions} />
        </div>
      </div>{/* Gráfico de Temperatura por Horas */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🕐 Temperatura por Horas ({hasRealHourlyData ? 'Datos Reales' : 'Simulado'})
          </h3>
          <div className={`px-2 py-1 rounded text-xs ${hasRealHourlyData ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {hasRealHourlyData ? '✅ API Data' : '🔄 Simulado'}
          </div>
        </div>
        <div className="h-64">
          <Line data={hourlyData} options={chartOptions} />
        </div>
      </div>

      {/* Gráfico de Condiciones Actuales */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Condiciones Meteorológicas
        </h3>
        <div className="h-64">
          <Bar data={conditionsData} options={barOptions} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-300">
          <div className="text-center">
            <div className="text-blue-400 font-medium">Humedad</div>
            <div>{weatherData?.humidity || 65}%</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-medium">Viento</div>
            <div>{weatherData?.windSpeed || 15} km/h</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-medium">Presión</div>
            <div>{weatherData?.pressure || 1013} hPa</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-medium">Visibilidad</div>
            <div>{weatherData?.visibility || 10} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCharts;
