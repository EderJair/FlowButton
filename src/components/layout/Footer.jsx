// src/components/footer/Footer.jsx
import React from 'react';
// Importa las versiones de tus componentes de íconos para X y GitHub
import XIcon from '../../assets/icons/XIcon';
import GithubIcon from '../../assets/icons/GitHubIcon';

const Footer = () => {
  return (
    <footer className="p-4 sm:p-6 bg-transparent w-full mt-48">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="https://flowbite.com" className="flex items-center">
              {/* Se ha eliminado la etiqueta <img> del logo, solo queda el texto */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FlowButton</span>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://twitter.com/tu-perfil-x" className="hover:underline flex items-center">
                    {/* XIcon ahora se renderiza en blanco por su propia definición */}
                    <XIcon className="w-5 h-5 mr-2" aria-label="Perfil de X (Twitter)" />
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="https://github.com/tu-perfil-github" className="hover:underline flex items-center">
                    {/* GithubIcon ahora se renderiza en blanco por su propia definición */}
                    <GithubIcon className="w-5 h-5 mr-2" aria-label="Perfil de GitHub" />
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} <a href="https://flowbite.com" className="hover:underline">FlowButton™</a>. Todos los derechos reservados.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            {/* Íconos de redes sociales en la parte inferior del footer, solo X y GitHub, ya serán blancos por su definición */}
            <a href="https://twitter.com/tu-perfil-x" className="hover:text-gray-900 dark:hover:text-white"> {/* Mantengo las clases de hover para consistencia */}
              <XIcon className="w-6 h-6" aria-label="Perfil de X (Twitter)" />
            </a>
            <a href="https://github.com/tu-perfil-github" className="hover:text-gray-900 dark:hover:text-white"> {/* Mantengo las clases de hover para consistencia */}
              <GithubIcon className="w-6 h-6" aria-label="Perfil de GitHub" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;