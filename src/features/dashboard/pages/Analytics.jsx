// src/features/dashboard/pages/Analytics.jsx

import React, { useState, useEffect } from 'react';
import { 
  GrowthIcon, 
  WorkflowIcon, 
  NotificationBellIcon,
  DashboardIcon,
  OpenAI,
  GmailIcon,
  DocumentCheckIcon,
  ShoppingCartIcon
} from '../../../assets/icons';
import { DASHBOARD_FLOWS } from '../data/flowsData';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import FlowMetrics from '../components/analytics/FlowMetrics';
import APIMetrics from '../components/analytics/APIMetrics';
import SystemHealth from '../components/analytics/SystemHealth';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d
  const [activeTab, setActiveTab] = useState('overview'); // overview, flows, apis, system
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular datos de analytics (en producción vendrían de una API)
  useEffect(() => {
    const generateAnalyticsData = () => {
      const now = new Date();
      const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      // Generar datos de ejemplo para flujos
      const flowExecutions = DASHBOARD_FLOWS.map(flow => ({
        id: flow.id,
        name: flow.title,
        executions: Math.floor(Math.random() * 100) + 20,
        successRate: Math.floor(Math.random() * 20) + 80,
        avgExecutionTime: Math.floor(Math.random() * 1000) + 500,
        lastExecution: new Date(now - Math.random() * days * 24 * 60 * 60 * 1000),
        category: flow.category
      }));

      // Generar datos diarios
      const dailyData = Array.from({ length: days }, (_, i) => {
        const date = new Date(now - (days - i - 1) * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          executions: Math.floor(Math.random() * 50) + 10,
          successes: Math.floor(Math.random() * 45) + 8,
          failures: Math.floor(Math.random() * 5) + 1,
          apiCalls: Math.floor(Math.random() * 200) + 50,
          avgResponseTime: Math.floor(Math.random() * 500) + 200
        };
      });

      return {
        overview: {
          totalExecutions: flowExecutions.reduce((sum, flow) => sum + flow.executions, 0),
          successRate: Math.round(flowExecutions.reduce((sum, flow) => sum + flow.successRate, 0) / flowExecutions.length),
          activeFlows: flowExecutions.filter(flow => flow.executions > 0).length,
          totalFlows: flowExecutions.length,
          avgExecutionTime: Math.round(flowExecutions.reduce((sum, flow) => sum + flow.avgExecutionTime, 0) / flowExecutions.length),
          apiCalls: dailyData.reduce((sum, day) => sum + day.apiCalls, 0),
          timeSaved: Math.floor(Math.random() * 20) + 5, // horas
          costSaved: Math.floor(Math.random() * 500) + 100 // USD
        },
        flows: flowExecutions,
        dailyData,
        apiMetrics: {
          totalCalls: dailyData.reduce((sum, day) => sum + day.apiCalls, 0),
          avgResponseTime: Math.round(dailyData.reduce((sum, day) => sum + day.avgResponseTime, 0) / dailyData.length),
          endpoints: [
            { name: 'OpenAI GPT-4', calls: Math.floor(Math.random() * 300) + 100, avgTime: 850 },
            { name: 'Gmail API', calls: Math.floor(Math.random() * 200) + 80, avgTime: 420 },
            { name: 'Weather API', calls: Math.floor(Math.random() * 150) + 50, avgTime: 320 },
            { name: 'N8N Webhooks', calls: Math.floor(Math.random() * 400) + 150, avgTime: 180 },
            { name: 'Currency API', calls: Math.floor(Math.random() * 100) + 30, avgTime: 250 }
          ]
        },
        systemHealth: {
          uptime: 99.8,
          memoryUsage: Math.floor(Math.random() * 30) + 40,
          cpuUsage: Math.floor(Math.random() * 20) + 15,
          diskUsage: Math.floor(Math.random() * 15) + 25,
          activeTasks: Math.floor(Math.random() * 10) + 5,
          queuedTasks: Math.floor(Math.random() * 5) + 1
        }
      };
    };

    setIsLoading(true);
    // Simular loading
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setIsLoading(false);
    }, 800);
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '1d', label: 'Último día' },
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
    { value: '90d', label: '90 días' }
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen General', icon: DashboardIcon },
    { id: 'flows', label: 'Flujos', icon: WorkflowIcon },
    { id: 'apis', label: 'APIs & N8N', icon: OpenAI },
    { id: 'system', label: 'Sistema', icon: GrowthIcon }
  ];

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estadísticas y Análisis</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando datos analíticos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Estadísticas y Análisis</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Métricas detalladas de flujos, APIs y rendimiento del sistema
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Período:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Ejecuciones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.totalExecutions.toLocaleString()}
              </p>
            </div>
            <WorkflowIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">↗ +12%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.successRate}%
              </p>
            </div>
            <GrowthIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">↗ +2.3%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Llamadas API</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.apiCalls.toLocaleString()}
              </p>
            </div>
            <OpenAI className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">↗ +8.5%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo Ahorrado</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.overview.timeSaved}h
              </p>
            </div>
            <NotificationBellIcon className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500">↗ +15%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <AnalyticsCharts 
            data={analyticsData} 
            timeRange={timeRange}
          />
        )}
        
        {activeTab === 'flows' && (
          <FlowMetrics 
            flows={analyticsData.flows}
            dailyData={analyticsData.dailyData}
            timeRange={timeRange}
          />
        )}
        
        {activeTab === 'apis' && (
          <APIMetrics 
            apiMetrics={analyticsData.apiMetrics}
            dailyData={analyticsData.dailyData}
            timeRange={timeRange}
          />
        )}
        
        {activeTab === 'system' && (
          <SystemHealth 
            systemHealth={analyticsData.systemHealth}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
};

export default Analytics;
