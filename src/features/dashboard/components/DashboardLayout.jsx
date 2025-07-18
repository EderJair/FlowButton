// src/features/dashboard/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardSplash from './DashboardSplash';
import { Aurora } from '../../../components';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Hide splash and trigger entrance animation
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 400);

    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const handleBackToHome = () => {
    setIsExiting(true);
    // Fade suave de salida antes de navegar
    setTimeout(() => {
      navigate('/');
    }, 600);
  };
  return (
    <div className={`flex h-screen bg-transparent relative overflow-hidden transition-opacity duration-600 ease-out ${
      isExiting ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Aurora Background */}
      <div className={`transition-opacity duration-500 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <Aurora
          colorStops={["#1e1b4b", "#3730a3", "#1e40af"]}
          blend={0.2}
          amplitude={0.6}
          speed={1.2}
        />
      </div>
      
      {/* Content with backdrop */}      <div className={`flex h-screen w-full relative z-10 transition-all duration-600 ease-out transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onBackToHome={handleBackToHome}
          isLoaded={isLoaded}
        />        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden fixed top-4 left-4 z-40 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Main content */}<main className={`flex-1 overflow-x-hidden overflow-y-auto bg-black/10 backdrop-blur-sm 
            transition-all duration-500 ease-out delay-75 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
