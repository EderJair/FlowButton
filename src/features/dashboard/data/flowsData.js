// src/features/dashboard/data/flowsData.js

import {
  GmailIcon,
  OpenAI,
  WorkflowIcon,
  ShoppingCartIcon,
  GrowthIcon,
  NotificationBellIcon,
  DashboardIcon,
  DocumentCheckIcon,
  WeatherIcon,
  MapIcon,
  GoogleCalendarIcon,
  GoogleMeetIcon,
  Document
} from '@/assets/icons';

export const DASHBOARD_FLOWS = [
  {
    id: 'agente-madre',
    title: 'Agente Madre',
    status: 'Activo',
    description: 'IA Central que controla y coordina todos los flujos',
    automationCount: 12,
    iconCombo: [OpenAI, WorkflowIcon],
    category: 'master',
    priority: 'critical',
    avgExecutionTime: 450,
    monthlyExecutions: 420,
    successRate: 99.8,
    lastUsed: '2024-12-20T12:00:00Z',
    tags: ['master', 'control', 'ai', 'orchestration', 'central'],
    apiEndpoints: ['OpenAI GPT-4', 'Master Controller', 'Flow Orchestrator'],
    masterFeatures: {
      totalFlowsControlled: 11,
      activeFlows: 5,
      scheduledTasks: 8,
      emergencyOverrides: 3,
      automationLevel: 95
    }
  },
  {
    id: 'gmail-openai',
    title: 'Gmail + OpenAI',
    status: 'Activo',
    description: 'Emails inteligentes con IA',
    automationCount: 3,
    iconCombo: [GmailIcon, OpenAI],
    category: 'email',
    priority: 'high',
    avgExecutionTime: 850, // milisegundos
    monthlyExecutions: 245,
    successRate: 96.8,
    lastUsed: '2024-12-20T10:30:00Z',
    tags: ['email', 'ai', 'automation', 'gmail'],
    apiEndpoints: ['Gmail API', 'OpenAI GPT-4']
  },
  {
    id: 'google-calendar',
    title: 'Google Calendar + IA',
    status: 'Activo',
    description: 'Agenda citas con inteligencia artificial',
    automationCount: 2,
    iconCombo: [WorkflowIcon, OpenAI],
    category: 'productivity',
    priority: 'high',
    avgExecutionTime: 650,
    monthlyExecutions: 189,
    successRate: 98.1,
    lastUsed: new Date().toISOString(),
    tags: ['calendar', 'ai', 'scheduling', 'appointments', 'productivity'],
    apiEndpoints: ['OpenAI GPT-4', 'Google Calendar API']
  },
  {
    id: 'google-meet-calendar',
    title: 'Google Meet + Calendar + IA',
    status: 'Activo',
    description: 'Reuniones automáticas con enlace de Google Meet',
    automationCount: 3,
    iconCombo: [GoogleMeetIcon, GoogleCalendarIcon, OpenAI],
    category: 'productivity',
    priority: 'high',
    avgExecutionTime: 720,
    monthlyExecutions: 165,
    successRate: 98.7,
    lastUsed: new Date().toISOString(),
    tags: ['meet', 'calendar', 'ai', 'video-calls', 'automation', 'n8n'],
    apiEndpoints: ['N8N Webhook', 'Google Calendar API', 'Google Meet API', 'OpenAI GPT-4']
  },
  {
    id: 'cv-analizador',
    title: 'Analizador de CV con IA',
    status: 'Activo',
    description: 'Análisis técnico inteligente de currículums para reclutamiento',
    automationCount: 4,
    iconCombo: [DocumentCheckIcon, OpenAI],
    category: 'hr',
    priority: 'high',
    avgExecutionTime: 2500,
    monthlyExecutions: 125,
    successRate: 97.2,
    lastUsed: new Date().toISOString(),
    tags: ['cv', 'recruitment', 'ai', 'analysis', 'hr', 'technical', 'evaluation'],
    apiEndpoints: ['N8N Webhook', 'OpenAI GPT-4', 'PDF Parser', 'CV Analysis Engine'],
    features: {
      pdfProcessing: true,
      technicalEvaluation: true,
      salaryEstimation: true,
      skillsAnalysis: true,
      testRecommendations: true,
      redFlagDetection: true
    }
  },
  {
    id: 'generador-propuestas',
    title: 'Generador de Propuestas',
    status: 'Activo',
    description: 'Crea propuestas comerciales con IA',
    automationCount: 2,
    iconCombo: [DocumentCheckIcon, OpenAI],
    category: 'business',
    priority: 'high',
    avgExecutionTime: 750,
    monthlyExecutions: 156,
    successRate: 97.5,
    lastUsed: new Date().toISOString(),
    tags: ['proposals', 'business', 'ai', 'commercial', 'documents'],
    apiEndpoints: ['OpenAI GPT-4', 'Document Generator']
  },
  {
    id: 'pdf-uploader',
    title: 'Subir Archivo PDF',
    status: 'Activo',
    description: 'Carga y gestión de documentos PDF',
    automationCount: 1,
    iconCombo: [DocumentCheckIcon, WorkflowIcon],
    category: 'documents',
    priority: 'medium',
    avgExecutionTime: 320,
    monthlyExecutions: 180,
    successRate: 99.2,
    lastUsed: new Date().toISOString(),
    tags: ['pdf', 'upload', 'documents', 'storage'],
    apiEndpoints: ['File Storage API', 'PDF Parser']
  },
  {
    id: 'legal-consultant',
    title: 'Abogado Consultor',
    status: 'Activo',
    description: 'Consultoría legal inteligente',
    automationCount: 3,
    iconCombo: [OpenAI, DocumentCheckIcon],
    category: 'legal',
    priority: 'medium',
    avgExecutionTime: 1200,
    monthlyExecutions: 89,
    successRate: 94.2,
    lastUsed: '2024-12-19T14:22:00Z',
    tags: ['legal', 'consultation', 'ai', 'documents'],
    apiEndpoints: ['OpenAI GPT-4', 'Document Parser']
  },
  {
    id: 'invoice-reader',
    title: 'Lector de Facturas con IA',
    status: 'Activo',
    description: 'Extrae información de facturas automáticamente',
    automationCount: 3,
    iconCombo: [DocumentCheckIcon, OpenAI],
    category: 'documents',
    priority: 'high',
    avgExecutionTime: 680,
    monthlyExecutions: 312,
    successRate: 98.5,
    lastUsed: '2024-12-20T09:15:00Z',
    tags: ['invoice', 'ocr', 'extraction', 'automation'],
    apiEndpoints: ['OpenAI GPT-4', 'OCR Service', 'Document API']
  },
  {
    id: 'exchange-stock',
    title: 'Tipo de Cambio + Bolsa',
    status: 'Activo',
    description: 'Información financiera y bursátil',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, GrowthIcon],
    category: 'finance',
    priority: 'medium',
    avgExecutionTime: 420,
    monthlyExecutions: 156,
    successRate: 99.1,
    lastUsed: '2024-12-20T11:45:00Z',
    tags: ['finance', 'exchange', 'stocks', 'market'],
    apiEndpoints: ['Currency API', 'Stock Market API']
  },
  {
    id: 'email-calendar-search',
    title: 'Email + Calendario + Búsqueda',
    status: 'Próximamente',
    description: 'Integración completa de productividad',
    automationCount: 3,
    iconCombo: [GmailIcon, WorkflowIcon, DashboardIcon],
    category: 'productivity',
    priority: 'high',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['productivity', 'calendar', 'search', 'integration'],
    apiEndpoints: ['Gmail API', 'Calendar API', 'Search API']
  },
  {
    id: 'ai-crm-erp',
    title: 'Asistente IA + CRM/ERP',
    status: 'Próximamente',
    description: 'Conexión inteligente con sistemas empresariales',
    automationCount: 3,
    iconCombo: [OpenAI, DashboardIcon],
    category: 'business',
    priority: 'high',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['business', 'crm', 'erp', 'ai'],
    apiEndpoints: ['OpenAI GPT-4', 'CRM API', 'ERP Connector']
  },
  {
    id: 'weather-maps',
    title: 'Meteorología + Google Maps',
    status: 'Activo',
    description: 'Información meteorológica y ubicaciones',
    automationCount: 3,
    iconCombo: [WeatherIcon, MapIcon],
    category: 'location',
    priority: 'low',
    avgExecutionTime: 320,
    monthlyExecutions: 78,
    successRate: 97.3,
    lastUsed: '2024-12-20T08:30:00Z',
    tags: ['weather', 'maps', 'location', 'geography'],
    apiEndpoints: ['Weather API', 'Google Maps API']
  },
  {
    id: 'formal-emails',
    title: 'Creación Correos Formales',
    status: 'Próximamente',
    description: 'Redacción automática de correos profesionales',
    automationCount: 3,
    iconCombo: [GmailIcon, OpenAI],
    category: 'email',
    priority: 'medium',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['email', 'formal', 'writing', 'professional'],
    apiEndpoints: ['Gmail API', 'OpenAI GPT-4']
  }, {
    id: 'accounting-admin',
    title: 'Administración Contable',
    status: 'Activo',
    description: 'Gestión contable automatizada',
    automationCount: 3,
    iconCombo: [DocumentCheckIcon, DashboardIcon],
    category: 'accounting',
    priority: 'high',
    avgExecutionTime: 240,
    monthlyExecutions: 156,
    successRate: 97.8,
    lastUsed: new Date().toISOString(),
    tags: ['accounting', 'finance', 'administration', 'automation'],
    apiEndpoints: ['Accounting API', 'Tax Calculator', 'Bank Connector']
  },
  {
    id: 'sales-leads',
    title: 'Ventas y Generación Leads',
    status: 'Próximamente',
    description: 'Potencia tu proceso de ventas',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, GrowthIcon],
    category: 'sales',
    priority: 'high',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['sales', 'leads', 'generation', 'marketing'],
    apiEndpoints: ['CRM API', 'Lead Tracker', 'Email Automation']
  }, {
    id: 'supplier-contact',
    title: 'Contacto Proveedores',
    status: 'Activo',
    description: 'Gestión de relaciones con proveedores',
    automationCount: 3,
    iconCombo: [NotificationBellIcon, DashboardIcon],
    category: 'suppliers',
    priority: 'medium',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['suppliers', 'contact', 'management', 'relations'],
    apiEndpoints: ['Supplier API', 'Contact Manager', 'Communication Hub']
  },
  {
    id: 'sales-campaigns',
    title: 'Campañas de Ventas',
    status: 'Próximamente',
    description: 'Creación y gestión de campañas',
    automationCount: 3,
    iconCombo: [ShoppingCartIcon, WorkflowIcon],
    category: 'campaigns',
    priority: 'medium',
    avgExecutionTime: 0,
    monthlyExecutions: 0,
    successRate: 0,
    lastUsed: null,
    tags: ['campaigns', 'sales', 'marketing', 'automation'],
    apiEndpoints: ['Campaign Manager', 'Analytics API', 'Email Service']
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

// Función para obtener flujos por prioridad
export const getFlowsByPriority = (priority) => {
  return DASHBOARD_FLOWS.filter(flow => flow.priority === priority);
};

// Función para obtener el flujo del CV Analyzer
export const getCVAnalyzerFlow = () => {
  return DASHBOARD_FLOWS.find(flow => flow.id === 'cv-analizador');
};

// Función para obtener flujos de HR
export const getHRFlows = () => getFlowsByCategory('hr');

// Función para obtener estadísticas generales
export const getFlowStatistics = () => {
  const activeFlows = getActiveFlows();
  const totalExecutions = activeFlows.reduce((sum, flow) => sum + flow.monthlyExecutions, 0);
  const avgSuccessRate = activeFlows.reduce((sum, flow) => sum + flow.successRate, 0) / activeFlows.length;
  const avgExecutionTime = activeFlows.reduce((sum, flow) => sum + flow.avgExecutionTime, 0) / activeFlows.length;    return {
      totalFlows: DASHBOARD_FLOWS.length,
      activeFlows: activeFlows.length,
      upcomingFlows: getUpcomingFlows().length,
      totalExecutions,
      avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
      avgExecutionTime: Math.round(avgExecutionTime),
      highPriorityFlows: getFlowsByPriority('high').length,
      mediumPriorityFlows: getFlowsByPriority('medium').length,
      lowPriorityFlows: getFlowsByPriority('low').length,
      criticalFlows: getFlowsByPriority('critical').length
    };
  };

// Función para obtener el top de flujos más usados
export const getTopFlowsByUsage = (limit = 5) => {
  return getActiveFlows()
    .sort((a, b) => b.monthlyExecutions - a.monthlyExecutions)
    .slice(0, limit);
};

// Función para obtener flujos por tasa de éxito
export const getTopFlowsBySuccessRate = (limit = 5) => {
  return getActiveFlows()
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, limit);
};

