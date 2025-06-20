// src/features/dashboard/components/analytics/SystemHealth.jsx

import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SystemHealth = ({ systemHealth, timeRange }) => {
  const [realTimeData, setRealTimeData] = useState(systemHealth);
  const [historicalData, setHistoricalData] = useState([]);

  // Simular datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(5, Math.min(50, prev.cpuUsage + (Math.random() - 0.5) * 8)),
        activeTasks: Math.max(1, Math.min(20, prev.activeTasks + Math.floor((Math.random() - 0.5) * 3))),
        queuedTasks: Math.max(0, Math.min(10, prev.queuedTasks + Math.floor((Math.random() - 0.5) * 2)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generar datos históricos
  useEffect(() => {
    const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const points = timeRange === '1d' ? 24 : days; // horas para 1d, días para el resto
    
    const historical = Array.from({ length: points }, (_, i) => {
      const time = timeRange === '1d' 
        ? new Date(Date.now() - (points - i - 1) * 60 * 60 * 1000) // horas
        : new Date(Date.now() - (points - i - 1) * 24 * 60 * 60 * 1000); // días
      
      return {
        time: time.toISOString(),
        memoryUsage: Math.floor(Math.random() * 30) + 35,
        cpuUsage: Math.floor(Math.random() * 25) + 10,
        diskUsage: Math.floor(Math.random() * 5) + systemHealth.diskUsage,
        uptime: 99.5 + Math.random() * 0.4,
        activeTasks: Math.floor(Math.random() * 8) + 3,
        queuedTasks: Math.floor(Math.random() * 3) + 1
      };
    });

    setHistoricalData(historical);
  }, [timeRange, systemHealth.diskUsage]);

  // Configuración de colores
  const chartColors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
    purple: '#7C3AED'
  };

  // Datos para gráfico de uso de recursos en tiempo real
  const resourceUsageData = {
    labels: historicalData.map(item => {
      const date = new Date(item.time);
      return timeRange === '1d' 
        ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Memoria (%)',
        data: historicalData.map(item => item.memoryUsage),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primary + '20',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'CPU (%)',
        data: historicalData.map(item => item.cpuUsage),
        borderColor: chartColors.success,
        backgroundColor: chartColors.success + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      }
    ]
  };

  // Datos para gráfico de uptime
  const uptimeData = {
    labels: ['Uptime', 'Downtime'],
    datasets: [{
      data: [realTimeData.uptime, 100 - realTimeData.uptime],
      backgroundColor: [chartColors.success, chartColors.danger],
      borderWidth: 0
    }]
  };

  // Datos para gráfico de tareas
  const tasksData = {
    labels: historicalData.map(item => {
      const date = new Date(item.time);
      return timeRange === '1d' 
        ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Tareas Activas',
        data: historicalData.map(item => item.activeTasks),
        backgroundColor: chartColors.info,
        borderColor: chartColors.info,
        borderWidth: 1
      },
      {
        label: 'Tareas en Cola',
        data: historicalData.map(item => item.queuedTasks),
        backgroundColor: chartColors.warning,
        borderColor: chartColors.warning,
        borderWidth: 1
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
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        grid: {
          color: '#E5E7EB'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '60%'
  };

  // Función para obtener el color del estado de salud
  const getHealthColor = (value, type) => {
    if (type === 'uptime') {
      if (value >= 99.5) return 'text-green-500';
      if (value >= 99) return 'text-yellow-500';
      return 'text-red-500';
    }
    
    if (type === 'memory' || type === 'cpu') {
      if (value <= 50) return 'text-green-500';
      if (value <= 75) return 'text-yellow-500';
      return 'text-red-500';
    }
    
    if (type === 'disk') {
      if (value <= 70) return 'text-green-500';
      if (value <= 85) return 'text-yellow-500';
      return 'text-red-500';
    }
    
    return 'text-gray-500';
  };

  // Función para obtener el estado de salud general
  const getOverallHealth = () => {
    const memoryScore = realTimeData.memoryUsage <= 50 ? 100 : realTimeData.memoryUsage <= 75 ? 75 : 50;
    const cpuScore = realTimeData.cpuUsage <= 30 ? 100 : realTimeData.cpuUsage <= 60 ? 75 : 50;
    const uptimeScore = realTimeData.uptime >= 99.5 ? 100 : realTimeData.uptime >= 99 ? 75 : 50;
    const diskScore = systemHealth.diskUsage <= 70 ? 100 : systemHealth.diskUsage <= 85 ? 75 : 50;
    
    const overallScore = (memoryScore + cpuScore + uptimeScore + diskScore) / 4;
    
    if (overallScore >= 90) return { status: 'Excelente', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (overallScore >= 75) return { status: 'Bueno', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (overallScore >= 60) return { status: 'Regular', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { status: 'Crítico', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const overallHealth = getOverallHealth();

  return (
    <div className="space-y-6">
      {/* Estado General del Sistema */}
      <div className={`p-6 rounded-lg border ${overallHealth.bg} border-white/20 dark:border-gray-700/50`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estado General del Sistema</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monitoreo en tiempo real de la salud del sistema
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${overallHealth.color}`}>
              {overallHealth.status}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
              <p className={`text-2xl font-bold ${getHealthColor(realTimeData.uptime, 'uptime')}`}>
                {realTimeData.uptime.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>          <div className="mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.floor(realTimeData.uptime * 24 * (timeRange === '1d' ? 1 : 7) / 100)} horas activo
            </span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uso de Memoria</p>
              <p className={`text-2xl font-bold ${getHealthColor(realTimeData.memoryUsage, 'memory')}`}>
                {realTimeData.memoryUsage.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${realTimeData.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uso de CPU</p>
              <p className={`text-2xl font-bold ${getHealthColor(realTimeData.cpuUsage, 'cpu')}`}>
                {realTimeData.cpuUsage.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${realTimeData.cpuUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uso de Disco</p>
              <p className={`text-2xl font-bold ${getHealthColor(systemHealth.diskUsage, 'disk')}`}>
                {systemHealth.diskUsage}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${systemHealth.diskUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uso de Recursos */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uso de Recursos ({timeRange})
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={resourceUsageData} options={chartOptions} />
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Disponibilidad del Sistema
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={uptimeData} options={doughnutOptions} />
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {realTimeData.uptime.toFixed(2)}% de disponibilidad
            </p>
          </div>
        </div>
      </div>

      {/* Gestión de Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tareas */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gestión de Tareas ({timeRange})
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={tasksData} options={chartOptions} />
          </div>
        </div>

        {/* Estado Actual de Tareas */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estado Actual de Tareas
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{realTimeData.activeTasks}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tareas Activas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">En ejecución</p>
                </div>
              </div>
              <span className="text-blue-500 font-semibold">Ejecutando</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{realTimeData.queuedTasks}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tareas en Cola</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Esperando ejecución</p>
                </div>
              </div>
              <span className="text-yellow-500 font-semibold">Pendiente</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {Math.floor(Math.random() * 50) + 100}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tareas Completadas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hoy</p>
                </div>
              </div>
              <span className="text-green-500 font-semibold">Completo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y Recomendaciones */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alertas y Recomendaciones del Sistema
        </h3>
        <div className="space-y-3">
          {realTimeData.memoryUsage > 70 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Alto uso de memoria</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  El uso de memoria está en {realTimeData.memoryUsage.toFixed(1)}%. Considera reiniciar servicios no críticos.
                </p>
              </div>
            </div>
          )}

          {realTimeData.cpuUsage > 60 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Alto uso de CPU</p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  El uso de CPU está en {realTimeData.cpuUsage.toFixed(1)}%. Revisa los procesos en ejecución.
                </p>
              </div>
            </div>
          )}

          {systemHealth.diskUsage > 85 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Espacio en disco crítico</p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  El disco está al {systemHealth.diskUsage}%. Libera espacio inmediatamente.
                </p>
              </div>
            </div>
          )}

          {realTimeData.queuedTasks > 5 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Cola de tareas alta</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Hay {realTimeData.queuedTasks} tareas en cola. Considera aumentar la capacidad de procesamiento.
                </p>
              </div>
            </div>
          )}

          {overallHealth.status === 'Excelente' && (
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Sistema funcionando óptimamente</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Todos los sistemas están funcionando dentro de los parámetros normales.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
