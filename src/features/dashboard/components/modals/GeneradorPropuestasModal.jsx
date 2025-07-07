import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { Document } from '@/assets/icons';
import { useGeneradorPropuestaFlow } from '@/hooks/useGeneradorPropuestaFlow';

const GeneradorPropuestasModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Hook para gestionar el flujo de Generador de Propuestas + IA
    const {
        error,
        success,
        isLoading,
        propuestaData,
        createPropuesta,
        clearStates
    } = useGeneradorPropuestaFlow();

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
            nombre_cliente: '',
            industria: '',
            servicios_solicitados: '',
            presupuesto_estimado: '',
            timeline: ''
        }
    });

    // Watch para habilitar/deshabilitar el botón
    const formValues = watch();
    const isFormValid = Object.values(formValues).every(value => value?.trim?.());

    // Efecto para mostrar el modal con animación
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);

            // Toast de bienvenida al abrir el modal
            toast.info(' Generador de Propuestas Comerciales', {
                description: 'Completa el formulario y la IA generará una propuesta profesional',
                icon: ' ',
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
            console.log(' Enviando solicitud de propuesta:', data);

            const result = await createPropuesta(data);

            // Si hay un callback onSubmit, ejecutarlo
            if (onSubmit) {
                onSubmit(data, result);
            }

            // Mostrar toast de éxito
            toast.success('¡Propuesta procesada exitosamente!', {
                description: 'La IA está generando tu propuesta comercial profesional',
                icon: ' ',
                duration: 3000,
            });

            // Cerrar modal después de un breve delay
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Error al procesar la propuesta:', error);

            toast.error('Error al procesar la propuesta', {
                description: error.message || 'Ocurrió un error inesperado al procesar tu solicitud.',
                icon: ' ',
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
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Document className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Generador de Propuestas</h2>
                                <p className="text-sm text-gray-400">Completa los datos para tu propuesta comercial</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
                    {/* Nombre del Cliente */}
                    <div>
                        <label htmlFor="nombre_cliente" className="block text-sm font-medium text-gray-300 mb-1">
                            Nombre del Cliente <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nombre_cliente"
                            type="text"
                            {...register("nombre_cliente", { required: "El nombre del cliente es obligatorio" })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Empresa ABC"
                        />
                        {errors.nombre_cliente && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.nombre_cliente.message}
                            </p>
                        )}
                    </div>

                    {/* Industria */}
                    <div>
                        <label htmlFor="industria" className="block text-sm font-medium text-gray-300 mb-1">
                            Industria <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="industria"
                            type="text"
                            {...register("industria", { required: "La industria es obligatoria" })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Tecnología, Salud, Educación"
                        />
                        {errors.industria && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.industria.message}
                            </p>
                        )}
                    </div>

                    {/* Servicios Solicitados */}
                    <div>
                        <label htmlFor="servicios_solicitados" className="block text-sm font-medium text-gray-300 mb-1">
                            Servicios Solicitados <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="servicios_solicitados"
                            {...register("servicios_solicitados", { required: "Los servicios solicitados son obligatorios" })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                            placeholder="Ej: Desarrollo web, Marketing digital, Consultoría"
                        />
                        {errors.servicios_solicitados && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.servicios_solicitados.message}
                            </p>
                        )}
                    </div>

                    {/* Presupuesto Estimado */}
                    <div>
                        <label htmlFor="presupuesto_estimado" className="block text-sm font-medium text-gray-300 mb-1">
                            Presupuesto Estimado <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="presupuesto_estimado"
                            type="text"
                            {...register("presupuesto_estimado", { required: "El presupuesto estimado es obligatorio" })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: $5,000 - $10,000"
                        />
                        {errors.presupuesto_estimado && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.presupuesto_estimado.message}
                            </p>
                        )}
                    </div>

                    {/* Timeline */}
                    <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">
                            Timeline <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="timeline"
                            type="text"
                            {...register("timeline", { required: "El timeline es obligatorio" })}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: 3 meses, Q4 2025"
                        />
                        {errors.timeline && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.timeline.message}
                            </p>
                        )}
                    </div>

                    {/* Error general */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Información */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2"> Información:</h4>
                        <p className="text-xs text-gray-400">
                            Completa todos los campos para generar una propuesta comercial profesional adaptada a las necesidades del cliente. La IA utilizará esta información para crear un documento detallado y personalizado.
                        </p>
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
                            disabled={isSubmitting || !isFormValid}
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
                                    <span className="text-lg"> </span>
                                    Generar Propuesta
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GeneradorPropuestasModal