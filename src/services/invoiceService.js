// src/services/invoiceService.js

import { api } from './api.js';
import { cloudinaryService } from './cloudinaryService.js';
import { ocrService } from './ocrService.js';

// Servicio para el análisis de facturas con IA
export const invoiceService = {
  // Analizar factura con IA - Flujo completo con Cloudinary y OCR
  analyzeInvoice: async (invoiceData, progressCallback = null) => {
    try {
      console.log('📄 Iniciando análisis completo de factura:', invoiceData.file.name);
      
      // Paso 1: Subir imagen a Cloudinary
      if (progressCallback) progressCallback({ step: 'upload', progress: 0 });
      console.log('☁️ Paso 1: Subiendo imagen a Cloudinary...');
      
      const cloudinaryResult = await cloudinaryService.uploadImage(invoiceData.file);
      console.log('✅ Imagen subida a Cloudinary:', cloudinaryResult.url);
      
      if (progressCallback) progressCallback({ step: 'upload', progress: 100 });

      // Paso 2: Extraer texto con OCR
      if (progressCallback) progressCallback({ step: 'ocr', progress: 0 });
      console.log('🔍 Paso 2: Extrayendo texto con OCR...');
      
      const ocrResult = await ocrService.extractInvoiceData(
        cloudinaryResult.url,
        (progress) => {
          if (progressCallback) {
            progressCallback({ step: 'ocr', progress });
          }
        }
      );      console.log('📝 Texto extraído (', ocrResult.text.length, 'caracteres )');
      console.log('🧾 Datos de factura:', ocrResult.invoiceData);
      
      if (progressCallback) progressCallback({ step: 'ocr', progress: 100 });

      // Paso 3: Enviar texto extraído al backend
      if (progressCallback) progressCallback({ step: 'backend', progress: 0 });
      console.log('📤 Paso 3: Enviando datos al backend...');      const backendPayload = {
        // Campo que espera tu backend (probablemente 'imageUrl' en lugar de 'cloudinaryUrl')
        imageUrl: cloudinaryResult.url, // ⭐ Cambio principal
        cloudinaryUrl: cloudinaryResult.url, // Mantener por compatibilidad
        
        // Datos extraídos
        extractedText: ocrResult.text,
        invoiceData: ocrResult.invoiceData,
        
        // Metadatos de Cloudinary
        cloudinaryPublicId: cloudinaryResult.publicId,
        
        // Metadatos del OCR
        ocrConfidence: ocrResult.confidence,
        
        // Metadatos del archivo
        fileName: invoiceData.file.name,
        fileSize: invoiceData.file.size,
        timestamp: new Date().toISOString()
      };
        console.log('📋 Payload enviado al backend:', JSON.stringify(backendPayload, null, 2));
      
      const backendResponse = await api.post('/process-image', backendPayload);
      
      // Removido console.log de respuesta - se ve en la consola del backend
      
      if (progressCallback) progressCallback({ step: 'backend', progress: 100 });
      
      console.log('✅ Análisis completo exitoso');
      
      return {
        success: true,
        cloudinary: cloudinaryResult,
        ocr: ocrResult,
        backend: backendResponse,
        summary: {
          fileName: invoiceData.file.name,
          extractedText: ocrResult.text,
          invoiceData: ocrResult.invoiceData,
          imageUrl: cloudinaryResult.url,
          confidence: ocrResult.confidence,
          processedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Error en análisis completo de factura:', error);
      throw new Error(`Error en el análisis de factura: ${error.message}`);
    }
  },

  // Método simplificado para solo OCR local (sin backend)
  analyzeInvoiceLocal: async (file, progressCallback = null) => {
    try {
      console.log('📄 Análisis local de factura (solo OCR):', file.name);
      
      // Crear URL temporal para el archivo
      const imageUrl = URL.createObjectURL(file);
      
      try {
        const ocrResult = await ocrService.extractInvoiceData(
          imageUrl,
          progressCallback
        );
        
        return {
          success: true,
          fileName: file.name,
          extractedText: ocrResult.text,
          invoiceData: ocrResult.invoiceData,
          confidence: ocrResult.confidence,
          processedAt: new Date().toISOString()
        };
        
      } finally {
        // Limpiar URL temporal
        URL.revokeObjectURL(imageUrl);
      }
      
    } catch (error) {
      console.error('❌ Error en análisis local:', error);
      throw new Error(`Error en análisis local: ${error.message}`);
    }
  },

  // Obtener historial de facturas analizadas
  getInvoiceHistory: async (limit = 10, offset = 0) => {
    try {
      console.log('📋 Obteniendo historial de facturas...');
      const response = await api.get('/invoices/history', { limit, offset });
      return response;
    } catch (error) {
      console.error('❌ Error al obtener historial:', error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  },

  // Verificar estado del servicio de análisis
  checkAnalysisStatus: async () => {
    try {
      console.log('🔍 Verificando estado del servicio...');
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('❌ Error al verificar estado:', error);
      throw new Error(`Error de conexión: ${error.message}`);
    }
  },

  // Descargar factura procesada (si tu backend lo permite)
  downloadProcessedInvoice: async (invoiceId) => {
    try {
      console.log('📥 Descargando factura procesada:', invoiceId);
      const response = await api.get(`/invoices/${invoiceId}/download`);
      return response;
    } catch (error) {
      console.error('❌ Error al descargar:', error);
      throw new Error(`Error al descargar: ${error.message}`);
    }
  }
};

export default invoiceService;
