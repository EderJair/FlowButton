// src/features/dashboard/pages/EmailAutomation.jsx
import React, { useState } from 'react';
import { GmailIcon } from '../../../assets/icons';

const EmailAutomation = () => {
  const [activeTab, setActiveTab] = useState('templates');

  const emailTemplates = [
    {
      id: 1,
      name: 'Bienvenida a nuevos usuarios',
      subject: '¡Bienvenido a FlowButton!',
      status: 'active',
      sent: 142,
      openRate: '68%'
    },
    {
      id: 2,
      name: 'Seguimiento post-venta',
      subject: '¿Cómo ha sido tu experiencia?',
      status: 'active',
      sent: 89,
      openRate: '45%'
    },
    {
      id: 3,
      name: 'Newsletter semanal',
      subject: 'Novedades de la semana',
      status: 'paused',
      sent: 256,
      openRate: '72%'
    }
  ];

  const recentEmails = [
    {
      to: 'cliente@example.com',
      subject: 'Bienvenida a FlowButton',
      status: 'delivered',
      time: 'Hace 5 min'
    },
    {
      to: 'usuario@demo.com',
      subject: 'Newsletter semanal',
      status: 'opened',
      time: 'Hace 15 min'
    },
    {
      to: 'test@mail.com',
      subject: 'Seguimiento post-venta',
      status: 'pending',
      time: 'Hace 1 hora'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Automatización de Emails
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y automatiza tus campañas de email
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Nuevo Template
        </button>
      </div>      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center">
            <GmailIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">487</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Emails enviados</p>
            </div>
          </div>
        </div>        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">68%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de apertura</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-yellow-600 font-bold">↗</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">23%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click rate</p>
            </div>
          </div>
        </div>        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 font-bold">⚡</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flujos activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Campañas
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recent'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Emails Recientes
          </button>
        </nav>
      </div>      {/* Content */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/50">
        {activeTab === 'templates' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Templates de Email
            </h3>
            <div className="space-y-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.subject}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        template.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {template.status === 'active' ? 'Activo' : 'Pausado'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Enviados: {template.sent}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Apertura: {template.openRate}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      Editar
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Emails Recientes
            </h3>
            <div className="space-y-3">
              {recentEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{email.to}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{email.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded ${
                      email.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      email.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {email.status === 'delivered' ? 'Entregado' :
                       email.status === 'opened' ? 'Abierto' : 'Pendiente'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{email.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAutomation;
