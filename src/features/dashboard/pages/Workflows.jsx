// src/features/dashboard/pages/Workflows.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FlowCard } from '../components/cards';
import { AgenteMadreModal, GmailOpenAIModal, GoogleCalendarModal, PdfUploaderModal, InvoiceAnalysisModal, ExchangeStockModal, LegalConsultantModal, WeatherMapsModal, AccountingAdminModal, SupplierContactModal, GeneradorPropuestasModal } from '../components/modals';
import { DASHBOARD_FLOWS, getActiveFlows, getUpcomingFlows } from '../data/flowsData';

const Workflows = () => {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'active', 'upcoming'
  const [cardsVisible, setCardsVisible] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    flowType: null
  });
  
  const getFilteredFlows = () => {
    switch (selectedFilter) {
      case 'active':
        return getActiveFlows();
      case 'upcoming':
        return getUpcomingFlows();
      default:
        return DASHBOARD_FLOWS;
    }
  };
  // Efecto para mostrar las tarjetas con animación
  useEffect(() => {
    setCardsVisible(false);
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedFilter]);

  // Efecto inicial para la primera carga
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setCardsVisible(true);
    }, 300);

    return () => clearTimeout(initialTimer);
  }, []);  const handleFlowClick = (flow) => {
    if (flow.status === 'Activo') {
      if (flow.id === 'agente-madre') {
        // Abrir modal para Agente Madre
        setModalState({
          isOpen: true,
          flowType: 'agente-madre'
        });
      } else if (flow.id === 'gmail-openai') {
        // Abrir modal para Gmail + OpenAI
        setModalState({
          isOpen: true,
          flowType: 'gmail-openai'
        });
      } else if (flow.id === 'google-calendar') {
        // Abrir modal para Google Calendar + IA
        setModalState({
          isOpen: true,
          flowType: 'google-calendar'
        });
      } else if (flow.id === 'generador-propuestas') {
        // Abrir modal para Generador de Propuestas
        setModalState({
          isOpen: true,
          flowType: 'generador-propuestas'
        });
      } else if (flow.id === 'pdf-uploader') {
        // Abrir modal para Subir Archivo PDF
        setModalState({
          isOpen: true,
          flowType: 'pdf-uploader'
        });
      } else if (flow.id === 'invoice-reader') {
        // Abrir modal para Lector de Facturas
        setModalState({
          isOpen: true,
          flowType: 'invoice-reader'
        });
      } else if (flow.id === 'exchange-stock') {
        // Abrir modal para Tipo de Cambio + Bolsa
        setModalState({
          isOpen: true,
          flowType: 'exchange-stock'
        });      } else if (flow.id === 'legal-consultant') {
        // Abrir modal para Abogado Consultor
        setModalState({
          isOpen: true,
          flowType: 'legal-consultant'
        });      } else if (flow.id === 'weather-maps') {
        // Abrir modal para Meteorología + Google Maps
        setModalState({
          isOpen: true,
          flowType: 'weather-maps'
        });      } else if (flow.id === 'accounting-admin') {
        // Abrir modal para Administración Contable
        setModalState({
          isOpen: true,
          flowType: 'accounting-admin'
        });
      } else if (flow.id === 'supplier-contact') {
        // Abrir modal para Contacto Proveedores
        setModalState({
          isOpen: true,
          flowType: 'supplier-contact'
        });
      } else {
        console.log('Abriendo flujo:', flow.title);
        
        toast.success(`Activando ${flow.title}`, {
          description: 'El flujo se está configurando...',
          icon: '⚡',
          duration: 3000
        });
      }
    } else {
      console.log('Flujo próximamente:', flow.title);
      
      // Toast para flujos no disponibles
      toast.warning('Flujo próximamente', {
        description: `${flow.title} estará disponible pronto. ¡Mantente atento!`,
        icon: '🚧',
        duration: 4000,
        action: {
          label: 'Notificarme',
          onClick: () => toast.success('Te notificaremos cuando esté listo', { icon: '🔔' })
        }
      });
    }
  };
  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      flowType: null
    });
    
  };

  const handleModalSubmit = (formData) => {
    console.log('Datos del formulario Gmail + OpenAI:', formData);
    // Aquí procesarías los datos y harías la llamada a la API
    // Por ejemplo: enviar el prompt a OpenAI y luego enviar el email generado via Gmail API
    
    // Simular procesamiento exitoso
  };

  const activeCount = getActiveFlows().length;
  const upcomingCount = getUpcomingFlows().length;
  const filteredFlows = getFilteredFlows();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Flujos de Automatización
          </h2>
          <p className="text-gray-300">
            Descubre y activa flujos de trabajo inteligentes para tu negocio
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-green-400 font-semibold">{activeCount}</span>
            <span className="text-gray-300 ml-1">activos</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-amber-400 font-semibold">{upcomingCount}</span>
            <span className="text-gray-300 ml-1">próximamente</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white border border-blue-500'
              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
          }`}
        >
          Todos ({DASHBOARD_FLOWS.length})
        </button>
        <button
          onClick={() => setSelectedFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFilter === 'active'
              ? 'bg-green-600 text-white border border-green-500'
              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
          }`}
        >
          Activos ({activeCount})
        </button>
        <button
          onClick={() => setSelectedFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFilter === 'upcoming'
              ? 'bg-amber-600 text-white border border-amber-500'
              : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
          }`}
        >
          Próximamente ({upcomingCount})
        </button>
      </div>      {/* Grid de Flujos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFlows.map((flow, index) => {
          const delay = 10 * index; // Retraso escalonado para cada tarjeta
          
          return (
            <FlowCard
              key={flow.id}
              title={flow.title}
              status={flow.status}
              description={flow.description}
              automationCount={flow.automationCount}
              iconCombo={flow.iconCombo}
              onClick={() => handleFlowClick(flow)}
              className="h-48"
              // Props para animación
              isVisible={cardsVisible}
              animationDelay={delay}
            />
          );
        })}
      </div>      {/* Empty State */}
      {filteredFlows.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay flujos disponibles
            </h3>
            <p className="text-gray-300">
              No se encontraron flujos para el filtro seleccionado.
            </p>
          </div>
        </div>
      )}      {/* Modal Agente Madre */}
      <AgenteMadreModal
        isOpen={modalState.isOpen && modalState.flowType === 'agente-madre'}
        onClose={handleModalClose}
        onSubmit={(masterData) => {
          console.log('Datos del Agente Madre:', masterData);
          // Aquí procesarías los comandos y datos del Agente Madre
        }}
      />

      {/* Modal Gmail + OpenAI */}
      <GmailOpenAIModal
        isOpen={modalState.isOpen && modalState.flowType === 'gmail-openai'}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />

      {/* Modal Google Calendar + IA */}
      <GoogleCalendarModal
        isOpen={modalState.isOpen && modalState.flowType === 'google-calendar'}
        onClose={handleModalClose}
        onSubmit={(formData, result) => {
          console.log('Datos de Google Calendar:', formData, result);
          // Aquí procesarías los datos de la cita creada
        }}
      />

      {/* Modal Generador de Propuestas */}
      <GeneradorPropuestasModal
        isOpen={modalState.isOpen && modalState.flowType === 'generador-propuestas'}
        onClose={handleModalClose}
        onSubmit={(formData, result) => {
          console.log('Datos del Generador de Propuestas:', formData, result);
          // Aquí procesarías los datos de la propuesta generada
        }}
      />

      {/* Modal Subir Archivo PDF */}
      <PdfUploaderModal
        isOpen={modalState.isOpen && modalState.flowType === 'pdf-uploader'}
        onClose={handleModalClose}
      />

      {/* Modal Lector de Facturas */}
      <InvoiceAnalysisModal
        isOpen={modalState.isOpen && modalState.flowType === 'invoice-reader'}
        onClose={handleModalClose}
        onSubmit={(formData, result) => {
          console.log('Datos del lector de facturas:', formData, result);
          // Aquí procesarías los resultados del análisis
        }}
      />      {/* Modal Tipo de Cambio + Bolsa */}
      <ExchangeStockModal
        isOpen={modalState.isOpen && modalState.flowType === 'exchange-stock'}
        onClose={handleModalClose}
        onSubmit={(data) => {
          console.log('Datos financieros:', data);
          // Aquí procesarías los datos financieros
        }}
      />      {/* Modal Abogado Consultor */}
      <LegalConsultantModal
        isOpen={modalState.isOpen && modalState.flowType === 'legal-consultant'}
        onClose={handleModalClose}
        onSubmit={(chatData) => {
          console.log('Datos de consulta legal:', chatData);
          // Aquí procesarías los datos de la consulta legal
        }}
      />      {/* Modal Meteorología + Google Maps */}
      <WeatherMapsModal
        isOpen={modalState.isOpen && modalState.flowType === 'weather-maps'}
        onClose={handleModalClose}
        onSubmit={(weatherData) => {
          console.log('Datos meteorológicos:', weatherData);
          // Aquí procesarías los datos meteorológicos
        }}
      />      {/* Modal Administración Contable */}
      <AccountingAdminModal
        isOpen={modalState.isOpen && modalState.flowType === 'accounting-admin'}
        onClose={handleModalClose}
        onSubmit={(accountingData) => {
          console.log('Datos contables:', accountingData);
          // Aquí procesarías los datos contables
        }}
      />

      {/* Modal Contacto Proveedores */}
      <SupplierContactModal
        isOpen={modalState.isOpen && modalState.flowType === 'supplier-contact'}
        onClose={handleModalClose}
        onSubmit={(supplierData) => {
          console.log('Datos de proveedores:', supplierData);
          // Aquí procesarías los datos de proveedores
        }}
      />
    </div>
  );
};

export default Workflows;