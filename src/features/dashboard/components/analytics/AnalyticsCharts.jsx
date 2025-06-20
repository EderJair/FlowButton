// src/features/dashboard/components/analytics/AnalyticsCharts.jsx

import React from 'react';
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

const AnalyticsCharts = ({ data, timeRange }) => {
  // Configuración de colores para tema oscuro/claro
  const chartColors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#8B5CF6',
    text: '#6B7280',
    grid: '#E5E7EB'
  };

  // Datos para gráfico de ejecuciones diarias
  const executionsChartData = {
    labels: data.dailyData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Ejecuciones Exitosas',
        data: data.dailyData.map(day => day.successes),
        borderColor: chartColors.success,
        backgroundColor: chartColors.success + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.success,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Ejecuciones Fallidas',
        data: data.dailyData.map(day => day.failures),
        borderColor: chartColors.danger,
        backgroundColor: chartColors.danger + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.danger,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  // Datos para gráfico de distribución de flujos
  const flowDistributionData = {
    labels: ['Email', 'Legal', 'Documentos', 'Finanzas', 'Clima', 'Otros'],
    datasets: [
      {
        data: [
          data.flows.filter(f => f.category === 'email').reduce((sum, f) => sum + f.executions, 0),
          data.flows.filter(f => f.category === 'legal').reduce((sum, f) => sum + f.executions, 0),
          data.flows.filter(f => f.category === 'documents').reduce((sum, f) => sum + f.executions, 0),
          data.flows.filter(f => f.category === 'finance').reduce((sum, f) => sum + f.executions, 0),
          data.flows.filter(f => f.category === 'weather').reduce((sum, f) => sum + f.executions, 0),
          data.flows.filter(f => !['email', 'legal', 'documents', 'finance', 'weather'].includes(f.category)).reduce((sum, f) => sum + f.executions, 0)
        ],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#6B7280'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Datos para gráfico de tiempo de respuesta API
  const apiResponseTimeData = {
    labels: data.dailyData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Tiempo de Respuesta (ms)',
        data: data.dailyData.map(day => day.avgResponseTime),
        backgroundColor: chartColors.info,
        borderColor: chartColors.info,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
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
          color: chartColors.text
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: chartColors.grid,
          display: true
        },
        ticks: {
          color: chartColors.text
        }
      },
      y: {
        grid: {
          color: chartColors.grid,
          display: true
        },
        ticks: {
          color: chartColors.text
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: chartColors.text
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ejecuciones Diarias */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ejecuciones Diarias
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={executionsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Distribución por Categoría */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución por Categoría
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={flowDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Métricas de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tiempo de Respuesta API */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tiempo de Respuesta API
          </h3>
          <div style={{ height: '250px' }}>
            <Bar data={apiResponseTimeData} options={chartOptions} />
          </div>
        </div>

        {/* Métricas Clave */}
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Flujos Activos</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.activeFlows} / {data.overview.totalFlows}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(data.overview.activeFlows / data.overview.totalFlows) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo Promedio</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.overview.avgExecutionTime}ms
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              por ejecución
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ahorro Estimado</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${data.overview.costSaved}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              en el período
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de Actividad Reciente */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.dailyData[data.dailyData.length - 1]?.executions || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ejecuciones Hoy</p>
          </div>
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((data.dailyData[data.dailyData.length - 1]?.successes / data.dailyData[data.dailyData.length - 1]?.executions) * 100) || 0}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Éxito Hoy</p>
          </div>
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.dailyData[data.dailyData.length - 1]?.apiCalls || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">APIs Hoy</p>
          </div>
          <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.dailyData[data.dailyData.length - 1]?.avgResponseTime || 0}ms
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Respuesta Hoy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
