// src/examples/GmailModalExample.jsx
// Este archivo es solo para referencia - muestra cómo usar el modal actualizado

import React, { useState } from 'react';
import { GmailOpenAIModal } from '../features/dashboard/components/modals/GmailOpenAIModal';

const GmailModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Callback que se ejecuta cuando el email se envía exitosamente
  const handleEmailSent = (formData, result) => {
    console.log('📧 Email enviado exitosamente:', {
      recipient: formData.destinatario,
      prompt: formData.prompt,
      result: result
    });

    // Aquí puedes agregar tu lógica personalizada:
    // - Mostrar notificación de éxito
    // - Actualizar estado de la aplicación
    // - Registrar la acción en analytics
    // - etc.
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Ejemplo de Modal Gmail + OpenAI
      </h2>
      
      <p className="text-gray-300 mb-6">
        Este modal está conectado con los servicios de backend para enviar emails generados por IA.
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="
          px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
          text-white font-medium rounded-lg 
          hover:from-blue-600 hover:to-purple-700 
          transition-all duration-200 transform hover:scale-105
        "
      >
        🚀 Abrir Gmail + IA
      </button>

      <GmailOpenAIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSent}
      />

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Estado del Modal:
        </h3>
        <p className="text-gray-300">
          Modal {isModalOpen ? 'Abierto' : 'Cerrado'}
        </p>
      </div>
    </div>
  );
};

export default GmailModalExample;
