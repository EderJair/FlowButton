import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { useCvAnalizadorFlow } from '@/hooks/useCvAnalizadorFlow';

const CVAnalizadorModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const fileInputRef = useRef(null);

    // Hook para gestionar el flujo N8N
    const {
        isLoading,
        error,
        success,
        analysisData,
        analyzeCVFile,
        clearStates
    } = useCvAnalizadorFlow();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        clearErrors
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            file: null
        }
    });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Analizador de CV con IA', {
                description: 'Sube un PDF y obtén un análisis técnico completo',
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
            setSelectedFile(null);
            setShowResults(false);
            setAnalysisResults(null);
        }
    }, [isOpen, reset, clearStates]);

    // Función para procesar el formulario
    const onFormSubmit = async (data) => {
        if (!selectedFile) {
            toast.error('Error', {
                description: 'Debes seleccionar un archivo PDF',
                icon: '❌',
                duration: 3000
            });
            return;
        }

        try {
            console.log('📄 Enviando CV a N8N para análisis:', selectedFile.name);

            const result = await analyzeCVFile(selectedFile);

            if (onSubmit) {
                onSubmit({ file: selectedFile }, result);
            }

            // Guardar resultados y mostrar la vista de resultados
            setAnalysisResults(result.raw);
            setShowResults(true);

            toast.success('¡CV analizado exitosamente!', {
                description: 'El análisis técnico ha sido completado',
                icon: '🚀',
                duration: 3000,
            });

        } catch (error) {
            console.error('Error al procesar CV con N8N:', error);

            toast.error('Error en el análisis', {
                description: error.message || 'Ocurrió un error al procesar el CV.',
                icon: '❌',
                duration: 6000
            });
        }
    };

    // Función para volver al formulario de subida
    const handleNewAnalysis = () => {
        setShowResults(false);
        setAnalysisResults(null);
        setSelectedFile(null);
        setValue('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        clearStates();
    };

    // Manejo de archivos
    const handleFileSelect = (file) => {
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setValue('file', file);
            clearErrors('file');
            toast.success('Archivo seleccionado', {
                description: `${file.name} listo para analizar`,
                icon: '📄',
                duration: 2000
            });
        } else {
            toast.error('Archivo no válido', {
                description: 'Solo se permiten archivos PDF',
                icon: '❌',
                duration: 3000
            });
        }
    };

    // Función para abrir el explorador de archivos
    const openFileExplorer = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setValue('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Función para obtener el color de la recomendación
    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'PROCEDER':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'NECESITA_VALIDACION':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'RECHAZAR':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    // Función para obtener el color del score
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
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
                    ${showResults ? 'max-w-6xl' : 'max-w-2xl'}
                `}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-400 text-xl">🤖</span>
                                </div>
                                <span className="text-gray-400 text-lg">+</span>
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-green-400 text-xl">📄</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {showResults ? 'Resultados del Análisis' : 'Analizador de CV con IA'}
                                </h2>
                                <p className="text-base text-gray-400">
                                    {showResults ? 'Evaluación técnica completada' : 'Análisis técnico automatizado'}
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
                            <div className="bg-gradient-to-r from-purple-500/20 to-green-500/20 border border-purple-500/30 rounded-full px-6 py-3">
                                <span className="text-base font-medium text-purple-300">
                                    🎯 Evaluación Técnica Inteligente
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Información del candidato */
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-6 py-4">
                                <h3 className="text-2xl font-bold text-white mb-2">
    👤 Evaluando: {analysisResults?.perfil_candidato?.nombre_completo || selectedFile?.name?.replace('.pdf', '') || 'Candidato sin nombre'}
</h3>
                                <div className="flex items-center justify-center gap-6 text-sm">
                                    <span className="text-blue-300">
                                        💼 {analysisResults?.evaluacion_cv?.area_optima_identificada || 'Área no definida'}
                                    </span>
                                    <span className="text-purple-300">
                                        ⭐ {analysisResults?.evaluacion_cv?.categoria_fit || 'Fit no definido'}
                                    </span>
                                    <span className="text-green-300">
                                        📅 {analysisResults?.perfil_candidato?.años_experiencia_relevante || 0} años exp.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contenido principal */}
                {!showResults ? (
                    /* Formulario de subida */
                    <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-8">
                        
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-base font-medium text-gray-300 mb-3">
                                Sube el CV en formato PDF
                            </label>
                            
                            <div
                                className={`
                                    relative border-2 border-dashed rounded-lg p-8 text-center
                                    transition-all duration-200 cursor-pointer
                                    ${dragActive 
                                        ? 'border-purple-500 bg-purple-500/10' 
                                        : 'border-gray-600 hover:border-gray-500'
                                    }
                                    ${selectedFile ? 'bg-green-500/10 border-green-500' : 'bg-gray-800/50'}
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={openFileExplorer}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleInputChange}
                                    className="hidden"
                                />

                                {selectedFile ? (
                                    <div className="space-y-4">
                                        <div className="text-green-400 text-4xl">📄</div>
                                        <div>
                                            <p className="text-white font-medium">{selectedFile.name}</p>
                                            <p className="text-gray-400 text-sm">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm underline"
                                        >
                                            Remover archivo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-gray-400 text-4xl">📁</div>
                                        <div>
                                            <p className="text-white font-medium">
                                                Arrastra y suelta tu CV aquí
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                o haz clic para seleccionar
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Solo archivos PDF • Máximo 10MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!selectedFile && (
                                <p className="text-red-400 text-sm mt-3">
                                    ❌ Debes seleccionar un archivo PDF
                                </p>
                            )}

                            {error && (
                                <p className="text-red-400 text-sm mt-3">
                                    ❌ {error}
                                </p>
                            )}
                        </div>

                        {/* Información del proceso */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                            <h4 className="text-base font-medium text-blue-300 mb-3">🔍 Que incluye el análisis:</h4>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li>• <strong>Evaluación técnica:</strong> Competencias y nivel de experiencia</li>
                                <li>• <strong>Puntuación objetiva:</strong> Calificación del 1 al 100</li>
                                <li>• <strong>Recomendaciones:</strong> Pruebas técnicas sugeridas</li>
                                <li>• <strong>Análisis salarial:</strong> Rango estimado para el mercado peruano</li>
                                <li>• <strong>Red flags:</strong> Puntos importantes a validar</li>
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
                                disabled={isLoading || !selectedFile}
                                className="
                                    flex-1 px-6 py-4 rounded-lg font-medium text-base
                                    bg-gradient-to-r from-purple-600 to-green-600
                                    text-white border border-purple-500/30
                                    hover:from-purple-700 hover:to-green-700
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-200
                                    flex items-center justify-center gap-3
                                "
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analizando CV...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">🎯</span>
                                        Analizar CV
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Vista de resultados */
                    <div className="p-8 space-y-6">
                        {/* Resumen ejecutivo */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${getScoreColor(analysisResults?.evaluacion_cv?.puntuacion_idoneidad || 0)}`}>
                                        {analysisResults?.evaluacion_cv?.puntuacion_idoneidad || 0}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">Puntuación</div>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-center">
                                    <div className="text-lg font-medium text-white">
                                        {analysisResults?.evaluacion_cv?.nivel_tecnico || 'No definido'}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">Nivel Técnico</div>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-center">
                                    <div className="text-lg font-medium text-white">
                                        S/ {analysisResults?.estimacion_salarial?.rango_estimado?.minimo || 0} - {analysisResults?.estimacion_salarial?.rango_estimado?.maximo || 0}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">Rango Salarial</div>
                                </div>
                            </div>
                            
                            <div className={`rounded-lg p-4 border ${getRecommendationColor(analysisResults?.insights_estrategicos?.decision_recomendada)}`}>
                                <div className="text-center">
                                    <div className="text-lg font-medium">
                                        {analysisResults?.insights_estrategicos?.decision_recomendada || 'NO_DEFINIDO'}
                                    </div>
                                    <div className="text-sm opacity-75 mt-1">Recomendación</div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido en columnas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Columna izquierda */}
                            <div className="space-y-6">
                                {/* Perfil del candidato */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        👤 Perfil del Candidato
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <p className="text-gray-300 leading-relaxed">
                                            {analysisResults?.perfil_candidato?.resumen_ejecutivo || 'No disponible'}
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 mt-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Experiencia:</span>
                                                <span className="text-white">
                                                    {analysisResults?.perfil_candidato?.años_experiencia_relevante || 0} años
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Sectores:</span>
                                                <span className="text-white">
                                                    {analysisResults?.perfil_candidato?.sector_experiencia?.join(', ') || 'No definido'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Tamaño empresa:</span>
                                                <span className="text-white">
                                                    {analysisResults?.perfil_candidato?.size_companies || 'No definido'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Puntos diferenciadores */}
                                        {analysisResults?.perfil_candidato?.puntos_diferenciadores?.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-blue-300 font-medium mb-2">🌟 Puntos diferenciadores:</h4>
                                                <ul className="space-y-1">
                                                    {analysisResults.perfil_candidato.puntos_diferenciadores.map((punto, index) => (
                                                        <li key={index} className="text-gray-300 text-xs">• {punto}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Fortalezas */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        💪 Fortalezas Validadas
                                    </h3>
                                    <div className="space-y-3">
                                        {analysisResults?.analisis_competencias?.fortalezas_validadas?.map((strength, index) => (
                                            <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-green-400">{strength.competencia}</span>
                                                    <div className="flex gap-2">
                                                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                                            {strength.nivel_evidenciado}
                                                        </span>
                                                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                                            {strength.confidence_level}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-300">{strength.evidencia_cv}</p>
                                            </div>
                                        )) || <p className="text-gray-400">No se encontraron fortalezas validadas</p>}
                                    </div>
                                </div>

                                {/* Brechas identificadas */}
                                {analysisResults?.analisis_competencias?.brechas_identificadas?.length > 0 && (
                                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            📋 Brechas Identificadas
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResults.analisis_competencias.brechas_identificadas.map((brecha, index) => (
                                                <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-orange-400">{brecha.competencia_faltante}</span>
                                                        <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                                                            {brecha.importancia_puesto}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-300">{brecha.impacto_seleccion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Información salarial */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        💰 Análisis Salarial
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400 mb-1">
                                                    S/ {analysisResults?.estimacion_salarial?.rango_estimado?.minimo || 0} - {analysisResults?.estimacion_salarial?.rango_estimado?.maximo || 0}
                                                </div>
                                                <div className="text-green-300 text-xs">Rango estimado mensual</div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Negociabilidad:</span>
                                                <span className="text-white">{analysisResults?.estimacion_salarial?.negociabilidad || 'No definido'}</span>
                                            </div>
                                        </div>

                                        {/* Factores salariales */}
                                        {analysisResults?.estimacion_salarial?.factores_salario?.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="text-green-300 font-medium mb-2">💡 Factores que influyen:</h4>
                                                <ul className="space-y-1">
                                                    {analysisResults.estimacion_salarial.factores_salario.map((factor, index) => (
                                                        <li key={index} className="text-gray-300 text-xs">• {factor}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Benchmark */}
                                        {analysisResults?.estimacion_salarial?.benchmark_nivel && (
                                            <div className="mt-3">
                                                <h4 className="text-green-300 font-medium mb-2">📊 Benchmark del mercado:</h4>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(analysisResults.estimacion_salarial.benchmark_nivel).map(([nivel, rango]) => (
                                                        <div key={nivel} className="flex justify-between">
                                                            <span className="text-gray-400 capitalize">{nivel}:</span>
                                                            <span className="text-white">{rango}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                
                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-6">
                                {/* Competencias a validar */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        🔍 Competencias a Validar
                                    </h3>
                                    <div className="space-y-3">
                                        {analysisResults?.analisis_competencias?.competencias_a_validar?.map((skill, index) => (
                                            <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-yellow-400">{skill.competencia}</span>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        skill.criticidad === 'Alta' ? 'bg-red-500/20 text-red-300' :
                                                        skill.criticidad === 'Media' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                        {skill.criticidad}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-300 mb-2">{skill.evidencia_cv}</p>
                                                <p className="text-xs text-gray-400">{skill.razon_validacion}</p>
                                            </div>
                                        )) || <p className="text-gray-400">No se encontraron competencias a validar</p>}
                                    </div>
                                </div>

                                {/* Pruebas recomendadas */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        📝 Pruebas Técnicas Recomendadas
                                    </h3>
                                    <div className="space-y-3">
                                        {analysisResults?.recomendaciones_pruebas?.validaciones_criticas?.map((test, index) => (
                                            <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-blue-400">{test.competencia}</span>
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                                        {test.tiempo_sugerido}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-300 mb-2">{test.sugerencia_prueba}</p>
                                                <p className="text-xs text-gray-400">{test.justificacion}</p>
                                            </div>
                                        )) || <p className="text-gray-400">No se encontraron pruebas recomendadas</p>}
                                    </div>
                                </div>

                                {/* Mensaje del asistente IA */}
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        🤖 Recomendación del Asistente IA
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <p className="text-purple-300 font-medium">
                                            {analysisResults?.ia_assistant_summary?.mensaje_reclutador}
                                        </p>
                                        <div className="bg-purple-500/20 rounded-lg p-3">
                                            <p className="text-purple-200 font-medium mb-2">Acción Inmediata:</p>
                                            <p className="text-purple-100 text-sm">
                                                {analysisResults?.ia_assistant_summary?.accion_inmediata}
                                            </p>
                                        </div>
                                        {analysisResults?.ia_assistant_summary?.questions_to_ask?.length > 0 && (
                                            <div>
                                                <p className="text-purple-200 font-medium mb-2">Preguntas sugeridas para la entrevista:</p>
                                                <ul className="space-y-1">
                                                    {analysisResults.ia_assistant_summary.questions_to_ask.map((question, index) => (
                                                        <li key={index} className="text-purple-100 text-sm">
                                                            • {question}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Red Flags */}
                                {analysisResults?.alertas_reclutador?.red_flags?.length > 0 && (
                                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            🚨 Alertas del Reclutador
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResults.alertas_reclutador.red_flags.map((flag, index) => (
                                                <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                                    <p className="text-sm text-red-300">{flag}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Puntos a aclarar */}
                                        {analysisResults?.alertas_reclutador?.puntos_aclarar?.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-yellow-300 font-medium mb-2">❓ Puntos a aclarar:</h4>
                                                <ul className="space-y-1">
                                                    {analysisResults.alertas_reclutador.puntos_aclarar.map((punto, index) => (
                                                        <li key={index} className="text-yellow-200 text-sm">• {punto}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Verificaciones sugeridas */}
                                        {analysisResults?.alertas_reclutador?.verificaciones_sugeridas?.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-blue-300 font-medium mb-2">✅ Verificaciones sugeridas:</h4>
                                                <ul className="space-y-1">
                                                    {analysisResults.alertas_reclutador.verificaciones_sugeridas.map((verificacion, index) => (
                                                        <li key={index} className="text-blue-200 text-sm">• {verificacion}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-6 border-t border-white/10">
                            <button
                                onClick={handleNewAnalysis}
                                className="
                                    flex-1 px-6 py-3 rounded-lg font-medium text-base
                                    bg-white/10 text-gray-300 border border-white/20
                                    hover:bg-white/20 transition-all duration-200
                                    flex items-center justify-center gap-2
                                "
                            >
                                <span className="text-lg">📄</span>
                                Analizar Nuevo CV
                            </button>

                            <button
                                onClick={() => {
                                    // Copiar al portapapeles o descargar
                                    navigator.clipboard.writeText(JSON.stringify(analysisResults, null, 2));
                                    toast.success('Análisis copiado al portapapeles', {
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
                                Copiar Resultados
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

export default CVAnalizadorModal;