// Función para obtener categorías con estadísticas
export const getCategoryStatistics = () => {
  const categories = [...new Set(DASHBOARD_FLOWS.map(flow => flow.category))];

  return categories.map(category => {
    const categoryFlows = getFlowsByCategory(category);
    const activeFlows = categoryFlows.filter(flow => flow.status === 'Activo');
    const totalExecutions = activeFlows.reduce((sum, flow) => sum + flow.monthlyExecutions, 0);
    const avgSuccessRate = activeFlows.length > 0
      ? activeFlows.reduce((sum, flow) => sum + flow.successRate, 0) / activeFlows.length
      : 0;

    return {
      category,
      totalFlows: categoryFlows.length,
      activeFlows: activeFlows.length,
      totalExecutions,
      avgSuccessRate: Math.round(avgSuccessRate * 10) / 10
    };
  });
};

// Función para obtener APIs más utilizadas
export const getAPIUsageStatistics = () => {
  const apiUsage = {};

  getActiveFlows().forEach(flow => {
    flow.apiEndpoints.forEach(api => {
      if (apiUsage[api]) {
        apiUsage[api].usage += flow.monthlyExecutions;
        apiUsage[api].flows.push(flow.title);
      } else {
        apiUsage[api] = {
          name: api,
          usage: flow.monthlyExecutions,
          flows: [flow.title]
        };
      }
    });
  });

  return Object.values(apiUsage).sort((a, b) => b.usage - a.usage);
};

