// src/components/SpotlightCard/SpotlightCard.jsx

import { useRef, useState } from "react";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  backgroundImage,
  backgroundIcon: BackgroundIconComponent
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-neutral-800 overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {backgroundImage && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '80%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'grayscale(100%) brightness(200%) opacity(0.1)',
          }}
        ></div>
      )}

      {BackgroundIconComponent && ( // Renderiza si hay un componente SVG
        <div
          // Posición abajo a la derecha, con un padding para que no se pegue totalmente al borde
          className="absolute inset-0 flex items-end justify-end p-6 pointer-events-none z-0"
        >
          <BackgroundIconComponent
            // CAMBIO AQUÍ: Aumentamos el tamaño del SVG para que ocupe más espacio
            // Probamos con w-full h-full para que ocupe el 100% del espacio disponible
            // dentro del padding de su contenedor.
            className="w-full h-full opacity-10 text-white" // <-- CAMBIADO A w-full h-full
          />
        </div>
      )}

      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;