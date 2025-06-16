// src/components/Navbar/Navbar.jsx

import React from 'react';
import { Button } from '../button/Button'; // <-- Importa el nuevo componente Button

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-transparent py-4 mt-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Lado Izquierdo: Logo */}
        <div className="flex items-center">
          <h1 className='text-2xl text-white'>FlowButton</h1>
        </div>
      </div>
    </nav>
  );
};