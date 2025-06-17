// src/features/dashboard/components/DashboardNavbar.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NotificationBellIcon } from '../../../assets/icons';

const DashboardNavbar = ({ onMenuClick, onBackToHome, isLoaded = true }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
      case '/dashboard/workflows':
        return 'FLUJOS';
      case '/dashboard/analytics':
        return 'ESTADÍSTICAS';
      default:
        return 'FLUJOS';
    }
  };

  return (
    <header className={`flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-b border-white/20 
      transition-all duration-700 ease-out transform delay-300 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="text-white/90 focus:outline-none lg:hidden hover:text-white"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Page title */}
        <div className={`ml-4 lg:ml-0 transition-all duration-700 ease-out delay-400 transform ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <h1 className="text-2xl font-semibold text-white drop-shadow-lg">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-white/80">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className={`flex items-center space-x-4 transition-all duration-700 ease-out delay-500 transform ${
        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        {/* Back to Home button */}        <button
          onClick={onBackToHome}
          className="px-4 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200 border border-white/20"
        >
          ← Inicio
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <NotificationBellIcon className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 z-50">
              <div className="p-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 hover:bg-white/10">
                  <p className="text-sm text-white font-medium">Nuevo flujo creado</p>
                  <p className="text-xs text-white/70 mt-1">Hace 5 minutos</p>
                </div>
                <div className="p-4 hover:bg-white/10">
                  <p className="text-sm text-white font-medium">Email enviado exitosamente</p>
                  <p className="text-xs text-white/70 mt-1">Hace 15 minutos</p>
                </div>
                <div className="p-4 hover:bg-white/10">
                  <p className="text-sm text-white font-medium">Factura procesada</p>
                  <p className="text-xs text-white/70 mt-1">Hace 1 hora</p>
                </div>
              </div>
              <div className="p-4 border-t border-white/20">
                <button className="w-full text-sm text-blue-300 hover:text-blue-200">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile/Avatar */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">U</span>
          </div>
        </div>
      </div>

      {/* Close notifications dropdown when clicking outside */}
      {notificationsOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setNotificationsOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default DashboardNavbar;
