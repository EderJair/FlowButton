// src/features/dashboard/components/modals/SupplierContactModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ShoppingCartIcon, NotificationBellIcon, DashboardIcon } from '../../../../assets/icons';

const SupplierContactModal = ({ isOpen, onClose, onSubmit }) => {
  // Estados
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'suppliers', 'orders', 'analytics'
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderFilters, setOrderFilters] = useState({ status: 'all', dateRange: '30d' });
  const [isExpanded, setIsExpanded] = useState(false);

  // Datos de proveedores simulados
  const suppliersData = [
    {
      id: 1,
      name: 'Materiales Industriales SAC',
      category: 'Construcción',
      status: 'Activo',
      rating: 4.8,
      contact: {
        email: 'ventas@materialessac.com',
        phone: '+51 987-654-321',
        manager: 'Carlos Rodriguez'
      },
      metrics: {
        totalOrders: 156,
        avgDeliveryTime: 3.2,
        onTimeDelivery: 95,
        lastOrder: '2025-06-20'
      },
      products: ['Cemento', 'Acero', 'Agregados', 'Herramientas']
    },
    {
      id: 2,
      name: 'TechSupplies Corp',
      category: 'Tecnología',
      status: 'Activo',
      rating: 4.6,
      contact: {
        email: 'orders@techsupplies.com',
        phone: '+51 912-345-678',
        manager: 'Ana Martinez'
      },
      metrics: {
        totalOrders: 89,
        avgDeliveryTime: 2.1,
        onTimeDelivery: 98,
        lastOrder: '2025-06-22'
      },
      products: ['Laptops', 'Servidores', 'Software', 'Accesorios']
    },
    {
      id: 3,
      name: 'Oficina Plus',
      category: 'Oficina',
      status: 'Pendiente',
      rating: 4.3,
      contact: {
        email: 'contacto@oficinaplus.pe',
        phone: '+51 956-789-012',
        manager: 'Luis Fernandez'
      },
      metrics: {
        totalOrders: 234,
        avgDeliveryTime: 1.8,
        onTimeDelivery: 92,
        lastOrder: '2025-06-18'
      },
      products: ['Papelería', 'Mobiliario', 'Equipos de Oficina', 'Suministros']
    }
  ];

  // Datos de órdenes recientes
  const recentOrders = [
    {
      id: 'ORD-001',
      supplier: 'Materiales Industriales SAC',
      product: 'Cemento Portland x 50 sacos',
      amount: 2500,
      status: 'Entregado',
      date: '2025-06-20',
      estimatedDelivery: '2025-06-23'
    },
    {
      id: 'ORD-002',
      supplier: 'TechSupplies Corp',
      product: 'Laptop Dell Inspiron x 5 unidades',
      amount: 7800,
      status: 'En tránsito',
      date: '2025-06-19',
      estimatedDelivery: '2025-06-24'
    },
    {
      id: 'ORD-003',
      supplier: 'Oficina Plus',
      product: 'Papel A4 x 100 resmas',
      amount: 450,
      status: 'Procesando',
      date: '2025-06-18',
      estimatedDelivery: '2025-06-25'
    }  ];
  
  // Efecto para mostrar el modal y mantener scroll habilitado
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setActiveTab('overview');
      setSelectedSupplier(null);
      setIsExpanded(false);
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = () => {
    toast.success('Configuración de proveedores guardada exitosamente');
    onSubmit?.();
    handleClose();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'pendiente':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'entregado':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'en tránsito':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'procesando':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
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
          relative bg-gradient-to-br from-purple-900/95 to-pink-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-500 ease-out transform flex flex-col
          ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
          ${isExpanded ? 'w-[95vw] h-[90vh]' : 'w-[90vw] max-w-6xl h-[85vh]'}
          mx-auto my-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-purple-800/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <NotificationBellIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Contacto Proveedores</h2>
              <p className="text-purple-200">Gestión integral de relaciones con proveedores</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isExpanded ? "Contraer" : "Expandir"}
            >
              {isExpanded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l5.25-5.25M15 15v4.5M15 15h4.5M9 9L3.75 3.75M9 9V4.5M9 9H4.5" />
                </svg>
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-white/20 bg-purple-800/20">
          {[
            { id: 'overview', label: 'Resumen', icon: DashboardIcon },
            { id: 'suppliers', label: 'Proveedores', icon: ShoppingCartIcon },
            { id: 'orders', label: 'Órdenes', icon: NotificationBellIcon },
            { id: 'analytics', label: 'Análisis', icon: DashboardIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'text-white border-b-2 border-purple-400 bg-purple-700/30'
                  : 'text-purple-200 hover:text-white hover:bg-purple-700/20'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Proveedores Activos</p>
                      <p className="text-white text-2xl font-bold">{suppliersData.filter(s => s.status === 'Activo').length}</p>
                    </div>
                    <ShoppingCartIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">+2 este mes</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Órdenes Activas</p>
                      <p className="text-white text-2xl font-bold">{recentOrders.filter(o => o.status !== 'Entregado').length}</p>
                    </div>
                    <NotificationBellIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-blue-400 text-sm">En proceso</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Valor Total</p>
                      <p className="text-white text-2xl font-bold">{formatCurrency(recentOrders.reduce((sum, order) => sum + order.amount, 0))}</p>
                    </div>
                    <DashboardIcon className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">Este mes</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm">Entrega Promedio</p>
                      <p className="text-white text-2xl font-bold">2.4</p>
                    </div>
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-2">
                    <span className="text-yellow-400 text-sm">días</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <ShoppingCartIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.product}</p>
                          <p className="text-purple-200 text-sm">{order.supplier}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(order.amount)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Lista de Proveedores</h3>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  + Nuevo Proveedor
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {suppliersData.map((supplier) => (
                  <div key={supplier.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{supplier.name}</h4>
                        <p className="text-purple-200">{supplier.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-purple-200 text-sm">{supplier.contact.manager}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-purple-200 text-sm">{supplier.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-purple-200 text-sm">{supplier.contact.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-white font-semibold">{supplier.metrics.totalOrders}</p>
                        <p className="text-purple-200 text-xs">Órdenes</p>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{supplier.metrics.onTimeDelivery}%</p>
                        <p className="text-purple-200 text-xs">Puntualidad</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                        Contactar
                      </button>
                      <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Gestión de Órdenes</h3>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  + Nueva Orden
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{order.id}</h4>
                        <p className="text-purple-200">{order.supplier}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-purple-200 text-sm">Producto</p>
                        <p className="text-white font-medium">{order.product}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Valor</p>
                        <p className="text-white font-medium">{formatCurrency(order.amount)}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-sm">Entrega Estimada</p>
                        <p className="text-white font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('es-PE')}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                        Rastrear
                      </button>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm">
                        Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-white">Análisis de Rendimiento</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Rendimiento por Proveedor</h4>
                  <div className="space-y-3">
                    {suppliersData.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between">
                        <span className="text-purple-200">{supplier.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${supplier.metrics.onTimeDelivery}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{supplier.metrics.onTimeDelivery}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Tiempo de Entrega Promedio</h4>
                  <div className="space-y-3">
                    {suppliersData.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between">
                        <span className="text-purple-200">{supplier.name}</span>
                        <span className="text-white font-semibold">{supplier.metrics.avgDeliveryTime} días</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4">Automatizaciones Disponibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-600/30 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">Notificaciones Automáticas</h5>
                    <p className="text-purple-200 text-sm">Recibe alertas sobre entregas, retrasos y cambios de estado automáticamente.</p>
                  </div>
                  <div className="p-4 bg-purple-600/30 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">Órdenes Recurrentes</h5>
                    <p className="text-purple-200 text-sm">Programa órdenes automáticas basadas en inventario y demanda histórica.</p>
                  </div>
                  <div className="p-4 bg-purple-600/30 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">Evaluación de Proveedores</h5>
                    <p className="text-purple-200 text-sm">Análisis automático de rendimiento y recomendaciones de mejora.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-purple-800/30">
          <div className="text-purple-200 text-sm">
            {suppliersData.length} proveedores configurados • {recentOrders.length} órdenes activas
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierContactModal;
