// ==========================================
// AgenteConsultorContratoModal.jsx - CORREGIDO
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { useLegalConsultorContratoFlow } from '@/hooks/useLegalConsultorContratoFlow';

const AgenteConsultorContratoModal = ({ isOpen, onClose, onSubmit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [contractName, setContractName] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [mode, setMode] = useState('upload'); // 'upload' o 'chat'
    const [uploadedContractInfo, setUploadedContractInfo] = useState(null);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    // Hook
    const {
        isLoading,
        error,
        success,
        contractData,
        chatHistory,
        currentUserId,
        repositoryMode,
        availableContracts,
        uploadContractOnly,
        uploadContractWithQuery,
        sendRepositoryQuery,
        executeCommand,
        activateRepositoryMode,
        clearStates,
        resetSession
    } = useLegalConsultorContratoFlow();

    const { register, handleSubmit, formState: { errors }, reset, setValue, clearErrors } = useForm({
        mode: 'onChange',
        defaultValues: { file: null }
    });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            toast.info('Sistema Legal Automatizado', {
                description: 'Sube contratos y consulta el repositorio central',
                icon: '⚖️',
                duration: 3000
            });
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            resetSession();
            setSelectedFile(null);
            setContractName('');
            setCurrentMessage('');
            setMode('upload');
            setUploadedContractInfo(null);
        }
    }, [isOpen, reset, resetSession]);

    useEffect(() => {
        if (chatEndRef.current && mode === 'chat') {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, mode]);

    // Upload contract only (RAMA 2: upload_only)
    const handleUploadOnly = async () => {
        if (!selectedFile) {
            toast.error('Selecciona un contrato PDF');
            return;
        }

        try {
            console.log('📄 Subiendo contrato solo (upload_only)');
            
            const result = await uploadContractOnly(selectedFile, contractName);
            
            setUploadedContractInfo({
                name: contractName || selectedFile.name,
                contractId: result.formatted?.contractId,
                timestamp: new Date().toISOString()
            });
            
            toast.success('¡Contrato guardado!', {
                description: `${contractName || selectedFile.name} almacenado en el repositorio`,
                icon: '💾',
                duration: 3000,
            });

            // Cambiar a modo chat para consultas (consult_only)
            setMode('chat');
            
            // Limpiar formulario
            setSelectedFile(null);
            setContractName('');
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error('Error al subir contrato:', error);
            toast.error('Error al guardar contrato', {
                description: error.message,
                icon: '❌',
                duration: 4000
            });
        }
    };

    // Upload + query (RAMA 1: upload_and_consult)
    const handleUploadAndQuery = async () => {
        if (!selectedFile) {
            toast.error('Selecciona un contrato PDF');
            return;
        }

        if (!currentMessage.trim()) {
            toast.error('Escribe tu consulta');
            return;
        }

        try {
            console.log('📄💬 Subiendo contrato con consulta (upload_and_consult)');
            
            const result = await uploadContractWithQuery(
                selectedFile, 
                currentMessage, 
                contractName
            );
            
            setUploadedContractInfo({
                name: contractName || selectedFile.name,
                contractId: result.formatted?.contractId,
                timestamp: new Date().toISOString()
            });
            
            toast.success('¡Contrato guardado y analizado!', {
                description: 'Tu consulta ha sido procesada',
                icon: '🎯',
                duration: 3000,
            });

            // Cambiar a modo chat
            setMode('chat');
            setCurrentMessage('');
            
            // Limpiar formulario
            setSelectedFile(null);
            setContractName('');
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error('Error al subir contrato con consulta:', error);
            toast.error('Error al procesar', {
                description: error.message,
                icon: '❌',
                duration: 4000
            });
        }
    };

    // Chat query only (RAMA 3: consult_only)
    const handleChatQuery = async () => {
        if (!currentMessage.trim()) {
            toast.error('Escribe tu consulta');
            return;
        }

        try {
            console.log('💬 Enviando consulta (consult_only)');
            await sendRepositoryQuery(currentMessage);
            setCurrentMessage('');
        } catch (error) {
            console.error('Error en consulta:', error);
            toast.error('Error en consulta', {
                description: error.message,
                icon: '❌',
                duration: 4000
            });
        }
    };

    // Switch to chat mode
    const switchToChatMode = async () => {
        setMode('chat');
        if (!repositoryMode) {
            await activateRepositoryMode();
        }
    };

    // Switch to upload mode
    const switchToUploadMode = () => {
        setMode('upload');
        setUploadedContractInfo(null);
        setCurrentMessage('');
    };

    // File handling
    const handleFileSelect = (file) => {
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setValue('file', file);
            clearErrors('file');
            setContractName(file.name.replace('.pdf', ''));
            
            toast.success('Contrato seleccionado', {
                description: `${file.name} listo para procesar`,
                icon: '📄',
                duration: 2000
            });
        } else {
            toast.error('Solo se permiten archivos PDF');
        }
    };

    const openFileExplorer = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

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

    const removeFile = () => {
        setSelectedFile(null);
        setContractName('');
        setValue('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center
                transition-all duration-300 ease-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
                bg-black/50 backdrop-blur-sm p-2 sm:p-4
            `}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`
                    relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 
                    backdrop-blur-md border border-white/20 
                    rounded-xl sm:rounded-2xl shadow-2xl w-full
                    transition-all duration-300 ease-out transform
                    ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                    max-h-[95vh] overflow-hidden
                    ${mode === 'chat' ? 'max-w-4xl' : 'max-w-2xl'}
                `}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-400 text-lg sm:text-xl">⚖️</span>
                                </div>
                                <span className="text-gray-400 text-sm sm:text-lg">+</span>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-green-400 text-lg sm:text-xl">🏛️</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-white">
                                    {mode === 'chat' ? 'Consultor Legal IA' : 'Sistema Legal'}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    {mode === 'chat' ? 'Repositorio central de contratos' : 'Subir contratos al repositorio'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                        >
                            <span className="text-lg">✕</span>
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={switchToUploadMode}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                                mode === 'upload' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            📄 Subir Contrato
                        </button>
                        <button
                            onClick={switchToChatMode}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                                mode === 'chat' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            💬 Consultar Repositorio
                        </button>
                    </div>

                    {/* Status Info */}
                    <div className="mt-3 text-center">
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
                                {mode === 'chat' ? (
                                    <>
                                        {uploadedContractInfo && (
                                            <span className="text-green-300">
                                                📄 {uploadedContractInfo.name}
                                            </span>
                                        )}
                                        <span className="text-blue-300">
                                            🏛️ {availableContracts.length || 0} contratos
                                        </span>
                                        <span className="text-purple-300">
                                            💬 {chatHistory.length} consultas
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-blue-300">
                                        📄 Sube contratos al repositorio central
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {/* Upload Mode */}
                    {mode === 'upload' && (
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
                            {/* Contract Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre del contrato
                                </label>
                                <input
                                    type="text"
                                    value={contractName}
                                    onChange={(e) => setContractName(e.target.value)}
                                    placeholder="Ej: Contrato de Servicios ABC"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 text-sm"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Archivo PDF del contrato
                                </label>
                                
                                <div
                                    className={`
                                        relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center
                                        transition-all duration-200 cursor-pointer
                                        ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
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
                                        <div className="space-y-2">
                                            <div className="text-green-400 text-2xl sm:text-3xl">📄</div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{selectedFile.name}</p>
                                                <p className="text-gray-400 text-xs">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile();
                                                }}
                                                className="text-red-400 hover:text-red-300 text-xs underline"
                                            >
                                                Remover archivo
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-2xl sm:text-3xl">📁</div>
                                            <div>
                                                <p className="text-white font-medium text-sm">
                                                    Arrastra tu contrato aquí
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                    o haz clic para seleccionar
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Solo archivos PDF • Máximo 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Optional Query */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Consulta inmediata (opcional)
                                </label>
                                <textarea
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Ej: ¿Cuáles son las condiciones de pago de este contrato?"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 resize-none text-sm"
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Si escribes una consulta, se procesará inmediatamente después de guardar
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleUploadOnly}
                                    disabled={isLoading || !selectedFile}
                                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm bg-blue-600 text-white border border-blue-500/30 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <span>💾</span>
                                            Solo Guardar
                                        </>
                                    )}
                                </button>

                                {currentMessage.trim() && (
                                    <button
                                        onClick={handleUploadAndQuery}
                                        disabled={isLoading || !selectedFile || !currentMessage.trim()}
                                        className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm bg-green-600 text-white border border-green-500/30 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <span>🎯</span>
                                                Guardar + Consultar
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Info */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                                <h4 className="text-sm font-medium text-blue-300 mb-2">📚 Repositorio Central:</h4>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    <li>• Almacenamiento permanente de contratos</li>
                                    <li>• Consultas comparativas entre múltiples contratos</li>
                                    <li>• Análisis automático de cláusulas y riesgos</li>
                                    <li>• Comandos administrativos (/list, /search, /delete)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Chat Mode */}
                    {mode === 'chat' && (
                        <div className="flex flex-col h-[60vh] sm:h-[500px]">
                            {/* Chat Area */}
                            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
                                {/* Welcome Message */}
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-purple-400 text-xs">⚖️</span>
                                        </div>
                                        <div>
                                            <p className="text-purple-300 font-medium mb-1 text-sm">Consultor Legal IA</p>
                                            <p className="text-purple-200 text-xs">
                                                {uploadedContractInfo ? (
                                                    <>
                                                        ¡He procesado tu contrato "<strong>{uploadedContractInfo.name}</strong>"! 
                                                        Ahora puedes consultarme sobre este contrato o cualquier otro del repositorio.
                                                    </>
                                                ) : (
                                                    <>
                                                        Acceso al repositorio central de contratos. 
                                                        Consulta sobre cualquier contrato, compara cláusulas o usa comandos administrativos.
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat History */}
                                {chatHistory.map((chat) => (
                                    <div key={chat.id} className="space-y-2">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 max-w-[85%]">
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-green-300 font-medium text-xs mb-1">
                                                            {chat.type === 'command_execution' ? 'Comando' : 
                                                             chat.type === 'upload_and_consult' ? 'Consulta inicial' : 'Consulta'}
                                                        </p>
                                                        <p className="text-green-100 text-xs">{chat.user_message}</p>
                                                        {chat.contract_uploaded && (
                                                            <p className="text-green-200 text-xs mt-1 italic">
                                                                📄 Contrato: {chat.contract_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-green-400 text-xs">
                                                            {chat.type === 'command_execution' ? '⚡' : 
                                                             chat.type === 'upload_and_consult' ? '🎯' : '👤'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Response */}
                                        <div className="flex justify-start">
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 max-w-[90%]">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-purple-400 text-xs">⚖️</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-purple-300 font-medium text-xs mb-1">Consultor Legal IA</p>
                                                        <div className="text-purple-100 text-xs whitespace-pre-line">
                                                            {chat.ai_response}
                                                        </div>
                                                        <p className="text-purple-400/60 text-xs mt-1">
                                                            {new Date(chat.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading */}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                    <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                                                </div>
                                                <p className="text-purple-200 text-xs">Analizando...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 sm:p-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <textarea
                                            value={currentMessage}
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleChatQuery();
                                                }
                                            }}
                                            placeholder="Consulta legal o comando (/list, /search, /delete)..."
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none text-xs"
                                            rows={2}
                                            disabled={isLoading}
                                        />
                                        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                                            <span>Enter para enviar • /list /search /delete</span>
                                            <span>{chatHistory.length} mensajes</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleChatQuery}
                                        disabled={isLoading || !currentMessage.trim()}
                                        className="px-3 py-2 rounded-lg font-medium bg-purple-600 text-white border border-purple-500/30 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1 self-start"
                                    >
                                        {isLoading ? (
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="text-xs">💬</span>
                                                <span className="text-xs hidden sm:inline">Enviar</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Quick Commands */}
                                {chatHistory.length === 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-400 mb-1">🚀 Comandos:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {['/list', '/search pagos', '/help'].map((cmd, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentMessage(cmd)}
                                                    className="px-2 py-1 rounded text-xs bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                                                    disabled={isLoading}
                                                >
                                                    {cmd}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggested Queries */}
                                {chatHistory.length === 0 && uploadedContractInfo && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-400 mb-1">💡 Sobre tu contrato:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {[
                                                `¿Cuáles son las cláusulas principales?`,
                                                `¿Qué riesgos identificas?`,
                                                `¿Cómo se puede rescindir?`
                                            ].map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentMessage(suggestion)}
                                                    className="px-2 py-1 rounded text-xs bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                                                    disabled={isLoading}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* General Suggestions */}
                                {chatHistory.length === 0 && !uploadedContractInfo && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-400 mb-1">💡 Consultas sugeridas:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {[
                                                "¿Qué contratos tienen cláusulas de arbitraje?",
                                                "Compara condiciones de pago",
                                                "¿Cuáles son los riesgos comunes?"
                                            ].map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentMessage(suggestion)}
                                                    className="px-2 py-1 rounded text-xs bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                                                    disabled={isLoading}
                                                >
                                                    {suggestion.length > 30 ? suggestion.substring(0, 27) + '...' : suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 border-t border-white/10">
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm bg-gray-600 text-white border border-gray-500/30 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                        >
                            <span>✅</span>
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="absolute bottom-16 right-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 max-w-xs">
                        <p className="text-red-300 text-xs">❌ {error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgenteConsultorContratoModal;