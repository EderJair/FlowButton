// src/features/dashboard/components/modals/GoogleCalendarModal.jsx

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { OpenAI } from '@/assets/icons';
import { useGoogleCalendarFlow } from '@/hooks/useGoogleCalendarFlow';

const GoogleCalendarModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Hook para gestionar el flujo Google Calendar + IA
    const {
        error,
        success,
        appointmentData,
        createAppointment,
        clearStates
    } = useGoogleCalendarFlow();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            mensaje: ''
        }
    });

    // Watch para habilitar/deshabilitar el botón
    const mensaje = watch('mensaje');

    // Efecto para mostrar el modal con animación
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);

            // Toast de bienvenida al abrir el modal
            toast.info('Asistente de Google Calendar', {
                description: 'Describe la cita que quieres agendar y la IA se encargará del resto',
                icon: '🤖',
                duration: 3000
            });
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Limpiar formulario al cerrar
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearStates(); // Limpiar estados del hook
        }
    }, [isOpen, reset, clearStates]);

    // Función para procesar el formulario
    const onFormSubmit = async (data) => {
        try {
            console.log('📅 Enviando solicitud de cita:', data);

            const result = await createAppointment(data);

            // Si hay un callback onSubmit, ejecutarlo
            if (onSubmit) {
                onSubmit(data, result);
            }

            // Mostrar toast de éxito
            toast.success('¡Cita procesada exitosamente!', {
                description: 'La IA está procesando tu solicitud y agendará la cita en Google Calendar',
                icon: '🚀',
                duration: 3000,
            });

            // Cerrar modal después de un breve delay
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Error al procesar la cita:', error);

            toast.error('Error al procesar la cita', {
                description: error.message || 'Ocurrió un error inesperado al procesar tu solicitud.',
                icon: '❌',
                duration: 6000
            });
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        bg-black/50 backdrop-blur-sm
        p-4
      `}
            onClick={handleOverlayClick}
        >
            {/* Modal */}
            <div
                className={`
          relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
          backdrop-blur-md border border-white/20 
          rounded-2xl shadow-2xl w-full max-w-lg
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 text-lg">📅</span>
                                </div>
                                <span className="text-gray-400">+</span>
                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <OpenAI className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Google Calendar + IA</h2>
                                <p className="text-sm text-gray-400">Agenda citas con inteligencia artificial</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Badge "Impulsado por IA" */}
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                            <span className="text-sm font-medium text-blue-300">
                                ✨ Asistente Inteligente de Calendario
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
                    {/* Campo de mensaje */}
                    <div>
                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-300 mb-2">
                            Describe la cita que quieres agendar
                        </label>
                        <textarea
                            id="mensaje"
                            {...register('mensaje', {
                                required: 'Por favor describe la cita que quieres agendar',
                                minLength: {
                                    value: 10,
                                    message: 'El mensaje debe tener al menos 10 caracteres'
                                },
                                maxLength: {
                                    value: 500,
                                    message: 'El mensaje no puede exceder 500 caracteres'
                                }
                            })}
                            placeholder="Ej: Agenda una cita con el médico para el día 15 de julio del 2025 a las 3:00 PM"
                            rows={4}
                            className="
                w-full px-4 py-3 rounded-lg 
                bg-white/10 border border-white/20 
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 resize-none
              "
                        />

                        {/* Error message */}
                        {errors.mensaje && (
                            <p className="text-red-400 text-sm mt-2">
                                ❌ {errors.mensaje.message}
                            </p>
                        )}

                        {/* Hook error message */}
                        {error && (
                            <p className="text-red-400 text-sm mt-2">
                                ❌ {error}
                            </p>
                        )}

                        {/* Character counter */}
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-400">
                                La IA analizará tu mensaje y creará la cita automáticamente
                            </p>
                            <span className="text-xs text-gray-400">
                                {mensaje?.length || 0}/500
                            </span>
                        </div>
                    </div>

                    {/* Ejemplos de uso */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Ejemplos de solicitudes:</h4>
                        <ul className="text-xs text-gray-400 space-y-1">
                            <li>• "Agenda una cita con el dentista el viernes a las 2 PM"</li>
                            <li>• "Reunión de trabajo mañana a las 10:00 AM por 1 hora"</li>
                            <li>• "Cena familiar el sábado 20 de julio a las 8 de la noche"</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-white/10 text-gray-300 border border-white/20
                hover:bg-white/20 transition-all duration-200
              "
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid || !mensaje?.trim()}
                            className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-gradient-to-r from-blue-600 to-green-600
                text-white border border-blue-500/30
                hover:from-blue-700 hover:to-green-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              "
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">📅</span>
                                    Agendar Cita
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoogleCalendarModal;