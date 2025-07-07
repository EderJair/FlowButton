// src/features/dashboard/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  WorkflowIcon,
  GrowthIcon
} from '../../../assets/icons';

const Sidebar = ({ isOpen, onClose, isLoaded = true, onBackToHome }) => {

  const mainMenuItems = [
    {
      name: 'FLUJOS',
      icon: WorkflowIcon,
      path: '/dashboard/workflows',
      description: 'Gestión de flujos'
    },
    {
      name: 'ESTADÍSTICAS',
      icon: GrowthIcon,
      path: '/dashboard/analytics',
      description: 'Métricas y análisis'
    }
  ];
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Aquí puedes agregar la lógica de logout
      console.log('Cerrando sesión...');
      // Por ejemplo: redirect to login page
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/30
        transition-all duration-500 ease-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-center px-6 py-8 border-b border-white/10 transition-all duration-500 ease-out delay-50 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                <span className="text-lg font-bold text-white">FB</span>
              </div>
              <span className="mx-3 text-2xl font-semibold text-white drop-shadow-lg">
                FlowButton
              </span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 py-6">
            <div className="px-4 space-y-2">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                MENÚ PRINCIPAL
              </h3>
              {mainMenuItems.map((item, index) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-left transition-all duration-300 ease-out delay-${(index + 1) * 25} transform rounded-lg ${
                      isActive
                        ? 'bg-blue-500/20 text-white border border-blue-500/30'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    } ${
                      isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/70 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Separator */}
            <div className="mx-4 my-6 border-t border-white/10"></div>

            {/* Secondary Actions */}            <div className="px-4 space-y-2">
              <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                ACCIONES
              </h3>
              
              {/* Mi Cuenta */}
              <NavLink
                to="/dashboard/account"
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-out delay-75 transform ${
                    isActive
                      ? 'bg-blue-500/20 text-white border border-blue-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  } ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`
                }
              >
                <div className="w-5 h-5 mr-3 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">U</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">MI CUENTA</div>
                  <div className="text-xs text-white/70 mt-0.5">
                    Configuración
                  </div>
                </div>
              </NavLink>

              {/* Volver al Home */}
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className={`w-full flex items-center px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 ease-out delay-100 transform ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <span className="text-xl mr-3">←</span>
                  <div className="flex-1">
                    <div className="font-medium">VOLVER AL HOME</div>
                    <div className="text-xs text-white/70 mt-0.5">
                      Página principal
                    </div>
                  </div>
                </button>
              )}
            </div>
          </nav>

          {/* Footer con Logout */}
          <div className={`p-4 border-t border-white/10 transition-all duration-500 ease-out delay-150 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* User Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-white">Jair</div>
                  <div className="text-xs text-white/70">admin@flowbutton.com</div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200 text-red-200 hover:text-red-100"
            >
              <span className="font-medium">CERRAR SESIÓN</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
