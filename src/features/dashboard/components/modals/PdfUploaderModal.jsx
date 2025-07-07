// src/features/dashboard/components/modals/PdfUploaderModal.jsx

import { useState, useCallback, useEffect } from 'react';
import { X, Upload, FileText, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const PdfUploaderModal = ({ isOpen, onClose }) => {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Efecto para mostrar el modal con transición suave
  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 50);
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
      setIsVisible(false);
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  }, []);

  const handleFileSelection = (file) => {
    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      toast.error('Error de archivo', {
        description: 'Solo se permiten archivos PDF',
        icon: '❌'
      });
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Archivo muy grande', {
        description: 'El archivo no puede superar los 10MB',
        icon: '⚠️'
      });
      return;
    }

    setSelectedFile(file);
    setUploadState('idle');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const uploadPdfToBackend = async () => {
    if (!selectedFile) {
      toast.error('No hay archivo seleccionado');
      return;
    }

    setUploadState('uploading');
    setUploadProgress(0);

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      // URL directa del backend
      const backendUrl = 'http://localhost:5000/api/process-pdf';

      // Simular progreso inicial
      setUploadProgress(20);

      // Enviar archivo al backend
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(60);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      setUploadProgress(80);
      const result = await response.json();

      if (result.success) {
        setUploadProgress(100);
        setUploadState('success');
        
        // Mensaje personalizado basado en los datos recibidos
        const description = result.data ? 
          `${result.data.pages} páginas procesadas, ${result.data.textLength} caracteres extraídos` :
          `${selectedFile.name} fue enviado a N8N para vectorización`;
        
        toast.success('PDF procesado exitosamente', {
          description,
          icon: '✅'
        });

        // Log detallado para debugging
        console.log('📄 PDF procesado exitosamente:', {
          filename: result.data?.filename,
          pages: result.data?.pages,
          textLength: result.data?.textLength,
          chunks: result.data?.chunks,
          fileUrl: result.fileUrl,
          hasN8nResponse: !!result.n8nResponse,
          warning: result.warning
        });

        // Si hay una advertencia de N8N, mostrarla
        if (result.warning) {
          console.warn('⚠️ Advertencia N8N:', result.warning);
          toast.warning('Procesado con advertencias', {
            description: 'PDF procesado pero hubo issues con N8N',
            icon: '⚠️'
          });
        }

      } else {
        throw new Error(result.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error subiendo PDF:', error);
      
      setUploadState('error');
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Error de conexión', {
          description: 'No se pudo conectar al servidor backend en puerto 5000',
          icon: '🔌'
        });
      } else if (error.message.includes('413')) {
        toast.error('Archivo muy grande', {
          description: 'El archivo supera el límite de 10MB',
          icon: '�'
        });
      } else {
        toast.error('Error al procesar PDF', {
          description: error.message || 'Hubo un problema procesando el archivo',
          icon: '❌'
        });
      }
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setDragActive(false);
  };

  const handleClose = () => {
    // Prevenir cierre durante upload
    if (uploadState === 'uploading') {
      toast.warning('Upload en progreso', {
        description: 'Espera a que termine la subida del archivo',
        icon: '⏳'
      });
      return;
    }

    // Primero animar la salida
    setIsVisible(false);
    // Luego cerrar después de la animación
    setTimeout(() => {
      resetModal();
      onClose();
    }, 300);
  };

  // Limpiar formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95
          rounded-2xl border border-white/20 shadow-2xl backrop-blur-sm
          transition-all duration-300 ease-out transform
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Subir Archivo PDF</h3>
              <p className="text-sm text-gray-400">Carga documentos PDF para procesamiento</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
              } ${uploadState === 'success' ? 'border-green-400 bg-green-500/10' :
                uploadState === 'error' ? 'border-red-400 bg-red-500/10' : ''
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadState === 'uploading'}
            />

            {/* Upload States */}
            {uploadState === 'idle' && !selectedFile && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Arrastra un archivo PDF aquí</p>
                  <p className="text-sm text-gray-400">o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-500 mt-2">Máximo 10MB</p>
                </div>
              </div>
            )}

            {selectedFile && uploadState === 'idle' && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-white font-medium">Procesando PDF...</p>
                  <p className="text-sm text-gray-400">Extrayendo texto y enviando a N8N</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {uploadProgress < 100 ? 'Subiendo...' : 'Procesando texto...'}
                  </p>
                </div>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">¡PDF procesado exitosamente!</p>
                  <p className="text-sm text-gray-400">El documento fue vectorizado y enviado a la base de datos</p>
                </div>
              </div>
            )}

            {uploadState === 'error' && (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Error al procesar PDF</p>
                  <p className="text-sm text-gray-400">Verifica la conexión al servidor</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {uploadState === 'idle' && selectedFile && (
              <button
                onClick={uploadPdfToBackend}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Procesar PDF
              </button>
            )}

            {uploadState === 'success' && (
              <button
                onClick={resetModal}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Procesar Otro PDF
              </button>
            )}

            {uploadState === 'error' && (
              <button
                onClick={() => setUploadState('idle')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Intentar de Nuevo
              </button>
            )}

            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              {uploadState === 'uploading' ? 'Cancelar' : 'Cerrar'}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400">
              <strong>Tip:</strong> Los PDFs son procesados automáticamente con PDF-parser, convertidos a formato vectorial en N8N y almacenados en la base de datos para búsquedas semánticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUploaderModal;
