// src/features/dashboard/components/modals/InvoiceAnalysisModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DocumentCheckIcon, OpenAI } from '../../../../assets/icons';
import { useInvoiceAnalysis } from '../../../../hooks/useInvoiceAnalysis';

const InvoiceAnalysisModal = ({ isOpen, onClose, onSubmit }) => {  const [formData, setFormData] = useState({
    file: null
  });const [isVisible, setIsVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  // Hook para análisis de facturas
  const {
    isLoading,
    error,
    success,
    analysisResult,
    progress,
    analyzeInvoice,
    analyzeInvoiceLocal,
    clearStates
  } = useInvoiceAnalysis();

  // Tipos de archivo aceptados
  const acceptedTypes = {
    'image/png': '.png',
    'image/jpeg': '.jpg, .jpeg',
    'image/jpg': '.jpg',
    'application/pdf': '.pdf'
  };  // Efecto para mostrar el modal y mantener scroll habilitado
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);// Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ file: null });
      setPreview(null);
      clearStates(); // Limpiar estados del hook
    }
  }, [isOpen, clearStates]);

  // Validar tipo de archivo
  const validateFile = (file) => {
    if (!file) return { valid: false, error: 'No se seleccionó archivo' };
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo debe ser menor a 10MB' };
    }

    if (!Object.keys(acceptedTypes).includes(file.type)) {
      return { valid: false, error: 'Formato no válido. Use PNG, JPG o PDF' };
    }

    return { valid: true };
  };

  // Generar preview del archivo
  const generatePreview = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview({ type: 'image', url: e.target.result });
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview({ type: 'pdf', name: file.name });
    }
  };
  // Manejar selección de archivo
  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      toast.error('Archivo inválido', {
        description: validation.error,
        icon: '❌'
      });
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    generatePreview(file);
    
    // Eliminar toast de "archivo cargado" - es redundante con el preview visual
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }  }, []);
    // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast.warning('Archivo requerido', {
        description: 'Por favor selecciona una factura para analizar',
        icon: '📄'
      });
      return;
    }

    try {
      const analysisData = {
        file: formData.file,
        timestamp: new Date().toISOString()
      };

      // Usar el análisis completo (Cloudinary + OCR + Backend)
      const result = await analyzeInvoice(analysisData);

      if (onSubmit) {
        onSubmit(analysisData, result);
      }      toast.success('¡Factura procesada exitosamente!', {
        description: 'Los datos han sido enviados al backend',
        icon: '🎉',
        duration: 4000
      });

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error al analizar factura:', error);
      toast.error('Error al procesar factura', {
        description: error.message || 'No se pudo procesar la factura. Inténtalo nuevamente.',
        icon: '❌'
      });
    }
  };

  // Función para demostrar solo OCR local (opcional)
  const handleLocalOCR = async () => {
    if (!formData.file) {
      toast.warning('Archivo requerido', {
        description: 'Por favor selecciona una factura para analizar',
        icon: '📄'
      });
      return;
    }    try {
      const result = await analyzeInvoiceLocal(formData.file);
      
      toast.success('Texto extraído', {
        description: 'OCR completado exitosamente',
        icon: '🔍',
        duration: 3000
      });
      
    } catch (error) {
      console.error('Error en OCR local:', error);
      toast.error('Error en extracción de texto', {
        description: error.message,
        icon: '❌'
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;  return (
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
          rounded-2xl shadow-2xl w-full max-w-2xl
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <DocumentCheckIcon className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400">+</span>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <OpenAI className="w-5 h-5 text-green-400" />
                </div>
              </div>              <div>
                <h2 className="text-xl font-bold text-white">Lector de Facturas con IA</h2>
                <p className="text-sm text-gray-400">Extrae información de facturas automáticamente</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          
          {/* Badge */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2">              <span className="text-sm font-medium text-purple-300">
                🤖 Extracción Inteligente de Datos
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Área de carga de archivos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Subir Factura
            </label>
            
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center
                transition-all duration-200
                ${isDragOver 
                  ? 'border-purple-400 bg-purple-500/10' 
                  : 'border-white/20 bg-white/5'
                }
                ${formData.file ? 'border-green-400 bg-green-500/10' : ''}
                hover:border-purple-400 hover:bg-purple-500/5
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {!formData.file ? (
                <div>
                  <DocumentCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    Arrastra tu factura aquí o haz click para seleccionar
                  </p>
                  <p className="text-gray-400 text-sm">
                    Formatos: PNG, JPG, JPEG, PDF (máx. 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {preview?.type === 'image' && (
                    <img 
                      src={preview.url} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded-lg border border-white/20"
                    />
                  )}
                  {preview?.type === 'pdf' && (
                    <div className="flex items-center justify-center gap-2">
                      <DocumentCheckIcon className="w-8 h-8 text-red-400" />
                      <span className="text-white">{preview.name}</span>
                    </div>
                  )}
                  <p className="text-green-400 font-medium">
                    ✅ {formData.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, file: null }));
                      setPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm underline"
                  >
                    Cambiar archivo
                  </button>
                </div>
              )}            </div>          </div>

          {/* Barra de progreso */}
          {isLoading && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {progress.message}
                  </span>
                  <span className="text-sm text-gray-400">
                    {progress.progress}%
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                
                {/* Indicadores de pasos */}
                <div className="flex justify-between mt-3 text-xs">
                  <div className={`flex items-center gap-1 ${
                    progress.step === 'upload' || progress.step === 'ocr' || progress.step === 'backend' || progress.step === 'complete'
                      ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {(progress.step === 'upload' || progress.step === 'ocr' || progress.step === 'backend' || progress.step === 'complete') ? '✅' : '⏳'}
                    <span>Subir imagen</span>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    progress.step === 'ocr' || progress.step === 'backend' || progress.step === 'complete'
                      ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {(progress.step === 'ocr' || progress.step === 'backend' || progress.step === 'complete') ? '✅' : '⏳'}
                    <span>Extraer texto</span>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    progress.step === 'backend' || progress.step === 'complete'
                      ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {(progress.step === 'backend' || progress.step === 'complete') ? '✅' : '⏳'}
                    <span>Procesar IA</span>
                  </div>
                </div>
              </div>
            </div>
          )}          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-white/10 text-gray-300 border border-white/20
                hover:bg-white/20 transition-all duration-200
              "
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            {/* Botón para OCR local (demo) - Solo visible si no está cargando */}
            {!isLoading && formData.file && (
              <button
                type="button"
                onClick={handleLocalOCR}
                className="
                  px-4 py-3 rounded-lg font-medium
                  bg-gradient-to-r from-orange-600 to-red-600
                  text-white border border-orange-500/30
                  hover:from-orange-700 hover:to-red-700
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                <span className="text-sm">🔍</span>
                Solo OCR
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !formData.file}
              className="
                flex-1 px-4 py-3 rounded-lg font-medium
                bg-gradient-to-r from-purple-600 to-blue-600
                text-white border border-purple-500/30
                hover:from-purple-700 hover:to-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {progress.step === 'upload' && 'Subiendo...'}
                  {progress.step === 'ocr' && 'Extrayendo...'}
                  {progress.step === 'backend' && 'Procesando...'}
                  {!progress.step && 'Procesando...'}
                </>
              ) : (
                <>
                  <OpenAI className="w-4 h-4" />
                  Leer Factura
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceAnalysisModal;
