// src/features/dashboard/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  WorkflowIcon,
  GrowthIcon
} from '../../../assets/icons';

const Sidebar = ({ isOpen, onClose, isLoaded = true }) => {
  const menuItems = [
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

  return (
    <>
      {/* Sidebar */}      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/30
        transition-all duration-500 ease-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}          <div className={`flex items-center justify-center px-6 py-8 transition-all duration-500 ease-out delay-50 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                <span className="text-lg font-bold text-white">FB</span>
              </div>              <span className="mx-3 text-2xl font-semibold text-white drop-shadow-lg">
                FlowButton
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform ${
                      isLoaded 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'                    } ${
                      isActive
                        ? 'bg-white/20 text-white border-r-2 border-blue-400 shadow-lg'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`
                  }                  style={{
                    transitionDelay: isLoaded ? `${index * 30 + 100}ms` : '0ms'
                  }}
                >
                  <item.icon className="w-6 h-6 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>                    <div className="text-xs text-white/70 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}          <div className={`absolute bottom-0 w-full p-4 transition-all duration-500 ease-out delay-150 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">Usuario</div>
                  <div className="text-xs text-white/70">admin@flowbutton.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
