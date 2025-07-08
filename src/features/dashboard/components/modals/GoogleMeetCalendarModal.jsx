// src/features/dashboard/components/modals/GoogleMeetCalendarModal.jsx

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { OpenAI } from '@/assets/icons';
import { useGoogleMeetCalendarFlow } from '@/hooks/useGoogleMeetCalendarFlow';

const GoogleMeetCalendarModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Hook para gestionar el flujo N8N
    const {
        isLoading,
        error,
        success,
        appointmentData,
        createMeetAppointment,
        clearStates
    } = useGoogleMeetCalendarFlow();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            mensaje: ''
        }
    });

    const mensaje = watch('mensaje');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Asistente N8N + Google Meet Calendar', {
                description: 'Describe la cita y N8N creará el evento con Google Meet',
                icon: '🤖',
                duration: 3000
            });
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearStates();
        }
    }, [isOpen, reset, clearStates]);

    // Función para procesar el formulario
    const onFormSubmit = async (data) => {
        try {
            console.log('📅 Enviando solicitud Google Meet a N8N:', data);

            const result = await createMeetAppointment(data);

            if (onSubmit) {
                onSubmit(data, result);
            }

            // Toast de éxito adaptado a N8N
            toast.success('¡Google Meet programado!', {
                description: 'N8N está creando tu evento con enlace de Google Meet',
                icon: '🚀',
                duration: 3000,
            });

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Error al procesar con N8N:', error);

            toast.error('Error en el workflow N8N', {
                description: error.message || 'Ocurrió un error al conectar con N8N.',
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
                bg-black/50 backdrop-blur-sm p-4
            `}
            onClick={handleOverlayClick}
        >
            <div
                className={`
                    relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
                    backdrop-blur-md border border-white/20 
                    rounded-2xl shadow-2xl w-full max-w-2xl
                    transition-all duration-300 ease-out transform
                    ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                    max-h-[90vh] overflow-y-auto
                `}
            >
                {/* Header actualizado */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-400 text-xl">⚡</span>
                                </div>
                                <span className="text-gray-400 text-lg">+</span>
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 text-xl">📅</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">N8N + Google Meet Calendar</h2>
                                <p className="text-base text-gray-400">Eventos automáticos con Meet</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                            <span className="text-xl">✕</span>
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-6 py-3">
                            <span className="text-base font-medium text-purple-300">
                                📹 Google Meet Automático
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
                    <div>
                        <label htmlFor="mensaje" className="block text-base font-medium text-gray-300 mb-3">
                            Describe la reunión que quieres agendar
                        </label>
                        <textarea
                            id="mensaje"
                            {...register('mensaje', {
                                required: 'Por favor describe la reunión que quieres agendar',
                                minLength: {
                                    value: 10,
                                    message: 'El mensaje debe tener al menos 10 caracteres'
                                },
                                maxLength: {
                                    value: 500,
                                    message: 'El mensaje no puede exceder 500 caracteres'
                                }
                            })}
                            placeholder="Ejemplo: Necesito programar una entrevista técnica para el puesto de Desarrollador Senior Frontend. 

Participantes: 
- afestebancieza@gmail.com
- prueba@gmail.com  
- prueba.lead@empresa.com

Fecha: 16 de julio 2025 a las 3:00 PM
Encargado: Carlos Méndez del área de Tecnología
Duración: 60 minutos
Incluir evaluación técnica de React y JavaScript."
                            rows={8}
                            className="
                                w-full px-5 py-4 rounded-lg text-base
                                bg-white/10 border border-white/20 
                                text-white placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-200 resize-none
                                leading-relaxed
                            "
                        />

                        {errors.mensaje && (
                            <p className="text-red-400 text-sm mt-3">
                                ❌ {errors.mensaje.message}
                            </p>
                        )}

                        {error && (
                            <p className="text-red-400 text-sm mt-3">
                                ❌ {error}
                            </p>
                        )}

                        <div className="flex justify-between items-center mt-3">
                            <p className="text-sm text-gray-400">
                                N8N creará el evento y generará el enlace de Google Meet automáticamente
                            </p>
                            <span className="text-sm text-gray-400">
                                {mensaje?.length || 0}/500
                            </span>
                        </div>
                    </div>

                    {/* Ejemplos de uso */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                        <h4 className="text-base font-medium text-blue-300 ">💡 Incluye en tu mensaje:</h4>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li>• <strong>Participantes:</strong> Lista de emails de los invitados</li>
                            <li>• <strong>Fecha y hora:</strong> Cuándo quieres que sea la reunión</li>
                            <li>• <strong>Duración:</strong> Tiempo estimado de la reunión</li>
                            <li>• <strong>Título/Tema:</strong> Descripción del propósito</li>
                            <li>• <strong>Detalles adicionales:</strong> Agenda o notas importantes</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1 px-6 py-4 rounded-lg font-medium text-base
                                bg-white/10 text-gray-300 border border-white/20
                                hover:bg-white/20 transition-all duration-200
                            "
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !isValid || !mensaje?.trim()}
                            className="
                                flex-1 px-6 py-4 rounded-lg font-medium text-base
                                bg-gradient-to-r from-purple-600 to-blue-600
                                text-white border border-purple-500/30
                                hover:from-purple-700 hover:to-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                                flex items-center justify-center gap-3
                            "
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creando Meet...
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">📹</span>
                                    Crear Google Meet
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoogleMeetCalendarModal;