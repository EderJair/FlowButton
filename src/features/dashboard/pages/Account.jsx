// src/features/dashboard/pages/Account.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Account = () => {  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChangingTab, setIsChangingTab] = useState(false);
  
  // Efecto de entrada con retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Función para cambiar de tab con animación
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsChangingTab(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsChangingTab(false);
    }, 200);
  };
  
  // Datos del usuario (simulados)
  const [userData, setUserData] = useState({
    name: 'Jair',
    email: 'admin@flowbutton.com',
    phone: '+51 999 999 999',
    company: 'FlowButton Corp',
    position: 'Administrator',
    timezone: 'America/Lima',
    language: 'es',
    notifications: {
      email: true,
      push: true,
      sms: false,
      flowUpdates: true,
      systemAlerts: true,
      weeklyReports: true
    },
    security: {
      twoFactor: false,
      lastPasswordChange: '2024-01-15',
      activeSessions: 3
    }
  });

  const [formData, setFormData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      setUserData(formData);
      setIsLoading(false);
      toast.success('Configuración guardada', {
        description: `Los cambios en ${section} se han guardado correctamente`,
        icon: '✅'
      });
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'security', label: 'Seguridad', icon: '🔒' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'preferences', label: 'Preferencias', icon: '⚙️' }
  ];
  return (
    <div className={`space-y-6 transition-all duration-700 ease-out transform ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between transition-all duration-500 ease-out delay-100 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Cuenta</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu perfil y configuración de cuenta
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-out delay-200 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>        <nav className="flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-300 ease-out delay-${300 + (index * 50)} transform ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 scale-105'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              } ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="transition-transform duration-200 hover:scale-110">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>      {/* Tab Content */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-600 ease-out delay-300 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>        {/* Main Content */}
        <div className={`lg:col-span-2 transition-opacity duration-200 ${isChangingTab ? 'opacity-50' : 'opacity-100'}`}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-400 ease-out delay-400 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Información Personal
              </h3>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className={`flex items-center gap-6 transition-all duration-500 ease-out delay-500 transform ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {formData.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Cambiar foto
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPG, GIF o PNG. Máximo 1MB.
                    </p>
                  </div>
                </div>                {/* Form Fields */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-out delay-600 transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className={`transition-all duration-400 ease-out delay-700 transform ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className={`transition-all duration-400 ease-out delay-750 transform ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className={`transition-all duration-400 ease-out delay-800 transform ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className={`transition-all duration-400 ease-out delay-850 transform ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Empresa
                    </label>                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className={`md:col-span-2 transition-all duration-400 ease-out delay-900 transform ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className={`flex justify-end transition-all duration-500 ease-out delay-950 transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button
                    onClick={() => handleSave('perfil')}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className={`space-y-6 transition-all duration-400 ease-out delay-400 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {/* Change Password */}
              <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 ease-out delay-500 transform ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Cambiar Contraseña
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => handleSave('contraseña')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Actualizar contraseña
                  </button>
                </div>
              </div>

              {/* Two Factor Authentication */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Autenticación de Dos Factores
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Autenticación 2FA
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.security.twoFactor ? 'Activada' : 'Desactivada'}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.security.twoFactor
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {formData.security.twoFactor ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          )}          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-400 ease-out delay-400 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Preferencias de Notificaciones
              </h3>
              
              <div className="space-y-6">
                {Object.entries({
                  email: { label: 'Notificaciones por Email', description: 'Recibir actualizaciones por correo electrónico' },
                  push: { label: 'Notificaciones Push', description: 'Notificaciones en tiempo real en el navegador' },
                  sms: { label: 'Notificaciones SMS', description: 'Alertas importantes por mensaje de texto' },
                  flowUpdates: { label: 'Actualizaciones de Flujos', description: 'Notificar cuando los flujos se ejecuten' },
                  systemAlerts: { label: 'Alertas del Sistema', description: 'Alertas sobre el estado del sistema' },
                  weeklyReports: { label: 'Reportes Semanales', description: 'Resumen semanal de actividad' }
                }).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {config.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {config.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications[key]}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('notificaciones')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </div>
          )}          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-400 ease-out delay-400 transform ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Preferencias Generales
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zona Horaria
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/Lima">Lima (UTC-5)</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
                    <option value="Europe/Madrid">Madrid (UTC+1)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idioma
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('preferencias')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>        {/* Sidebar Info */}
        <div className={`space-y-6 transition-all duration-600 ease-out delay-450 transform ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
        }`}>
          {/* Account Stats */}
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 ease-out delay-550 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estado de la Cuenta
            </h3>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between transition-all duration-400 ease-out delay-650 transform ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">Plan actual</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">Pro</span>
              </div>
              
              <div className={`flex items-center justify-between transition-all duration-400 ease-out delay-700 transform ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">Flujos activos</span>
                <span className="font-medium text-gray-900 dark:text-white">12</span>
              </div>
              
              <div className={`flex items-center justify-between transition-all duration-400 ease-out delay-750 transform ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">Ejecuciones este mes</span>
                <span className="font-medium text-gray-900 dark:text-white">1,247</span>
              </div>
              
              <div className={`flex items-center justify-between transition-all duration-400 ease-out delay-800 transform ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">Miembro desde</span>
                <span className="font-medium text-gray-900 dark:text-white">Ene 2024</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 ease-out delay-650 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h3>
            
            <div className="space-y-3">
              <button className={`w-full text-left px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 ease-out delay-850 transform hover:scale-105 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 dark:text-blue-400">📊</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Ver Analytics</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Estadísticas de uso</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 dark:text-green-400">⚡</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Gestionar Flujos</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Crear y editar</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-purple-600 dark:text-purple-400">🔄</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Exportar Datos</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Descargar información</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
