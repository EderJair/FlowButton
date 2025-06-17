import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Agregar esta línea
import Aurora from '../aurora/Aurora';
import { Button } from '../button/Button';

export const MobileSection = () => {
  const navigate = useNavigate(); // Agregar esta línea
  
  const [headingVisible, setHeadingVisible] = useState(false);
  const [paragraphVisible, setParagraphVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setHeadingVisible(true), 200);
    const timer2 = setTimeout(() => setParagraphVisible(true), 500);
    const timer3 = setTimeout(() => setButtonVisible(true), 800);
    const timer4 = setTimeout(() => setImageVisible(true), 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Agregar esta función
  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <section className="bg-transparent dark:bg-transparent relative overflow-hidden min-h-[600px] flex flex-col">
      <Aurora
        colorStops={["#3A29FF","#3A29FF", "#8c3390"]}
        blend={0.3}
        amplitude={0.8}
        speed={1.5}
      />

      <div className="relative z-10 grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 flex-grow">
        <div className="mr-auto place-self-center lg:col-span-6">
          <h1
            className={`max-w-2xl mb-8 text-3xl font-extrabold tracking-tight leading-none
                       md:text-4xl xl:text-5xl dark:text-white
                       transition-all duration-700 ease-out transform
                       ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Flujos Inteligentes al Alcance de un
            <span
              className="inline-block text-blue-600 hover:text-blue-500 cursor-pointer
                         transition-all ease-in-out duration-300 ml-2"
            >
              Boton.
            </span>
          </h1>
          
          <p
            className={`max-w-2xl mb-6 font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400
                       transition-all duration-700 ease-out transform delay-100
                       ${paragraphVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Transforma tus tareas complejas: envía emails con IA, gestiona
            facturas y más. Con un clic desde tu dashboard, automatiza tu
            gestión y libera tu verdadero potencial.
          </p>
          
          {/* Cambiar solo esta parte del botón */}
          <div 
            onClick={handleGetStarted}
            className={`transition-all duration-700 ease-out transform delay-200 cursor-pointer
                       ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Button
              variant="secondary"
            >
              Comenzar
              <svg
                  className="w-6 h-6 ml-3 -mr-1" fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  ></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="hidden lg:mt-0 lg:col-span-6 lg:flex justify-center items-center rounded-lg overflow-hidden">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWxua3pueWswcndocjR4cG9jNGl5a2g5ZTZvd3gzZDlxcWwzZ2F3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hDSy8w6rGHeTe/giphy.gif"
            alt="Flujo de automatización en acción"
            className={`w-[500px] h-[350px] rounded-2xl border-white border-4 rotate-3 transform hover:-translate-y-2
                        transition-all duration-500 ease-in-out
                        ${imageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
        </div>
      </div>
    </section>
  );
};