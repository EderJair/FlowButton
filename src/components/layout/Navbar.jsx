// src/components/layout/Navbar.jsx

import React from 'react';
import { Button } from '../common/Button';

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-transparent">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Lado Izquierdo: Logo */}
        <div className="flex items-center">
          <h1 className='text-2xl text-white'></h1>
        </div>
      </div>
    </nav>
  );
};