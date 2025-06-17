// src/features/dashboard/components/DashboardSplash.jsx
import React from 'react';

const DashboardSplash = ({ isVisible }) => {
  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <span className="text-3xl font-bold text-blue-600">FB</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">FlowButton</h2>
          <p className="text-blue-200">Cargando tu dashboard...</p>
        </div>
        
        {/* Loading animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSplash;
