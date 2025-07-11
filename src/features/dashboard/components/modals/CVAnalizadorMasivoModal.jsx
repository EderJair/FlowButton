/* eslint-disable no-unused-vars */
// src/features/dashboard/components/modals/CVAnalizadorMasivoModal.jsx

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

const CVAnalizadorMasivoModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedCandidates, setExpandedCandidates] = useState(new Set());

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            job_requirements: '',
            position_title: '',
            drive_folder_link: '',
            company_details: ''
        }
    });

    const job_requirements = watch('job_requirements');
    const position_title = watch('position_title');
    const drive_folder_link = watch('drive_folder_link');
    const company_details = watch('company_details');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Análisis Masivo de CVs con IA', {
                description: 'Analiza múltiples CVs automáticamente desde Google Drive',
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
            setResults(null);
            setExpandedCandidates(new Set());
        }
    }, [isOpen, reset]);

    const onFormSubmit = async (data) => {
        try {
            setIsLoading(true);
            setResults(null);
            
            console.log('🔍 Enviando solicitud de análisis masivo a N8N:', data);

            const response = await fetch('https://n8n-jose.up.railway.app/webhook/cv-masivo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                setResults(result);
                
                if (onSubmit) {
                    onSubmit(data, result);
                }

                toast.success('¡Análisis completado!', {
                    description: `Se procesaron ${result.total_cvs_processed} CVs exitosamente`,
                    icon: '✅',
                    duration: 3000
                });
            } else {
                throw new Error(result.message || 'Error inesperado en el flujo');
            }
        } catch (error) {
            console.error('Error al procesar con N8N:', error);
            
            toast.error('Error en el análisis masivo', {
                description: error.message || 'Ocurrió un error al conectar con N8N.',
                icon: '❌',
                duration: 6000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCandidate = (index) => {
        const newExpanded = new Set(expandedCandidates);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedCandidates(newExpanded);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getMatchBadgeColor = (level) => {
        switch (level.toLowerCase()) {
            case 'alto': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'medio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'bajo': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 text-xl">🔍</span>
                                </div>
                                <span className="text-gray-400 text-lg">+</span>
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-400 text-xl">🤖</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Análisis Masivo de CVs</h2>
                                <p className="text-base text-gray-400">IA para evaluar candidatos automáticamente</p>
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
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-3">
                            <span className="text-base font-medium text-blue-300">
                                📊 Análisis con IA desde Google Drive
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!results ? (
                        /* Form */
                        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Position Title */}
                                <div>
                                    <label htmlFor="position_title" className="block text-base font-medium text-gray-300 mb-3">
                                        Título del Puesto
                                    </label>
                                    <input
                                        id="position_title"
                                        {...register('position_title', {
                                            required: 'El título del puesto es requerido',
                                            minLength: {
                                                value: 5,
                                                message: 'El título debe tener al menos 5 caracteres'
                                            }
                                        })}
                                        placeholder="Ej: Desarrollador Frontend React"
                                        className="
                                            w-full px-4 py-3 rounded-lg text-base
                                            bg-white/10 border border-white/20 
                                            text-white placeholder-gray-400
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all duration-200
                                        "
                                    />
                                    {errors.position_title && (
                                        <p className="text-red-400 text-sm mt-2">
                                            ❌ {errors.position_title.message}
                                        </p>
                                    )}
                                </div>

                                {/* Company Details */}
                                <div>
                                    <label htmlFor="company_details" className="block text-base font-medium text-gray-300 mb-3">
                                        Información de la Empresa
                                    </label>
                                    <input
                                        id="company_details"
                                        {...register('company_details', {
                                            required: 'La información de la empresa es requerida',
                                            minLength: {
                                                value: 10,
                                                message: 'Debe tener al menos 10 caracteres'
                                            }
                                        })}
                                        placeholder="Ej: Startup tecnológica en crecimiento"
                                        className="
                                            w-full px-4 py-3 rounded-lg text-base
                                            bg-white/10 border border-white/20 
                                            text-white placeholder-gray-400
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all duration-200
                                        "
                                    />
                                    {errors.company_details && (
                                        <p className="text-red-400 text-sm mt-2">
                                            ❌ {errors.company_details.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Job Requirements */}
                            <div>
                                <label htmlFor="job_requirements" className="block text-base font-medium text-gray-300 mb-3">
                                    Requisitos del Puesto
                                </label>
                                <textarea
                                    id="job_requirements"
                                    {...register('job_requirements', {
                                        required: 'Los requisitos del puesto son requeridos',
                                        minLength: {
                                            value: 20,
                                            message: 'Los requisitos deben tener al menos 20 caracteres'
                                        }
                                    })}
                                    placeholder="Ej: Buscamos desarrollador Frontend con React, 2+ años experiencia, inglés intermedio, conocimientos en TypeScript, experiencia con APIs REST..."
                                    rows={4}
                                    className="
                                        w-full px-4 py-3 rounded-lg text-base
                                        bg-white/10 border border-white/20 
                                        text-white placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all duration-200 resize-none
                                    "
                                />
                                {errors.job_requirements && (
                                    <p className="text-red-400 text-sm mt-2">
                                        ❌ {errors.job_requirements.message}
                                    </p>
                                )}
                                <p className="text-sm text-gray-400 mt-2">
                                    {job_requirements?.length || 0}/500 caracteres
                                </p>
                            </div>

                            {/* Drive Folder Link */}
                            <div>
                                <label htmlFor="drive_folder_link" className="block text-base font-medium text-gray-300 mb-3">
                                    Link de Carpeta de Google Drive con CVs
                                </label>
                                <input
                                    id="drive_folder_link"
                                    {...register('drive_folder_link', {
                                        required: 'El link de Google Drive es requerido',
                                        pattern: {
                                            value: /^https:\/\/drive\.google\.com/,
                                            message: 'Debe ser un enlace válido de Google Drive'
                                        }
                                    })}
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    className="
                                        w-full px-4 py-3 rounded-lg text-base
                                        bg-white/10 border border-white/20 
                                        text-white placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all duration-200
                                    "
                                />
                                {errors.drive_folder_link && (
                                    <p className="text-red-400 text-sm mt-2">
                                        ❌ {errors.drive_folder_link.message}
                                    </p>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                                <h4 className="text-base font-medium text-blue-300 mb-3">💡 Instrucciones:</h4>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li>• <strong>Carpeta pública:</strong> Asegúrate de que la carpeta de Google Drive sea accesible públicamente</li>
                                    <li>• <strong>Formato CVs:</strong> Los CVs deben estar en formato PDF para mejor análisis</li>
                                    <li>• <strong>Requisitos detallados:</strong> Especifica habilidades técnicas, experiencia y competencias blandas</li>
                                    <li>• <strong>Tiempo de procesamiento:</strong> El análisis puede tomar varios minutos dependiendo del número de CVs</li>
                                </ul>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
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
                                            Analizando CVs...
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl">🔍</span>
                                            Analizar CVs
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Results */
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">📊 Resumen del Análisis</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>Total procesados:</span>
                                        <span className="font-bold text-white">{results.total_cvs_processed}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-400">{results.summary?.high_match || 0}</div>
                                        <div className="text-sm text-gray-400">Match Alto</div>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-yellow-400">{results.summary?.medium_match || 0}</div>
                                        <div className="text-sm text-gray-400">Match Medio</div>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-red-400">{results.summary?.low_match || 0}</div>
                                        <div className="text-sm text-gray-400">Match Bajo</div>
                                    </div>
                                </div>
                            </div>

                            {/* Candidates List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">👥 Candidatos Analizados</h3>
                                
                                {results.analyses?.map((candidate, index) => (
                                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                        {/* Candidate Header */}
                                        <div 
                                            className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                                            onClick={() => toggleCandidate(index)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchBadgeColor(candidate.nivel_de_ajuste)}`}>
                                                            {candidate.nivel_de_ajuste}
                                                        </div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                        <span className="text-sm text-gray-400">{candidate.nivel_experiencia}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${getScoreColor(candidate.puntuacion_general)}`}>
                                                            {candidate.puntuacion_general}/100
                                                        </div>
                                                        <div className="text-xs text-gray-400">Puntuación</div>
                                                    </div>
                                                    <div className="text-gray-400">
                                                        {expandedCandidates.has(index) ? '▼' : '▶'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3">
                                                <h4 className="text-lg font-bold text-white">{candidate.nombre_detectado}</h4>
                                                <p className="text-sm text-gray-400">{candidate.area_profesional}</p>
                                                <p className="text-sm text-gray-300 mt-1">{candidate.resumen_cv}</p>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedCandidates.has(index) && (
                                            <div className="border-t border-white/10 p-4 bg-black/20">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Scores Breakdown */}
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-300 mb-3">📊 Desglose de Puntuaciones</h5>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Técnico:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.punt_tecnico}/35</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Experiencial:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.punt_experiencial}/25</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Competencial:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.punt_competencial}/25</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Cultural:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.punt_cultural}/15</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Key Metrics */}
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-300 mb-3">🎯 Métricas Clave</h5>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Probabilidad de éxito:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.probabilidad_exito}%</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Tiempo adaptación:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.tiempo_adaptacion}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Riesgo rotación:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.riesgo_rotacion}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-gray-400">Potencial crecimiento:</span>
                                                                <span className="text-sm font-medium text-white">{candidate.potencial_crecimiento}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Fortalezas */}
                                                <div className="mt-6">
                                                    <h5 className="text-sm font-medium text-green-300 mb-2">✅ Fortalezas</h5>
                                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                                        <ul className="text-sm text-gray-300 space-y-1">
                                                            {JSON.parse(candidate.fortalezas).map((strength, idx) => (
                                                                <li key={idx}>• {strength}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Debilidades */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-red-300 mb-2">⚠️ Debilidades</h5>
                                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                                        <ul className="text-sm text-gray-300 space-y-1">
                                                            {JSON.parse(candidate.debilidades).map((weakness, idx) => (
                                                                <li key={idx}>• {weakness}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Preguntas de Entrevista */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-blue-300 mb-2">❓ Preguntas Sugeridas para Entrevista</h5>
                                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                                        <ul className="text-sm text-gray-300 space-y-1">
                                                            {JSON.parse(candidate.preguntas_entrevista).map((question, idx) => (
                                                                <li key={idx}>• {question}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Recomendación Final */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-purple-300 mb-2">🎯 Recomendación Final</h5>
                                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                                        <p className="text-sm text-gray-300">{candidate.recomendacion_final}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setResults(null)}
                                    className="
                                        flex-1 px-6 py-3 rounded-lg font-medium text-base
                                        bg-white/10 text-gray-300 border border-white/20
                                        hover:bg-white/20 transition-all duration-200
                                    "
                                >
                                    Nuevo Análisis
                                </button>
                                <button
                                    onClick={onClose}
                                    className="
                                        flex-1 px-6 py-3 rounded-lg font-medium text-base
                                        bg-gradient-to-r from-blue-600 to-purple-600
                                        text-white border border-blue-500/30
                                        hover:from-blue-700 hover:to-purple-700
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
        </div>
    );
};

export default CVAnalizadorMasivoModal;