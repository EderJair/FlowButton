// src/features/dashboard/components/analytics/FlowMetrics.jsx

import React, { useState } from 'react';
import { 
  WorkflowIcon,
  GmailIcon,
  OpenAI,
  DocumentCheckIcon,
  ShoppingCartIcon,
  WeatherIcon
} from '../../../../assets/icons';

const FlowMetrics = ({ flows, dailyData, timeRange }) => {
  const [sortBy, setSortBy] = useState('executions'); // executions, successRate, avgTime
  const [filterCategory, setFilterCategory] = useState('all');

  // Iconos por categoría
  const categoryIcons = {
    email: GmailIcon,
    legal: DocumentCheckIcon,
    documents: DocumentCheckIcon,
    finance: ShoppingCartIcon,
    weather: WeatherIcon,
    default: WorkflowIcon
  };

  // Filtrar y ordenar flujos
  const filteredFlows = flows
    .filter(flow => filterCategory === 'all' || flow.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'executions':
          return b.executions - a.executions;
        case 'successRate':
          return b.successRate - a.successRate;
        case 'avgTime':
          return a.avgExecutionTime - b.avgExecutionTime;
        default:
          return 0;
      }
    });

  // Calcular estadísticas
  const totalExecutions = flows.reduce((sum, flow) => sum + flow.executions, 0);
  const avgSuccessRate = flows.reduce((sum, flow) => sum + flow.successRate, 0) / flows.length;
  const mostActiveFlow = flows.reduce((max, flow) => flow.executions > max.executions ? flow : max);
  const recentExecutions = dailyData.slice(-7).reduce((sum, day) => sum + day.executions, 0);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'email', label: 'Email' },
    { value: 'legal', label: 'Legal' },
    { value: 'documents', label: 'Documentos' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'weather', label: 'Clima' }
  ];

  const sortOptions = [
    { value: 'executions', label: 'Más ejecutados' },
    { value: 'successRate', label: 'Mayor éxito' },
    { value: 'avgTime', label: 'Más rápidos' }
  ];

  const getStatusColor = (successRate) => {
    if (successRate >= 95) return 'text-green-600 bg-green-100';
    if (successRate >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatExecutionTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatLastExecution = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'Hace menos de 1 hora';
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales de Flujos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Flujos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{flows.length}</p>
            </div>
            <WorkflowIcon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {flows.filter(f => f.executions > 0).length} activos
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ejecuciones Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalExecutions.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">↗</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {recentExecutions} en los últimos 7 días
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Éxito Promedio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(avgSuccessRate)}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${avgSuccessRate >= 90 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
              <span className={`font-bold ${avgSuccessRate >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                {avgSuccessRate >= 90 ? '✓' : '!'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Todas las categorías
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Más Activo</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {mostActiveFlow.name}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">★</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {mostActiveFlow.executions} ejecuciones
          </p>
        </div>
      </div>

      {/* Filtros y Ordenación */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detalle de Flujos ({filteredFlows.length})
          </h3>
          
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Flujos */}
      <div className="space-y-4">
        {filteredFlows.map((flow, index) => {
          const IconComponent = categoryIcons[flow.category] || categoryIcons.default;
          
          return (
            <div key={flow.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>
                    <IconComponent className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {flow.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      Categoría: {flow.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Ejecuciones */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {flow.executions.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ejecuciones</p>
                  </div>

                  {/* Tasa de Éxito */}
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${flow.successRate >= 95 ? 'text-green-600' : flow.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {flow.successRate}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Éxito</p>
                  </div>

                  {/* Tiempo Promedio */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatExecutionTime(flow.avgExecutionTime)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo Avg</p>
                  </div>

                  {/* Estado */}
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(flow.successRate)}`}>
                      {flow.successRate >= 95 ? 'Excelente' : flow.successRate >= 80 ? 'Bueno' : 'Requiere atención'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatLastExecution(flow.lastExecution)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Progreso del Éxito */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Tasa de éxito</span>
                  <span>{flow.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      flow.successRate >= 95 ? 'bg-green-500' : 
                      flow.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${flow.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlows.length === 0 && (
        <div className="text-center py-12">
          <WorkflowIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron flujos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Prueba con diferentes filtros o categorías.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlowMetrics;
