import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { useTicketFlow } from '@/hooks/useTicketFlow';

const TicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [ticketResults, setTicketResults] = useState(null);

    // Hook para gestionar el flujo de tickets N8N
    const {
        isLoading,
        error,
        success,
        ticketData,
        submitTicket,
        clearStates
    } = useTicketFlow();

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
            nombre: '',
            email: '',
            empresa: '',
            telefono: '',
            asunto: '',
            mensaje: '',
            tipo_cliente: 'Regular',
            canal: 'Web'
        }
    });

    const watchedFields = watch();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Sistema de Tickets con IA', {
                description: 'Crea un ticket y obtén clasificación automática',
                icon: '🎫',
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
            setShowResults(false);
            setTicketResults(null);
        }
    }, [isOpen, reset, clearStates]);

    // Función para procesar el formulario
    const onFormSubmit = async (data) => {
        try {
            console.log('🎫 Enviando ticket a N8N:', data);

            const result = await submitTicket(data);

            if (onSubmit) {
                onSubmit(data, result);
            }

            // Extraer datos del response anidado
            const ticketData = result.raw?.data || result.raw || result;
            
            console.log('📊 Datos del ticket procesado:', ticketData);

            // Guardar resultados y mostrar la vista de resultados
            setTicketResults(ticketData);
            setShowResults(true);

            toast.success('¡Ticket creado exitosamente!', {
                description: `Ticket ID: ${ticketData.id || 'Procesado'}`,
                icon: '✅',
                duration: 4000,
            });

        } catch (error) {
            console.error('Error al crear ticket:', error);

            toast.error('Error al crear ticket', {
                description: error.message || 'Ocurrió un error al procesar el ticket.',
                icon: '❌',
                duration: 6000
            });
        }
    };

    // Función para crear nuevo ticket
    const handleNewTicket = () => {
        setShowResults(false);
        setTicketResults(null);
        reset();
        clearStates();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Función para obtener el color de la prioridad
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICA':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'ALTA':
                return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
            case 'MEDIA':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'BAJA':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    // Función para obtener el icono de categoría
    const getCategoryIcon = (category) => {
        const icons = {
            'TECNICO': '🔧',
            'FACTURACION': '💰',
            'COMERCIAL': '🏢',
            'RRHH': '👥',
            'LEGAL': '⚖️',
            'GENERAL': '📝'
        };
        return icons[category] || '📋';
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
                    rounded-2xl shadow-2xl w-full
                    transition-all duration-300 ease-out transform
                    ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                    max-h-[90vh] overflow-y-auto
                    ${showResults ? 'max-w-5xl' : 'max-w-2xl'}
                `}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 text-xl">🎫</span>
                                </div>
                                <span className="text-gray-400 text-lg">+</span>
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-400 text-xl">🤖</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {showResults ? 'Ticket Procesado' : 'Sistema de Tickets con IA'}
                                </h2>
                                <p className="text-base text-gray-400">
                                    {showResults ? 'Clasificación automática completada' : 'Clasificación inteligente y enrutamiento automático'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                            <span className="text-xl">✕</span>
                        </button>
                    </div>

                    {!showResults ? (
                        <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-3">
                                <span className="text-base font-medium text-blue-300">
                                    🎯 Soporte Inteligente Automatizado
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Información del ticket procesado */
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg px-6 py-4">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    ✅ Ticket ID: {ticketResults?.id || 'N/A'}
                                </h3>
                                <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                                    <span className="text-blue-300 flex items-center gap-1">
                                        {getCategoryIcon(ticketResults?.categoria)} 
                                        {ticketResults?.categoria || 'Sin categoría'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full border font-medium ${getPriorityColor(ticketResults?.prioridad)}`}>
                                        {ticketResults?.prioridad || 'Sin prioridad'}
                                    </span>
                                    <span className="text-green-300 flex items-center gap-1">
                                        📧 {ticketResults?.area_email || 'Sin área'}
                                    </span>
                                    <span className="text-purple-300 flex items-center gap-1">
                                        ⏰ {ticketResults?.sla_tiempo || 'Sin SLA'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenido principal */}
                {!showResults ? (
                    /* Formulario de creación de ticket */
                    <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-6">
                        
                        {/* Información del solicitante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    {...register('nombre', { 
                                        required: 'El nombre es requerido',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                    })}
                                    type="text"
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                    "
                                    placeholder="Ej: Juan Pérez"
                                />
                                {errors.nombre && (
                                    <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    {...register('email', { 
                                        required: 'El email es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    type="email"
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                    "
                                    placeholder="Ej: juan@empresa.com"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Empresa
                                </label>
                                <input
                                    {...register('empresa')}
                                    type="text"
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                    "
                                    placeholder="Ej: TechCorp SA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    {...register('telefono')}
                                    type="tel"
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                    "
                                    placeholder="Ej: +51 999 123 456"
                                />
                            </div>
                        </div>

                        {/* Detalles del ticket */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Asunto *
                            </label>
                            <input
                                {...register('asunto', { 
                                    required: 'El asunto es requerido',
                                    minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                                })}
                                type="text"
                                className="
                                    w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                    text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                    transition-all duration-200
                                "
                                placeholder="Ej: Problema con login del sistema"
                            />
                            {errors.asunto && (
                                <p className="text-red-400 text-sm mt-1">{errors.asunto.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descripción del problema *
                            </label>
                            <textarea
                                {...register('mensaje', { 
                                    required: 'La descripción es requerida',
                                    minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                                })}
                                rows={4}
                                className="
                                    w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                    text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                    transition-all duration-200 resize-none
                                "
                                placeholder="Describe detalladamente tu consulta o problema..."
                            />
                            {errors.mensaje && (
                                <p className="text-red-400 text-sm mt-1">{errors.mensaje.message}</p>
                            )}
                        </div>

                        {/* Información adicional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tipo de cliente
                                </label>
                                <select
                                    {...register('tipo_cliente')}
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                        [&>option]:bg-gray-800 [&>option]:text-white
                                    "
                                >
                                    <option className="bg-gray-800 text-white" value="Regular">Regular</option>
                                    <option className="bg-gray-800 text-white" value="VIP">VIP</option>
                                    <option className="bg-gray-800 text-white" value="Enterprise">Enterprise</option>
                                    <option className="bg-gray-800 text-white" value="Nuevo">Nuevo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Canal de contacto
                                </label>
                                <select
                                    {...register('canal')}
                                    className="
                                        w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                                        text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                        transition-all duration-200
                                        [&>option]:bg-gray-800 [&>option]:text-white
                                    "
                                >
                                    <option className="bg-gray-800 text-white" value="Web">Web</option>
                                    <option className="bg-gray-800 text-white" value="Email">Email</option>
                                    <option className="bg-gray-800 text-white" value="Teléfono">Teléfono</option>
                                    <option className="bg-gray-800 text-white" value="Chat">Chat</option>
                                    <option className="bg-gray-800 text-white" value="WhatsApp">WhatsApp</option>
                                </select>
                            </div>
                        </div>

                        {/* Información del proceso */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                            <h4 className="text-base font-medium text-blue-300 mb-3">🤖 Qué sucederá con tu ticket:</h4>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>• <strong>Clasificación automática:</strong> La IA determinará categoría y prioridad</li>
                                <li>• <strong>Enrutamiento inteligente:</strong> Se enviará al área correcta automáticamente</li>
                                <li>• <strong>SLA automático:</strong> Se asignará tiempo de respuesta según prioridad</li>
                                <li>• <strong>Confirmación inmediata:</strong> Recibirás un email de confirmación</li>
                                <li>• <strong>Seguimiento:</strong> El equipo especializado se contactará contigo</li>
                            </ul>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-400 text-sm">❌ {error}</p>
                            </div>
                        )}

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
                                disabled={isLoading || !isValid}
                                className="
                                    flex-1 px-6 py-4 rounded-lg font-medium text-base
                                    bg-gradient-to-r from-blue-600 to-purple-600
                                    text-white border border-blue-500/30
                                    hover:from-blue-700 hover:to-purple-700
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-200
                                    flex items-center justify-center gap-3
                                "
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">🎫</span>
                                        Crear Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Vista de resultados */
                    <div className="p-8 space-y-6">
                        {/* Resumen del ticket */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                                <div className="text-1xl font-bold text-blue-400 mb-1">
                                    {ticketResults?.id || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-400">Ticket ID</div>
                                <div className="text-xs text-blue-300 mt-1 truncate">
                                    {ticketResults?.id || 'Sin ID'}
                                </div>
                            </div>
                            
                            <div className={`rounded-lg p-4 border text-center ${getPriorityColor(ticketResults?.prioridad)}`}>
                                <div className="text-lg font-bold">
                                    {ticketResults?.prioridad || 'N/A'}
                                </div>
                                <div className="text-sm opacity-75">Prioridad</div>
                                <div className="text-xs opacity-60 mt-1">
                                    SLA: {ticketResults?.sla_tiempo || 'N/A'}
                                </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                                <div className="text-lg font-medium text-white">
                                    {ticketResults?.categoria || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-400">Categoría</div>
                                <div className="text-xs text-green-300 mt-1">
                                    {getCategoryIcon(ticketResults?.categoria)} {ticketResults?.nivel_tecnico || 'BÁSICO'}
                                </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                                <div className="text-lg font-medium text-white truncate">
                                    {ticketResults?.area_email || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-400">Área Asignada</div>
                                <div className="text-xs text-purple-300 mt-1">
                                    {ticketResults?.departamento || 'Sin departamento'}
                                </div>
                            </div>
                        </div>

                        {/* Contenido en dos columnas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Columna izquierda */}
                            <div className="space-y-6">
                                {/* Análisis de la IA */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        🤖 Análisis de IA
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-purple-300 font-medium mb-2">Resumen técnico:</h4>
                                            <p className="text-gray-300 text-sm">
                                                {ticketResults?.resumen || 'No disponible'}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-blue-300 font-medium mb-2">Justificación:</h4>
                                            <p className="text-gray-300 text-sm">
                                                {ticketResults?.justificacion || 'No disponible'}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-orange-300 font-medium mb-2">Impacto en el negocio:</h4>
                                            <p className="text-gray-300 text-sm">
                                                {ticketResults?.impacto_negocio || 'Sin evaluar'}
                                            </p>
                                        </div>

                                        {ticketResults?.palabras_clave?.length > 0 && (
                                            <div>
                                                <h4 className="text-green-300 font-medium mb-2">Palabras clave detectadas:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {ticketResults.palabras_clave.map((palabra, index) => (
                                                        <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                                                            {palabra}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-yellow-300 font-medium mb-2">Sentimiento:</h4>
                                                <span className={`px-3 py-1 rounded-full text-sm border ${
                                                    ticketResults?.sentimiento_usuario === 'CRITICO' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                                    ticketResults?.sentimiento_usuario === 'FRUSTRADO' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                                    ticketResults?.sentimiento_usuario === 'URGENTE' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                                    'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                }`}>
                                                    {ticketResults?.sentimiento_usuario || 'NEUTRAL'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-cyan-300 font-medium mb-2">Nivel técnico:</h4>
                                                <span className="px-3 py-1 rounded-full text-sm border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                                    {ticketResults?.nivel_tecnico || 'BÁSICO'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Indicador de calidad de clasificación */}
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-300 text-sm">Confianza de clasificación:</span>
                                                <span className="text-blue-300 font-medium">
                                                    {ticketResults?.confianza_clasificacion || 'Alta'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-blue-300 text-sm">Procesado por:</span>
                                                <span className="text-blue-300 font-medium">
                                                    {ticketResults?.procesado_por || 'Sistema IA'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del ticket original */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        📋 Detalles del Ticket
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Fecha:</span>
                                            <span className="text-white">{ticketResults?.fecha || 'No disponible'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Cliente:</span>
                                            <span className="text-white">{ticketResults?.nombre || 'No disponible'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Email:</span>
                                            <span className="text-white">{ticketResults?.email || 'No disponible'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Empresa:</span>
                                            <span className="text-white">{ticketResults?.empresa || 'No especificada'}</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 mt-4">
                                            <div>
                                                <span className="text-gray-400">Asunto:</span>
                                                <p className="text-white mt-1">{ticketResults?.asunto || 'No disponible'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Mensaje:</span>
                                                <p className="text-white mt-1 bg-gray-800/50 p-3 rounded">
                                                    {ticketResults?.mensaje || 'No disponible'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-6">
                                {/* Configuración de enrutamiento */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        📧 Enrutamiento Automático
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <h4 className="text-blue-300 font-medium mb-2">Email principal:</h4>
                                            <p className="text-white font-mono text-sm">
                                                {ticketResults?.emailPrincipal || ticketResults?.area_email || 'No disponible'}
                                            </p>
                                        </div>

                                        {ticketResults?.emails_cc?.length > 0 && (
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                                                <h4 className="text-purple-300 font-medium mb-2">Emails CC:</h4>
                                                <div className="space-y-1">
                                                    {ticketResults.emails_cc.map((email, index) => (
                                                        <p key={index} className="text-white font-mono text-sm">
                                                            {email}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">Tiempo de respuesta:</span>
                                                <p className="text-white font-medium">
                                                    {ticketResults?.sla_tiempo || 'No definido'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Email principal:</span>
                                                <p className="text-white font-medium text-xs">
                                                    {ticketResults?.email_principal || ticketResults?.area_email || 'No asignado'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Información adicional de enrutamiento */}
                                        {ticketResults?.escalamiento && (
                                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                                <h4 className="text-orange-300 font-medium mb-2">⚡ Escalamiento:</h4>
                                                <p className="text-orange-200 text-sm">
                                                    {ticketResults.escalamiento}
                                                </p>
                                                {ticketResults?.telefono_urgencia && (
                                                    <p className="text-orange-200 text-xs mt-1">
                                                        📞 Tel. urgencia: {ticketResults.telefono_urgencia}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Estado y seguimiento */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        📊 Estado y Seguimiento
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">Estado actual:</span>
                                                <p className="text-white font-medium">
                                                    {ticketResults?.estado || 'Nuevo'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">Nivel técnico:</span>
                                                <p className="text-white font-medium">
                                                    {ticketResults?.nivel_tecnico || 'No definido'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 text-sm">Requiere seguimiento:</span>
                                            <div className="mt-1">
                                                <span className={`px-3 py-1 rounded-full text-sm border ${
                                                    ticketResults?.requiere_followup 
                                                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                                                        : 'bg-green-500/20 text-green-300 border-green-500/30'
                                                }`}>
                                                    {ticketResults?.requiere_followup ? 'Sí' : 'No'}
                                                </span>
                                            </div>
                                        </div>

                                        {ticketResults?.impacto_negocio && (
                                            <div>
                                                <h4 className="text-orange-300 font-medium mb-2">📈 Impacto en el negocio:</h4>
                                                <p className="text-orange-200 text-sm bg-orange-500/10 p-3 rounded">
                                                    {ticketResults.impacto_negocio}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Próximos pasos */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        🚀 Próximos Pasos
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="text-green-400 mt-1">✅</span>
                                            <div>
                                                <p className="text-white font-medium">Ticket creado y clasificado</p>
                                                <p className="text-gray-400">El sistema ha procesado automáticamente tu solicitud</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <span className="text-blue-400 mt-1">📧</span>
                                            <div>
                                                <p className="text-white font-medium">Notificación enviada</p>
                                                <p className="text-gray-400">El área de {ticketResults?.area_email} ha sido notificada</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <span className="text-yellow-400 mt-1">⏰</span>
                                            <div>
                                                <p className="text-white font-medium">Tiempo de respuesta</p>
                                                <p className="text-gray-400">Recibirás respuesta en máximo {ticketResults?.sla_tiempo || 'tiempo no definido'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <span className="text-purple-400 mt-1">🔔</span>
                                            <div>
                                                <p className="text-white font-medium">Confirmación por email</p>
                                                <p className="text-gray-400">Revisa tu bandeja de entrada para más detalles</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6 border-t border-white/10">
                            <button
                                onClick={handleNewTicket}
                                className="
                                    flex-1 px-6 py-3 rounded-lg font-medium text-base
                                    bg-white/10 text-gray-300 border border-white/20
                                    hover:bg-white/20 transition-all duration-200
                                    flex items-center justify-center gap-2
                                "
                            >
                                <span className="text-lg">🎫</span>
                                Crear Nuevo Ticket
                            </button>

                            <button
                                onClick={() => {
                                    // Generar texto formateado con los datos disponibles
                                    const ticketInfo = `
🎫 INFORMACIÓN DEL TICKET

📋 IDENTIFICACIÓN:
Ticket ID: ${ticketResults?.id || 'N/A'}
Estado: ${ticketResults?.estado || 'N/A'}

🎯 CLASIFICACIÓN:
Categoría: ${getCategoryIcon(ticketResults?.categoria)} ${ticketResults?.categoria || 'N/A'}
Prioridad: ${ticketResults?.prioridad || 'N/A'}
SLA: ${ticketResults?.sla_tiempo || 'N/A'}

👤 CLIENTE:
Nombre: ${ticketResults?.nombre || 'N/A'}
Email: ${ticketResults?.email || 'N/A'}
Empresa: ${ticketResults?.empresa || 'N/A'}
Teléfono: ${ticketResults?.telefono || 'N/A'}

📝 CONTENIDO:
Asunto: ${ticketResults?.asunto || 'N/A'}
Canal: ${ticketResults?.canal || 'N/A'}

🎯 ENRUTAMIENTO:
Área Responsable: ${ticketResults?.area_email || 'N/A'}
Departamento: ${ticketResults?.departamento || 'N/A'}
Email Principal: ${ticketResults?.email_principal || ticketResults?.area_email || 'N/A'}
Tel. Urgencia: ${ticketResults?.telefono_urgencia || 'N/A'}

🤖 ANÁLISIS IA:
Resumen: ${ticketResults?.resumen || 'N/A'}
Sentimiento: ${ticketResults?.sentimiento_usuario || 'N/A'}
Nivel Técnico: ${ticketResults?.nivel_tecnico || 'N/A'}
Justificación: ${ticketResults?.justificacion || 'N/A'}
Impacto Negocio: ${ticketResults?.impacto_negocio || 'N/A'}

💡 RESPUESTA IA:
${ticketResults?.respuesta_sugerida || 'N/A'}

⚡ ESCALAMIENTO:
${ticketResults?.escalamiento || 'N/A'}
Requiere Seguimiento: ${ticketResults?.requiere_followup ? 'SÍ' : 'NO'}
                                    `;
                                    navigator.clipboard.writeText(ticketInfo.trim());
                                    toast.success('Información completa del ticket copiada', {
                                        icon: '📋',
                                        duration: 2000
                                    });
                                }}
                                className="
                                    px-6 py-3 rounded-lg font-medium text-base
                                    bg-purple-600 text-white border border-purple-500/30
                                    hover:bg-purple-700 transition-all duration-200
                                    flex items-center justify-center gap-2
                                "
                            >
                                <span className="text-lg">📋</span>
                                Copiar Info
                            </button>

                            <button
                                onClick={onClose}
                                className="
                                    px-6 py-3 rounded-lg font-medium text-base
                                    bg-green-600 text-white border border-green-500/30
                                    hover:bg-green-700 transition-all duration-200
                                    flex items-center justify-center gap-2
                                "
                            >
                                <span className="text-lg">✅</span>
                                Finalizar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketModal;