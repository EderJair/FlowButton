// src/features/dashboard/pages/DashboardHome.jsx
import React from 'react';
import { DashboardIcon, GmailIcon, DocumentCheckIcon, WorkflowIcon } from '../../../assets/icons';

const DashboardHome = () => {
  const stats = [
    {
      title: 'Flujos Activos',
      value: '12',
      icon: WorkflowIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Emails Enviados',
      value: '1,247',
      icon: GmailIcon,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Facturas Procesadas',
      value: '89',
      icon: DocumentCheckIcon,
      color: 'bg-yellow-500',
      change: '+23%'
    },
    {
      title: 'Tiempo Ahorrado',
      value: '24h',
      icon: DashboardIcon,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const recentActivity = [
    {
      action: 'Flujo "Email Marketing" ejecutado',
      time: 'Hace 5 minutos',
      status: 'success'
    },
    {
      action: 'Factura #INV-001 procesada',
      time: 'Hace 15 minutos',
      status: 'success'
    },
    {
      action: 'Nuevo flujo creado: "Seguimiento Clientes"',
      time: 'Hace 1 hora',
      status: 'info'
    },
    {
      action: 'Error en flujo "Backup Automático"',
      time: 'Hace 2 horas',
      status: 'error'
    }
  ];

  return (
    <div className="space-y-6">      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-lg p-6 text-white border border-white/20">
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
        <p className="text-blue-100">
          Aquí tienes un resumen de tu actividad y el estado de tus flujos automáticos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {stat.change} vs mes anterior
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {/* Recent Activity */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 dark:border-gray-700/50">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 dark:border-gray-700/50">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Acciones Rápidas
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Crear nuevo flujo
                </span>
                <span className="text-blue-700 dark:text-blue-300">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Enviar email automático
                </span>
                <span className="text-green-700 dark:text-green-300">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Procesar facturas
                </span>
                <span className="text-yellow-700 dark:text-yellow-300">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Ver analytics
                </span>
                <span className="text-purple-700 dark:text-purple-300">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
