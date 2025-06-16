// src/components/slide/CarruselInf.jsx

import React, { useState, useEffect, useMemo } from 'react'; // Añadir useMemo
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
  const [titleNumber, setTitleNumber] = useState(0);
  
  const titles = useMemo(
    () => ["eficaz", "rápido", "ágil", "eficiente", "inteligente"],
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="overflow-hidden w-full group py-4">
      <div className='flex justify-center mb-4'>
        <h1 className='text-5xl text-center mb-3 font-bold text-white'>
          Automatiza tu trabajo y <br />sé más {" "}
          <span className="relative inline-block text-blue-600">
            {titles.map((title, index) => (
              <span
                key={index}
                className={`absolute top-0 left-0 font-bold transition-all duration-500 ease-in-out transform
                           ${titleNumber === index 
                             ? 'opacity-100 translate-y-0' 
                             : titleNumber > index 
                               ? 'opacity-0 -translate-y-8' 
                               : 'opacity-0 translate-y-8'
                           }`}
              >
                {title}
              </span>
            ))}
            <span className="invisible">{titles[0]}</span>
          </span>
        </h1>
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
            const delay = 300 * index;

            return (
              <li
                key={`first-${index}`}
                className={`min-w-[200px] cursor-pointer
                           transition-all duration-700 ease-out transform
                           ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                           `}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <SpotlightCard
                  className="h-full w-full border-2 border-white"
                  spotlightColor="rgba(7, 8, 83, 0.64)"
                  backgroundImage={flow.backgroundImage}
                  backgroundIcon={flow.backgroundIcon}
                >
                  <div className="flex flex-col items-center justify-center p-4 h-full relative z-10">
                    <p className="text-xl text-white font-bold text-center mb-1">{flow.name}</p>
                    <p className="text-xl text-blue-400  font-semibold text-center">{flow.description}</p>
                  </div>
                </SpotlightCard>
              </li>
            );
          })}
        </ul>

        {/* Segundo conjunto de flujos (DUPLICADO) */}
        <ul className="flex gap-10 text-white p-4 flex-shrink-0" aria-hidden="true">
          {flows.map((flow, index) => {
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
                  className="h-full w-full border-2 border-white"
                  spotlightColor="rgba(7, 8, 83, 0.64)"
                  backgroundImage={flow.backgroundImage}
                  backgroundIcon={flow.backgroundIcon}
                >
                  <div className="flex flex-col items-center justify-center p-4 h-full relative z-10">
                    <p className="text-xl text-white font-bold text-center mb-1">{flow.name}</p>
                    <p className="text-xl text-blue-400  font-semibold text-center">{flow.description}</p>
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