// src/features/dashboard/data/flowsData.js

import {
  GmailIcon,
  OpenAI,
  WorkflowIcon,
  ShoppingCartIcon,
  GrowthIcon,
  NotificationBellIcon,
  DashboardIcon,
  DocumentCheckIcon
} from '../../../assets/icons';

export const DASHBOARD_FLOWS = [
  {
    id: 'gmail-openai',
    title: 'Gmail + OpenAI',
    status: 'Activo',
    description: 'Emails inteligentes con IA',
    automationCount: 3,
    iconCombo: [GmailIcon, OpenAI],
    category: 'email'
  },
  {
    id: 'email-calendar-search',
    title: 'Email + Calendario + Búsqueda',
    status: 'Próximamente',
    description: 'Integración completa de productividad',
    automationCount: 3,
    iconCombo: [GmailIcon, WorkflowIcon, DashboardIcon],
    category: 'productivity'
  },
  {
    id: 'ai-crm-erp',
    title: 'Asistente IA + CRM/ERP',
    status: 'Próximamente',
    description: 'Conexión inteligente con sistemas empresariales',
    automationCount: 3,
    iconCombo: [OpenAI, DashboardIcon],
    category: 'business'
  },
  {
    id: 'weather-maps',
    title: 'Meteorología + Google Maps',
    status: 'Próximamente',
    description: 'Información meteorológica y ubicaciones',
    automationCount: 3,
    iconCombo: [GrowthIcon, DashboardIcon],
    category: 'location'
  },
  {
    id: 'exchange-stock',
    title: 'Tipo de Cambio + Bolsa',
    status: 'Próximamente',
    description: 'Información financiera y bursátil',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, GrowthIcon],
    category: 'finance'
  },
  {
    id: 'formal-emails',
    title: 'Creación Correos Formales',
    status: 'Próximamente',
    description: 'Redacción automática de correos profesionales',
    automationCount: 3,
    iconCombo: [GmailIcon, OpenAI],
    category: 'email'
  },
  {
    id: 'legal-consultant',
    title: 'Abogado Consultor',
    status: 'Próximamente',
    description: 'Consultoría legal inteligente',
    automationCount: 3,
    iconCombo: [OpenAI, DocumentCheckIcon],
    category: 'legal'
  },
  {
    id: 'accounting-admin',
    title: 'Administración Contable',
    status: 'Próximamente',
    description: 'Gestión contable automatizada',
    automationCount: 3,
    iconCombo: [DocumentCheckIcon, DashboardIcon],
    category: 'accounting'
  },
  {
    id: 'sales-leads',
    title: 'Ventas y Generación Leads',
    status: 'Próximamente',
    description: 'Potencia tu proceso de ventas',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, GrowthIcon],
    category: 'sales'
  },
  {
    id: 'supplier-contact',
    title: 'Contacto Proveedores',
    status: 'Próximamente',
    description: 'Gestión de relaciones con proveedores',
    automationCount: 3,
    iconCombo: [NotificationBellIcon, DashboardIcon],
    category: 'suppliers'
  },
  {
    id: 'sales-campaigns',
    title: 'Campañas de Ventas',
    status: 'Próximamente',
    description: 'Creación y gestión de campañas',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, WorkflowIcon],
    category: 'campaigns'
  },
  {
    id: 'invoice-reader',
    title: 'Lector de Facturas con IA',
    status: 'Activo',
    description: 'Extrae información de facturas automáticamente',
    automationCount: 3,
    iconCombo: [DocumentCheckIcon, OpenAI],
    category: 'documents'
  }
];

// Función para obtener flujos por categoría
export const getFlowsByCategory = (category) => {
  return DASHBOARD_FLOWS.filter(flow => flow.category === category);
};

// Función para obtener flujos por estado
export const getFlowsByStatus = (status) => {
  return DASHBOARD_FLOWS.filter(flow => flow.status === status);
};

// Función para obtener flujos activos
export const getActiveFlows = () => getFlowsByStatus('Activo');

// Función para obtener flujos próximamente
export const getUpcomingFlows = () => getFlowsByStatus('Próximamente');
