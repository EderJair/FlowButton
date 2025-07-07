// src/features/dashboard/components/modals/AccountingAdminModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { DocumentCheckIcon, DashboardIcon } from '../../../../assets/icons';

const AccountingAdminModal = ({ isOpen, onClose, onSubmit }) => {
  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'invoices', 'reports', 'automation'
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [isExpanded, setIsExpanded] = useState(false);

  // Estados para datos contables
  const [accountingData, setAccountingData] = useState({
    totalIncome: 125840.50,
    totalExpenses: 87320.25,
    netProfit: 38520.25,
    pendingInvoices: 12,
    overdueInvoices: 3,
    paidInvoices: 145,
    taxesOwed: 8560.75,
    cashFlow: 42150.00,
    lastUpdate: new Date().toISOString()
  });

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      type: 'income',
      description: 'Venta de servicios - Cliente ABC',
      amount: 2500.00,
      date: '2025-06-23',
      status: 'completed',
      category: 'Servicios'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Compra de suministros de oficina',
      amount: 350.75,
      date: '2025-06-22',
      status: 'completed',
      category: 'Suministros'
    },
    {
      id: 3,
      type: 'income',
      description: 'Consultoría - Proyecto XYZ',
      amount: 4200.00,
      date: '2025-06-21',
      status: 'pending',
      category: 'Consultoría'
    },
    {
      id: 4,
      type: 'expense',
      description: 'Pago de servicios públicos',
      amount: 280.50,
      date: '2025-06-20',
      status: 'completed',
      category: 'Servicios Públicos'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Alquiler de oficina',
      amount: 1200.00,
      date: '2025-06-15',
      status: 'completed',
      category: 'Alquiler'
    }
  ]);

  const [automationTasks] = useState([
    {
      id: 1,
      name: 'Generación automática de facturas',
      description: 'Crea facturas automáticamente basadas en contratos recurrentes',
      status: 'active',
      lastRun: '2025-06-23T09:00:00Z',
      nextRun: '2025-06-24T09:00:00Z',
      frequency: 'Diario'
    },
    {
      id: 2,
      name: 'Recordatorio de pagos',
      description: 'Envía recordatorios automáticos a clientes con facturas vencidas',
      status: 'active',
      lastRun: '2025-06-22T14:30:00Z',
      nextRun: '2025-06-23T14:30:00Z',
      frequency: 'Diario'
    },
    {
      id: 3,
      name: 'Conciliación bancaria',
      description: 'Reconcilia automáticamente las transacciones bancarias',
      status: 'paused',
      lastRun: '2025-06-20T08:00:00Z',
      nextRun: null,
      frequency: 'Semanal'
    }
  ]);  // Efecto para mostrar el modal y mantener scroll habilitado
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setTimeout(() => setIsVisible(false), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        type: 'accounting-admin',
        data: accountingData,
        period: selectedPeriod
      });
    }
    handleClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;  return (
    <div 
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        bg-black/50 backdrop-blur-sm
        p-4
      `}
      onClick={handleOverlayClick}
    >
      {/* Modal */}
      <div 
        className={`
          relative bg-gradient-to-br from-green-900/95 to-emerald-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
          ${isExpanded ? 'w-[95vw] h-[95vh]' : 'w-full max-w-6xl h-[85vh]'}
          mx-auto my-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DocumentCheckIcon className="w-8 h-8 text-green-400" />
              <DashboardIcon className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Administración Contable</h2>
              <p className="text-green-200 text-sm">Gestión contable automatizada</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isExpanded ? "Modo normal" : "Modo expandido"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isExpanded ? "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" 
                    : "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"} />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-white/10">
          <div className="flex px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: '📊' },
              { id: 'invoices', label: 'Facturas', icon: '🧾' },
              { id: 'reports', label: 'Reportes', icon: '📈' },
              { id: 'automation', label: 'Automatizaciones', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors border-b-2
                  ${activeTab === tab.id 
                    ? 'text-green-300 border-green-400' 
                    : 'text-gray-300 border-transparent hover:text-white hover:border-white/30'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Período Selector */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Resumen Financiero</h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="current-month">Mes Actual</option>
                  <option value="last-month">Mes Anterior</option>
                  <option value="quarter">Trimestre</option>
                  <option value="year">Año</option>
                </select>
              </div>

              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(accountingData.totalIncome)}</p>
                    </div>
                    <div className="text-green-400 text-2xl">💰</div>
                  </div>
                  <p className="text-xs text-green-300 mt-2">+12.5% vs mes anterior</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Gastos Totales</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(accountingData.totalExpenses)}</p>
                    </div>
                    <div className="text-red-400 text-2xl">💸</div>
                  </div>
                  <p className="text-xs text-red-300 mt-2">+5.8% vs mes anterior</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Ganancia Neta</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(accountingData.netProfit)}</p>
                    </div>
                    <div className="text-green-400 text-2xl">📈</div>
                  </div>
                  <p className="text-xs text-green-300 mt-2">+23.1% vs mes anterior</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm">Flujo de Caja</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(accountingData.cashFlow)}</p>
                    </div>
                    <div className="text-blue-400 text-2xl">🏦</div>
                  </div>
                  <p className="text-xs text-blue-300 mt-2">Saldo disponible</p>
                </div>
              </div>

              {/* Estado de Facturas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Estado de Facturas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-200">Facturas Pagadas</span>
                      <span className="text-white font-semibold">{accountingData.paidInvoices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-200">Facturas Pendientes</span>
                      <span className="text-white font-semibold">{accountingData.pendingInvoices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-200">Facturas Vencidas</span>
                      <span className="text-white font-semibold">{accountingData.overdueInvoices}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Obligaciones Fiscales</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-200">Impuestos por Pagar</span>
                      <span className="text-white font-semibold">{formatCurrency(accountingData.taxesOwed)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-200">Próximo Vencimiento</span>
                      <span className="text-white font-semibold">15 Jul 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Gestión de Facturas</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Nueva Factura
                </button>
              </div>

              <div className="bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Número</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {[
                        { id: 'FAC-001', client: 'Empresa ABC S.A.C.', amount: 2500.00, date: '2025-06-23', status: 'Pagada' },
                        { id: 'FAC-002', client: 'Consultoría XYZ', amount: 4200.00, date: '2025-06-21', status: 'Pendiente' },
                        { id: 'FAC-003', client: 'Tech Solutions', amount: 1800.00, date: '2025-06-20', status: 'Vencida' },
                        { id: 'FAC-004', client: 'Marketing Pro', amount: 3100.00, date: '2025-06-18', status: 'Pagada' },
                        { id: 'FAC-005', client: 'Design Studio', amount: 2750.00, date: '2025-06-15', status: 'Pendiente' }
                      ].map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{invoice.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{invoice.client}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatCurrency(invoice.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatDate(invoice.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              invoice.status === 'Pagada' ? 'bg-green-500/20 text-green-300' :
                              invoice.status === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-green-400 hover:text-green-300 mr-3">Ver</button>
                            <button className="text-blue-400 hover:text-blue-300 mr-3">Editar</button>
                            <button className="text-red-400 hover:text-red-300">Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Reportes Financieros</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Transacciones Recientes</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {transaction.type === 'income' ? '↗️' : '↘️'}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{transaction.description}</p>
                            <p className="text-gray-300 text-xs">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            transaction.type === 'income' ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-400">{transaction.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Reportes Disponibles</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Estado de Resultados', description: 'Ingresos y gastos del período' },
                      { name: 'Balance General', description: 'Activos, pasivos y patrimonio' },
                      { name: 'Flujo de Caja', description: 'Movimientos de efectivo' },
                      { name: 'Análisis de Ventas', description: 'Rendimiento por cliente y producto' },
                      { name: 'Gastos por Categoría', description: 'Desglose de gastos operativos' }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                        <div>
                          <p className="text-white font-medium">{report.name}</p>
                          <p className="text-gray-300 text-sm">{report.description}</p>
                        </div>
                        <button className="text-green-400 hover:text-green-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Automatizaciones Activas</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Nueva Automatización
                </button>
              </div>

              <div className="grid gap-6">
                {automationTasks.map((task) => (
                  <div key={task.id} className="bg-white/10 rounded-lg p-6 border border-white/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{task.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {task.status === 'active' ? 'Activo' : 'Pausado'}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{task.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-green-200">Frecuencia</p>
                            <p className="text-white">{task.frequency}</p>
                          </div>
                          <div>
                            <p className="text-green-200">Última Ejecución</p>
                            <p className="text-white">{formatDate(task.lastRun)}</p>
                          </div>
                          <div>
                            <p className="text-green-200">Próxima Ejecución</p>
                            <p className="text-white">{task.nextRun ? formatDate(task.nextRun) : 'Pausada'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className={`px-3 py-1 rounded text-sm transition-colors ${
                          task.status === 'active' 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}>
                          {task.status === 'active' ? 'Pausar' : 'Activar'}
                        </button>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estadísticas de Automatización */}
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Estadísticas de Automatización</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">97.8%</p>
                    <p className="text-green-200">Tasa de Éxito</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">240</p>
                    <p className="text-blue-200">Ejecuciones Este Mes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">32h</p>
                    <p className="text-purple-200">Tiempo Ahorrado</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : 'Aplicar Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingAdminModal;
