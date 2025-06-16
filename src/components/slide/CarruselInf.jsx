// src/components/slide/CarruselInf.jsx

import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import SpotlightCard from '../card/SpotlightCard';
import GmailIcon from '../../assets/icons/GmailIcon';
import OpenAI from '../../assets/icons/OpenAI';
import WorkflowIcon from '../../assets/icons/WorkflowIcon';
import ShoppingCartIcon from '../../assets/icons/ShoppingCartIcon';
import GrowthIcon from '../../assets/icons/GrowthIcon';
import NotificationBellIcon from '../../assets/icons/NotificationBellIcon';
import DashboardIcon from '../../assets/icons/DashboardIcon';
import DocumentCheckIcon from '../../assets/icons/DocumentCheckIcon';

const flows = [
  { name: "Automatización de Emails", description: "Envía correos con IA", icon: "📧", backgroundIcon: GmailIcon, backgroundImage: null },
  { name: "Gestión de Facturas", description: "Procesa y organiza facturas", icon: "🧾", backgroundIcon: DocumentCheckIcon, backgroundImage: null },
  { name: "Integración CRM", description: "Sincroniza datos de clientes", icon: "🔗", backgroundIcon: DashboardIcon, backgroundImage: "/images/icons/crm_icon.png" },
  { name: "Notificaciones Inteligentes", description: "Alertas personalizadas", icon: "🔔", backgroundIcon: NotificationBellIcon, backgroundImage: null },
  { name: "Automatización de Tareas", description: "Elimina lo repetitivo", icon: "⚙️", backgroundIcon: WorkflowIcon, backgroundImage: "/images/icons/gear_icon.png" },
  { name: "Sincronización de Datos", description: "Conecta tus herramientas", icon: "🔄", backgroundIcon: GrowthIcon, backgroundImage: "/images/icons/sync_icon.png" },
  { name: "Análisis Predictivo", description: "Prevé tendencias futuras", icon: "🔮", backgroundIcon: ShoppingCartIcon, backgroundImage: null },
  { name: "Soporte al Cliente IA", description: "Respuestas automáticas", icon: "🤖", backgroundIcon: OpenAI, backgroundImage: null },
];

export const CarruselInf = () => {
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    // Al montar el componente, activa la visibilidad de las tarjetas.
    // Puedes añadir un pequeño setTimeout aquí si quieres un retraso inicial
    // antes de que todas las tarjetas empiecen a aparecer.
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 100); // Pequeño retraso para que el componente se cargue antes de la animación

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden w-full group py-4">
      <div className='flex justify-center mb-4'>
        {/* Aquí también podrías aplicar un efecto de entrada al título, similar a MobileSection */}
        <h1 className='text-5xl mb-3 font-bold text-white'>Principales <span className='text-blue-500'>Flujos</span></h1>
      </div>
      <div className="
        flex flex-nowrap
        w-max
        animate-infinite-scroll
        group-hover:animation-play-state-paused
      ">
        {/* Primer conjunto de flujos */}
        <ul className="flex gap-10 text-white p-4 flex-shrink-0">
          {flows.map((flow, index) => {
            // Calcula el retraso dinámicamente para cada tarjeta
            const delay = 300 * index; // Cada tarjeta aparece 100ms después de la anterior

            return (
              <li
                key={`first-${index}`}
                className={`min-w-[200px] cursor-pointer
                           transition-all duration-700 ease-out transform
                           ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                           `}
                style={{ transitionDelay: `${delay}ms` }} // Aplica el retraso
              >
                <SpotlightCard
                  className="h-full w-full"
                  spotlightColor="rgba(0, 229, 255, 0.2)"
                  backgroundImage={flow.backgroundImage}
                  backgroundIcon={flow.backgroundIcon}
                >
                  <div className="flex flex-col items-center justify-center p-4 h-full relative z-10">
                    <p className="text-xl font-semibold text-center mb-1">{flow.name}</p>
                    <p className="text-sm text-gray-300 text-center">{flow.description}</p>
                  </div>
                </SpotlightCard>
              </li>
            );
          })}
        </ul>

        {/* Segundo conjunto de flujos (DUPLICADO) */}
        {/* Las tarjetas duplicadas también necesitan el efecto de entrada */}
        <ul className="flex gap-10 text-white p-4 flex-shrink-0" aria-hidden="true">
          {flows.map((flow, index) => {
            // Mismo cálculo de retraso para el segundo conjunto, asegurando que se vea bien
            const delay = 100 * index;

            return (
              <li
                key={`second-${index}`}
                className={`min-w-[200px]
                           transition-all duration-700 ease-out transform
                           ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                           `}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <SpotlightCard
                  className="h-full w-full"
                  spotlightColor="rgba(0, 229, 255, 0.2)"
                  backgroundImage={flow.backgroundImage}
                  backgroundIcon={flow.backgroundIcon}
                >
                  <div className="flex flex-col items-center justify-center p-4 h-full relative z-10">
                    <p className="text-xl font-semibold text-center mb-1">{flow.name}</p>
                    <p className="text-sm text-gray-300 text-center">{flow.description}</p>
                  </div>
                </SpotlightCard>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};