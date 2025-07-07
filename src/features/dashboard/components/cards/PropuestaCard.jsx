// src/features/dashboard/components/cards/PropuestaCard.jsx
import { Document, OpenAI } from '@/assets/icons';

const PropuestaCard = ({
  onClick,
  className = '',
  // Props para animación
  isVisible = true,
  animationDelay = 0
}) => {
  const title = "Generador de Propuestas";
  const description = "Crea propuestas comerciales profesionales con IA";
  const status = "Activo"; // Asumimos que está activo desde el inicio
  const automationCount = 2; // Número de automatizaciones disponibles
  const isActive = status === 'Activo';
  
  // Iconos para mostrar la combinación (Documento + IA)
  const iconCombo = [Document, OpenAI];

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl cursor-pointer
        transition-all duration-200 transform
        hover:scale-105 hover:shadow-xl
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
        }
        ${isActive 
          ? 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30' 
          : 'bg-gradient-to-br from-gray-700/20 to-gray-900/20 border border-gray-600/30'
        }
        backdrop-blur-md
        ${className}
      `}
      style={{ 
        transitionDelay: `${animationDelay}ms` 
      }}
      onClick={onClick}
    >
      {/* Badge de estado */}
      <div className="absolute top-4 right-4 z-10">
        <span 
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${isActive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }
          `}
        >
          {status}
        </span>
      </div>

      <div className="p-6">
        {/* Iconos de combinación */}
        {iconCombo && iconCombo.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {iconCombo.map((IconComponent, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10">
                  <IconComponent className="w-5 h-5 text-blue-400" />
                </div>
                {index < iconCombo.length - 1 && (
                  <span className="mx-2 text-gray-400 text-sm">+</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Título */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Footer con información de automatizaciones */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            <span className="font-medium text-blue-400">{automationCount}</span> automatizaciones disponibles
          </div>
          
          {isActive && (
            <div className="text-xs text-blue-400 font-medium">
              Click para abrir
            </div>
          )}
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default PropuestaCard;