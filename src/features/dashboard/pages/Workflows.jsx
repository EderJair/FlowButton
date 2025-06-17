// src/features/dashboard/pages/Workflows.jsx
import React, { useState, useEffect } from 'react';
import { FlowCard } from '../components/cards';
import { GmailOpenAIModal } from '../components/modals';
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
  }, []);
  const handleFlowClick = (flow) => {
    if (flow.status === 'Activo') {
      if (flow.id === 'gmail-openai') {
        // Abrir modal para Gmail + OpenAI
        setModalState({
          isOpen: true,
          flowType: 'gmail-openai'
        });
      } else {
        console.log('Abriendo flujo:', flow.title);
        // Aquí puedes agregar la lógica para otros flujos activos
      }
    } else {
      console.log('Flujo próximamente:', flow.title);
      // Aquí puedes mostrar información sobre cuándo estará disponible
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
    alert(`Email generado y enviado a: ${formData.destinatario}\nPrompt: ${formData.prompt}`);
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
          const delay = 150 * index; // Retraso escalonado para cada tarjeta
          
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
      )}

      {/* Modal Gmail + OpenAI */}
      <GmailOpenAIModal
        isOpen={modalState.isOpen && modalState.flowType === 'gmail-openai'}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Workflows;