// Función para generar datos de actividad diaria simulados
export const generateDailyActivityData = (days = 30) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simular actividad diaria basada en flujos activos
    const activeFlows = getActiveFlows();
    const dailyExecutions = activeFlows.reduce((sum, flow) => {
      // Distribución aleatoria de las ejecuciones mensuales en días
      const dailyAvg = flow.monthlyExecutions / 30;
      const variation = dailyAvg * 0.5; // 50% de variación
      return sum + Math.max(0, Math.floor(dailyAvg + (Math.random() - 0.5) * variation));
    }, 0);

    const successRate = 85 + Math.random() * 15; // Entre 85-100%
    const failures = Math.floor(dailyExecutions * (100 - successRate) / 100);

    data.push({
      date: date.toISOString().split('T')[0],
      executions: dailyExecutions,
      successes: dailyExecutions - failures,
      failures,
      successRate: Math.round(successRate * 10) / 10
    });
  }

  return data;
};

// Función para obtener estadísticas específicas de CV Analyzer
export const getCVAnalyzerStats = () => {
  const cvFlow = getCVAnalyzerFlow();
  if (!cvFlow) return null;

  return {
    title: cvFlow.title,
    monthlyAnalyses: cvFlow.monthlyExecutions,
    successRate: cvFlow.successRate,
    avgProcessingTime: cvFlow.avgExecutionTime,
    features: cvFlow.features,
    category: cvFlow.category,
    priority: cvFlow.priority,
    lastUsed: cvFlow.lastUsed
  };
};