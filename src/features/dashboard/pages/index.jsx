// src/features/dashboard/pages/index.js
export { default as DashboardHome } from './DashboardHome';
export { default as EmailAutomation } from './EmailAutomation';
export { default as Workflows } from './Workflows';
export { default as Analytics } from './Analytics';
export { default as Account } from './Account';

// Páginas básicas para las otras secciones
export const InvoiceManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Facturas</h2>
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
      <p className="text-gray-600 dark:text-gray-400">
        Módulo de gestión de facturas en desarrollo. Aquí podrás automatizar el procesamiento, 
        categorización y archivo de todas tus facturas.
      </p>
    </div>
  </div>
);

export const Marketplace = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h2>
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-white/20 dark:border-gray-700/50">
      <p className="text-gray-600 dark:text-gray-400">
        Marketplace de flujos. Descubre, comparte e instala flujos de automatización 
        creados por la comunidad.
      </p>
    </div>
  </div>
);
