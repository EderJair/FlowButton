// src/features/carousel/CarruselInf.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { SpotlightCard } from '../../components';
import {
  GmailIcon,
  OpenAI,
  WorkflowIcon,
  ShoppingCartIcon,
  GrowthIcon,
  NotificationBellIcon,
  DashboardIcon,
  DocumentCheckIcon
} from '../../assets/icons';
import { CAROUSEL_CONFIG } from '../../constants';

// Icon mapping for dynamic usage
const iconMap = {
  GmailIcon,
  OpenAI,
  WorkflowIcon,
  ShoppingCartIcon,
  GrowthIcon,
  NotificationBellIcon,
  DashboardIcon,
  DocumentCheckIcon
};

const flows = [
  { name: "Automatización de Emails", description: "Envía correos con IA", backgroundIcon: iconMap.GmailIcon },
  { name: "Gestión de Facturas", description: "Procesa y organiza facturas", backgroundIcon: iconMap.DocumentCheckIcon },
  { name: "Integración CRM", description: "Sincroniza datos de clientes", backgroundIcon: iconMap.DashboardIcon },
  { name: "Notificaciones Inteligentes", description: "Alertas personalizadas", backgroundIcon: iconMap.NotificationBellIcon },
  { name: "Automatización de Tareas", description: "Elimina lo repetitivo", backgroundIcon: iconMap.WorkflowIcon },
  { name: "Sincronización de Datos", description: "Conecta tus herramientas", backgroundIcon: iconMap.GrowthIcon },
  { name: "Análisis Predictivo", description: "Prevé tendencias futuras", backgroundIcon: iconMap.ShoppingCartIcon },
  { name: "Soporte al Cliente IA", description: "Respuestas automáticas", backgroundIcon: iconMap.OpenAI },
];

export const CarruselInf = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  
  const titles = useMemo(
    () => CAROUSEL_CONFIG.titles,
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
    }, CAROUSEL_CONFIG.titleChangeInterval);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="overflow-hidden w-full group">
      <div className='flex justify-center mb-4'>
        <h1 className='text-5xl text-center mb-3 font-bold text-white'>
          Automatiza tu trabajo y sé <br /> más {" "}
          <span className="relative inline-block text-blue-400">
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
        <ul className="flex gap-10 text-white p-4 mb-1 flex-shrink-0">
          {flows.map((flow, index) => {
            const delay = 300 * index;

            return (              <li
                key={`first-${index}`}
                className={`min-w-[200px] cursor-pointer
                           transition-all duration-700 ease-out transform
                           ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                           `}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <SpotlightCard
                  className="h-full w-full"
                  spotlightColor="rgba(7, 8, 83, 0.64)"
                >
                  <div className="flex flex-col items-center justify-center mb-4 h-full relative z-10">
                    {/* SVG Icon arriba */}
                    <div className="mb-4 flex-shrink-0">
                      <flow.backgroundIcon className="w-12 h-12 text-blue-400" />
                    </div>
                    {/* Texto abajo */}
                    <div className="text-center">
                      <p className="text-lg text-white font-bold text-center mb-1">{flow.name}</p>
                      <p className="text-lg text-blue-400 font-semibold text-center">{flow.description}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </li>
            );
          })}
        </ul>

        {/* Segundo conjunto de flujos (DUPLICADO) */}
        <ul className="flex gap-10 text-white p-4 mb-1 flex-shrink-0" aria-hidden="true">
          {flows.map((flow, index) => {
            const delay = 100 * index;

            return (              <li
                key={`second-${index}`}
                className={`min-w-[200px]
                           transition-all duration-700 ease-out transform
                           ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                           `}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <SpotlightCard
                  className="h-full w-full"
                  spotlightColor="rgba(7, 8, 83, 0.64)"
                >
                  <div className="flex flex-col items-center justify-center  h-full relative z-10">
                    {/* SVG Icon arriba */}
                    <div className="mb-4 flex-shrink-0">
                      <flow.backgroundIcon className="w-12 h-12 text-blue-400" />
                    </div>
                    {/* Texto abajo */}
                    <div className="text-center">
                      <p className="text-lg text-white font-bold text-center mb-1">{flow.name}</p>
                      <p className="text-lg text-blue-400 font-semibold text-center">{flow.description}</p>
                    </div>
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