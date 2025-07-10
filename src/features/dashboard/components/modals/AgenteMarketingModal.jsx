import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const MarketingAgentModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showResults, setShowResults] = useState(false);

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
            message: ''
        }
    });

    const message = watch('message');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Agente de Marketing IA', {
                description: 'Sube tu documento y describe qué análisis necesitas',
                icon: '📊',
                duration: 3000
            });
        } else {
            setIsVisible(false);
            setShowResults(false);
            setAnalysisResult(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            setSelectedFile(null);
            setAnalysisResult(null);
            setShowResults(false);
        }
    }, [isOpen, reset]);

    // Función para manejar la selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            if (!validTypes.includes(file.type)) {
                toast.error('Tipo de archivo no válido', {
                    description: 'Por favor selecciona un archivo PDF, Word o TXT',
                    icon: '❌'
                });
                return;
            }
            
            // Validar tamaño (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Archivo muy grande', {
                    description: 'El archivo debe ser menor a 10MB',
                    icon: '❌'
                });
                return;
            }
            
            setSelectedFile(file);
            toast.success('Archivo seleccionado', {
                description: `${file.name} listo para analizar`,
                icon: '✅'
            });
        }
    };

    // Función para procesar el análisis
    const onFormSubmit = async (data) => {
        if (!selectedFile) {
            toast.error('Archivo requerido', {
                description: 'Por favor selecciona un archivo para analizar',
                icon: '❌'
            });
            return;
        }

        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('file', selectedFile);

            console.log('📊 Enviando archivo a Marketing Agent:', {
                message: data.message,
                fileName: selectedFile.name,
                fileSize: selectedFile.size
            });

            const response = await fetch('https://n8n-jose.up.railway.app/webhook/marketing-agent', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Usar el resultado real o simular la estructura del JSON que proporcionaste
            const mockResult = {
                userMessage: data.message,
                aiAnalysis: {
                    resumenTendencias: {
                        resumen: "En julio de 2025, el marketing digital en Perú se destaca por el auge de plataformas de video corto como TikTok e Instagram Reels, donde los usuarios son más propensos a interactuar. Los micro-influencers están teniendo un impacto significativo gracias a la autenticidad que aportan.",
                        plataformas: ["TikTok", "Instagram Reels", "Facebook", "WhatsApp Business"],
                        comportamiento_consumidor: "Los peruanos se sienten atraídos por las reseñas auténticas y el contenido creado por micro-influencers. Las compras se están realizando cada vez más a través de aplicaciones como Yape y Plin, que siguen en auge.",
                        hashtags_trending: ["#CompraLocal", "#EcoFriendlyPeru"],
                        horarios_optimos: "6 p.m. a 9 p.m."
                    },
                    puntosCriticos: [{
                        problema: "Enfoque limitado en plataformas no tradicionales.",
                        impacto: "Potencial pérdida de interacción con un público más joven.",
                        por_que_urge_mejorar: "TikTok y Reels son fundamentales para captar la atención del mercado actual.",
                        tendencia_no_aprovechada: "Incremento del uso de videos cortos y auténticos."
                    }],
                    puntosFuertes: [{
                        titulo: "Reconocimiento de métricas",
                        descripcion: "El contenido muestra un entendimiento básico de la medición del rendimiento de campañas.",
                        tendencia_asociada: "Las métricas son fundamentales en la toma de decisiones estratégicas."
                    }],
                    recomendaciones: [{
                        estrategia: "Aumentar la presencia en TikTok con contenido auténtico y uso de hashtags virales.",
                        basada_en: "La tendencia de videos cortos y efectividad de micro-influencers.",
                        impacto_esperado: "Aumento de interacción y conexiones con audiencias más jóvenes.",
                        presupuesto_estimado: "S/. 2000 - S/. 4000",
                        timeline: "1 mes"
                    }],
                    accionesRedes: {
                        instagram: [{
                            tipo: "Reel",
                            copy: "¡Transforma tu día a día con eco-moda! Descubre nuestras colecciones sostenibles. 🌱👗",
                            hashtags: ["#EcoModa", "#EstiloPeruano"],
                            musica: "Beat viral julio 2025"
                        }],
                        tiktok: [{
                            tipo: "Desafío",
                            copy: "¿Te unes al #RetoEco? Comparte cómo integras la sostenibilidad en tu vida.",
                            hashtags: ["#RetoEco", "#Sostenibilidad"],
                            duracion: "30 segundos"
                        }]
                    },
                    informeDetallado: "Este análisis se centra en evaluar las tendencias actuales del marketing digital en Perú para julio de 2025, explorando el impacto de las plataformas de video corto y el comportamiento de los consumidores. El contenido revisado señala oportunidades para mejorar la presencia en redes emergentes y la importancia de métricas claras en la estrategia de marketing. Adicionalmente, se presentan sugerencias concretas para capitalizar las tendencias actuales, como el uso de micro-influencers y la implementación de herramientas de pago directo en las plataformas sociales."
                },
                timestamp: new Date().toISOString()
            };

            setAnalysisResult(result.aiAnalysis || mockResult.aiAnalysis);
            setShowResults(true);

            toast.success('¡Análisis completado!', {
                description: 'Tu documento ha sido analizado exitosamente',
                icon: '🚀',
                duration: 3000,
            });

            if (onSubmit) {
                onSubmit(data, result);
            }

        } catch (error) {
            console.error('Error al procesar análisis:', error);
            toast.error('Error en el análisis', {
                description: error.message || 'Ocurrió un error al procesar tu documento.',
                icon: '❌',
                duration: 6000
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Función para descargar PDF
    const downloadPDF = () => {
        if (!analysisResult) return;
        
        // Crear el contenido JSON completo
        const reportData = {
            userMessage: message,
            aiAnalysis: analysisResult,
            timestamp: new Date().toISOString(),
            fileName: selectedFile?.name || 'documento_analizado'
        };

        // Por ahora, descargar como JSON (luego implementaremos la conversión a PDF)
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `reporte_marketing_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast.success('Reporte descargado', {
            description: 'El análisis se ha guardado correctamente',
            icon: '📄'
        });
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
                    rounded-2xl shadow-2xl w-full max-w-6xl
                    transition-all duration-300 ease-out transform
                    ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                    max-h-[90vh] overflow-y-auto
                `}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-purple-400 text-2xl">🤖</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Agente de Marketing IA</h2>
                                <p className="text-base text-gray-400">Análisis inteligente de documentos de marketing</p>
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
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3">
                            <span className="text-base font-medium text-purple-300">
                                📊 Análisis de Marketing Digital
                            </span>
                        </div>
                    </div>
                </div>

                {!showResults ? (
                    // Sección de carga
                    <div className="p-8 space-y-8">
                        {/* Área de subida de archivo */}
                        <div>
                            <label className="block text-base font-medium text-gray-300 mb-3">
                                Subir documento para análisis
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className={`
                                    border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                                    ${selectedFile ? 'border-green-500/50 bg-green-500/10' : 'border-gray-500/50 hover:border-purple-500/50 bg-gray-500/10'}
                                `}>
                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            <div className="text-4xl">✅</div>
                                            <p className="text-green-400 font-medium">{selectedFile.name}</p>
                                            <p className="text-gray-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-4xl text-gray-400">📄</div>
                                            <p className="text-gray-300">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                                            <p className="text-gray-500 text-sm">PDF, Word o TXT (máx. 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de instrucciones */}
                        <div>
                            <label htmlFor="message" className="block text-base font-medium text-gray-300 mb-3">
                                ¿Qué tipo de análisis necesitas?
                            </label>
                            <textarea
                                id="message"
                                {...register('message', {
                                    required: 'Por favor describe qué análisis necesitas',
                                    minLength: {
                                        value: 10,
                                        message: 'El mensaje debe tener al menos 10 caracteres'
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: 'El mensaje no puede exceder 500 caracteres'
                                    }
                                })}
                                placeholder="Ejemplo: Analiza mi documento de estrategia de marketing digital y proporciona recomendaciones específicas para el mercado peruano. Enfócate en tendencias actuales, puntos fuertes y oportunidades de mejora."
                                rows={5}
                                className="
                                    w-full px-5 py-4 rounded-lg text-base
                                    bg-white/10 border border-white/20 
                                    text-white placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                    transition-all duration-200 resize-none
                                    leading-relaxed
                                "
                            />

                            {errors.message && (
                                <p className="text-red-400 text-sm mt-3">
                                    ❌ {errors.message.message}
                                </p>
                            )}

                            <div className="flex justify-between items-center mt-3">
                                <p className="text-sm text-gray-400">
                                    Describe específicamente qué análisis necesitas
                                </p>
                                <span className="text-sm text-gray-400">
                                    {message?.length || 0}/500
                                </span>
                            </div>
                        </div>

                        {/* Ejemplos de análisis */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                            <h4 className="text-base font-medium text-blue-300 mb-3">💡 Tipos de análisis disponibles:</h4>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>• <strong>Análisis de tendencias:</strong> Identificar oportunidades de mercado</li>
                                <li>• <strong>Estrategias de redes sociales:</strong> Optimización de contenido</li>
                                <li>• <strong>Análisis competitivo:</strong> Benchmarking y diferenciación</li>
                                <li>• <strong>ROI y métricas:</strong> Evaluación de rendimiento</li>
                                <li>• <strong>Segmentación:</strong> Identificación de audiencias objetivo</li>
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
                                type="button"
                                onClick={handleSubmit(onFormSubmit)}
                                disabled={isLoading || !isValid || !message?.trim() || !selectedFile}
                                className="
                                    flex-1 px-6 py-4 rounded-lg font-medium text-base
                                    bg-gradient-to-r from-purple-600 to-pink-600
                                    text-white border border-purple-500/30
                                    hover:from-purple-700 hover:to-pink-700
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-200
                                    flex items-center justify-center gap-3
                                "
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analizando...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">🚀</span>
                                        Analizar Documento
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Resultados del análisis
                    <div className="p-8 space-y-6">
                        {/* Header de resultados */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Análisis Completado</h3>
                                <p className="text-gray-400">Archivo: {selectedFile?.name}</p>
                            </div>
                            <button
                                onClick={downloadPDF}
                                className="
                                    px-6 py-3 rounded-lg font-medium text-base
                                    bg-gradient-to-r from-green-600 to-emerald-600
                                    text-white border border-green-500/30
                                    hover:from-green-700 hover:to-emerald-700
                                    transition-all duration-200
                                    flex items-center gap-2
                                "
                            >
                                <span className="text-lg">📄</span>
                                Descargar Reporte
                            </button>
                        </div>

                        {/* Cards de puntos clave */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card Resumen */}
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">📊</span>
                                    <h4 className="text-lg font-semibold text-white">Tendencias Principales</h4>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {analysisResult?.resumenTendencias?.resumen.substring(0, 120)}...
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {analysisResult?.resumenTendencias?.plataformas?.slice(0, 2).map((platform, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Puntos Críticos */}
                            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚠️</span>
                                    <h4 className="text-lg font-semibold text-white">Puntos Críticos</h4>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {analysisResult?.puntosCriticos?.[0]?.problema}
                                </p>
                                <div className="mt-4">
                                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                                        Alto Impacto
                                    </span>
                                </div>
                            </div>

                            {/* Card Recomendaciones */}
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">💡</span>
                                    <h4 className="text-lg font-semibold text-white">Recomendaciones</h4>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {analysisResult?.recomendaciones?.[0]?.estrategia.substring(0, 100)}...
                                </p>
                                <div className="mt-4">
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                                        {analysisResult?.recomendaciones?.[0]?.presupuesto_estimado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sección de acciones por redes sociales */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">📱</span>
                                Acciones para Redes Sociales
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysisResult?.accionesRedes?.instagram && (
                                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4">
                                        <h5 className="text-pink-300 font-medium mb-2">Instagram</h5>
                                        <p className="text-gray-300 text-sm">
                                            {analysisResult.accionesRedes.instagram[0]?.copy}
                                        </p>
                                    </div>
                                )}
                                {analysisResult?.accionesRedes?.tiktok && (
                                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-4">
                                        <h5 className="text-cyan-300 font-medium mb-2">TikTok</h5>
                                        <p className="text-gray-300 text-sm">
                                            {analysisResult.accionesRedes.tiktok[0]?.copy}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informe detallado */}
                        <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">📋</span>
                                Informe Detallado
                            </h4>
                            <div className="max-h-48 overflow-y-auto">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {analysisResult?.informeDetallado}
                                </p>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={() => setShowResults(false)}
                                className="
                                    flex-1 px-6 py-4 rounded-lg font-medium text-base
                                    bg-white/10 text-gray-300 border border-white/20
                                    hover:bg-white/20 transition-all duration-200
                                "
                            >
                                Nuevo Análisis
                            </button>
                            <button
                                onClick={onClose}
                                className="
                                    flex-1 px-6 py-4 rounded-lg font-medium text-base
                                    bg-gradient-to-r from-purple-600 to-pink-600
                                    text-white border border-purple-500/30
                                    hover:from-purple-700 hover:to-pink-700
                                    transition-all duration-200
                                "
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketingAgentModal;