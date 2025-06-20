// src/features/dashboard/components/analytics/APIMetrics.jsx

import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  OpenAI,
  GmailIcon,
  WeatherIcon,
  ShoppingCartIcon,
  WorkflowIcon
} from '../../../../assets/icons';

const APIMetrics = ({ apiMetrics, dailyData, timeRange }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('all');

  // Iconos por endpoint
  const endpointIcons = {
    'OpenAI GPT-4': OpenAI,
    'Gmail API': GmailIcon,
    'Weather API': WeatherIcon,
    'N8N Webhooks': WorkflowIcon,
    'Currency API': ShoppingCartIcon
  };

  // Datos para gráfico de llamadas por endpoint
  const endpointCallsData = {
    labels: apiMetrics.endpoints.map(ep => ep.name.split(' ')[0]), // Nombres cortos
    datasets: [
      {
        label: 'Llamadas API',
        data: apiMetrics.endpoints.map(ep => ep.calls),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED'
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  // Datos para gráfico de tiempo de respuesta por endpoint
  const responseTimeData = {
    labels: apiMetrics.endpoints.map(ep => ep.name.split(' ')[0]),
    datasets: [
      {
        label: 'Tiempo de Respuesta (ms)',
        data: apiMetrics.endpoints.map(ep => ep.avgTime),
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF6' + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  };

  // Datos para tendencia de llamadas API diarias
  const dailyApiCallsData = {
    labels: dailyData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Llamadas API',
        data: dailyData.map(day => day.apiCalls),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6' + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: '#E5E7EB',
          display: true
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#E5E7EB',
          display: true
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  };

  // Calcular estadísticas
  const totalApiCalls = apiMetrics.endpoints.reduce((sum, ep) => sum + ep.calls, 0);
  const avgResponseTime = Math.round(apiMetrics.endpoints.reduce((sum, ep) => sum + ep.avgTime, 0) / apiMetrics.endpoints.length);
  const fastestEndpoint = apiMetrics.endpoints.reduce((min, ep) => ep.avgTime < min.avgTime ? ep : min);
  const mostUsedEndpoint = apiMetrics.endpoints.reduce((max, ep) => ep.calls > max.calls ? ep : max);

  const getPerformanceColor = (avgTime) => {
    if (avgTime < 300) return 'text-green-600 bg-green-100';
    if (avgTime < 600) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getUsageIntensity = (calls) => {
    const maxCalls = Math.max(...apiMetrics.endpoints.map(ep => ep.calls));
    return (calls / maxCalls) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales de APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Llamadas API</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalApiCalls.toLocaleString()}
              </p>
            </div>
            <OpenAI className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {apiMetrics.endpoints.length} endpoints activos
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgResponseTime}ms
              </p>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${avgResponseTime < 400 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
              <span className={`font-bold ${avgResponseTime < 400 ? 'text-green-600' : 'text-yellow-600'}`}>
                ⚡
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Todas las APIs
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Más Rápida</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {fastestEndpoint.name.split(' ')[0]}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">🚀</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {fastestEndpoint.avgTime}ms promedio
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Más Usada</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {mostUsedEndpoint.name.split(' ')[0]}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">📊</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {mostUsedEndpoint.calls.toLocaleString()} llamadas
          </p>
        </div>
      </div>

      {/* Gráficos de APIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Llamadas por Endpoint */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Llamadas por Endpoint
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={endpointCallsData} options={chartOptions} />
          </div>
        </div>

        {/* Tiempo de Respuesta */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tiempo de Respuesta por Endpoint
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={responseTimeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tendencia de Llamadas API */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tendencia de Llamadas API
        </h3>
        <div style={{ height: '250px' }}>
          <Line data={dailyApiCallsData} options={chartOptions} />
        </div>
      </div>

      {/* Detalle de Endpoints */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Detalle de Endpoints
        </h3>
        
        <div className="space-y-4">
          {apiMetrics.endpoints.map((endpoint, index) => {
            const IconComponent = endpointIcons[endpoint.name] || OpenAI;
            const usagePercentage = getUsageIntensity(endpoint.calls);
            
            return (
              <div key={endpoint.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <IconComponent className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {endpoint.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        API Endpoint
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Número de Llamadas */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {endpoint.calls.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Llamadas</p>
                    </div>

                    {/* Tiempo de Respuesta */}
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${endpoint.avgTime < 300 ? 'text-green-600' : endpoint.avgTime < 600 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {endpoint.avgTime}ms
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo Avg</p>
                    </div>

                    {/* Estado de Rendimiento */}
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(endpoint.avgTime)}`}>
                        {endpoint.avgTime < 300 ? 'Excelente' : endpoint.avgTime < 600 ? 'Bueno' : 'Lento'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Rendimiento
                      </p>
                    </div>

                    {/* Porcentaje de Uso */}
                    <div className="text-center min-w-[80px]">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {Math.round(usagePercentage)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Uso relativo</p>
                    </div>
                  </div>
                </div>

                {/* Barra de Uso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Intensidad de uso</span>
                    <span>{Math.round(usagePercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información de N8N */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Integración N8N
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <WorkflowIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {apiMetrics.endpoints.find(ep => ep.name.includes('N8N'))?.calls || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Webhooks N8N</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <p className="text-2xl font-bold text-green-600">99.2%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Disponibilidad</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">⚡</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {apiMetrics.endpoints.find(ep => ep.name.includes('N8N'))?.avgTime || 0}ms
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Latencia N8N</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Estado del Sistema N8N</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800 dark:text-blue-400">Última sincronización:</span>
            <span className="text-blue-900 dark:text-blue-300 font-medium">Hace 2 minutos</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-blue-800 dark:text-blue-400">Workflows activos:</span>
            <span className="text-blue-900 dark:text-blue-300 font-medium">{apiMetrics.endpoints.length} conectados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIMetrics;
