// src/services/ocrService.js

import { createWorker } from 'tesseract.js';

export const ocrService = {
  // Extraer texto de imagen usando Tesseract.js
  extractTextFromImage: async (imageSource, options = {}) => {
    const {
      language = 'spa+eng', // Español e inglés
      progressCallback = null,
      config = {}
    } = options;

    let worker = null;
    
    try {
      console.log('🔍 Iniciando extracción de texto con OCR...');
      
      // Crear worker de Tesseract
      worker = await createWorker(language, 1, {
        logger: (m) => {
          if (progressCallback && m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            progressCallback(progress);
          }
        }
      });

      // Configuraciones adicionales para mejorar la precisión
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúñüÁÉÍÓÚÑÜ.,;:()[]{}+-*/%$€@#&|\\/"\'_=?¿!¡ ',
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        ...config
      });

      console.log('📸 Procesando imagen...');
      
      // Reconocer texto
      const { data } = await worker.recognize(imageSource);
      
      console.log('✅ Texto extraído exitosamente');
      console.log('📄 Confianza promedio:', Math.round(data.confidence), '%');
      
      // Limpiar y procesar el texto extraído
      const cleanedText = cleanExtractedText(data.text);
      
      return {
        text: cleanedText,
        rawText: data.text,
        confidence: data.confidence,
        words: data.words?.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        })) || [],
        lines: data.lines?.map(line => ({
          text: line.text,
          confidence: line.confidence,
          bbox: line.bbox
        })) || [],
        blocks: data.blocks?.map(block => ({
          text: block.text,
          confidence: block.confidence,
          bbox: block.bbox
        })) || []
      };
      
    } catch (error) {
      console.error('❌ Error en extracción OCR:', error);
      throw new Error(`Error en OCR: ${error.message}`);
    } finally {
      // Limpiar worker
      if (worker) {
        await worker.terminate();
      }
    }
  },

  // Extraer texto específico de facturas
  extractInvoiceData: async (imageSource, progressCallback = null) => {
    try {
      console.log('🧾 Extrayendo datos específicos de factura...');
      
      const ocrResult = await ocrService.extractTextFromImage(imageSource, {
        language: 'spa+eng',
        progressCallback,
        config: {
          tessedit_pageseg_mode: '6', // Uniform block of text
        }
      });

      // Procesar texto específico para facturas
      const invoiceData = parseInvoiceText(ocrResult.text);
      
      return {
        ...ocrResult,
        invoiceData
      };
      
    } catch (error) {
      console.error('❌ Error extrayendo datos de factura:', error);
      throw error;
    }
  }
};

// Limpiar texto extraído
const cleanExtractedText = (text) => {
  if (!text) return '';
  
  return text
    // Eliminar espacios múltiples
    .replace(/\s+/g, ' ')
    // Eliminar líneas vacías múltiples
    .replace(/\n\s*\n/g, '\n')
    // Corregir caracteres comunes mal reconocidos
    .replace(/[|]/g, 'l')
    .replace(/[0O]/g, (match, offset, string) => {
      // Contexto: si está rodeado de números, probablemente es 0
      const before = string[offset - 1];
      const after = string[offset + 1];
      if (/\d/.test(before) || /\d/.test(after)) {
        return '0';
      }
      return 'O';
    })
    .trim();
};

// Parsear texto específico de facturas
const parseInvoiceText = (text) => {
  const invoiceData = {
    number: null,
    date: null,
    total: null,
    subtotal: null,
    tax: null,
    company: null,
    items: []
  };

  const lines = text.split('\n');
  
  // Patrones regex mejorados para datos comunes de facturas
  const patterns = {
    // Número de factura - patrones más específicos
    number: /(?:factura|invoice|fact|nº|no|num|#|F)\s*:?\s*([A-Z0-9\-\/\*]+)/i,
    // Fecha - patrones más flexibles
    date: /(?:fecha|date|f\.|fec)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    // Total con múltiples monedas
    total: /(?:total|importe\s*total|amount|TOTAL)\s*:?\s*([€$£¥]?\s*\d+[.,]\d{2}|[€$£¥]?\s*\d+)/i,
    // Subtotal
    subtotal: /(?:subtotal|base\s*imponible|net\s*amount|SUBTOTAL)\s*:?\s*([€$£¥]?\s*\d+[.,]\d{2}|[€$£¥]?\s*\d+)/i,
    // IVA/Tax - múltiples formatos
    tax: /(?:iva|tax|impuesto|vat|IVA|VAT)\s*:?\s*([€$£¥]?\s*\d+[.,]\d{2}|[€$£¥]?\s*\d+|\d+%)/i,
    // Vencimiento
    dueDate: /(?:vencimiento|due\s*date|payment\s*due)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
  };

  // Extraer datos usando patrones
  for (const line of lines) {
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = line.match(pattern);
      if (match && !invoiceData[key]) {
        invoiceData[key] = match[1].trim();
      }
    }
    
    // Buscar nombre de empresa (líneas al inicio que no sean datos típicos)
    if (!invoiceData.company && lines.indexOf(line) < 8) {
      const cleanLine = line.trim();
      // Criterios para identificar empresa: no muy corta, no números de teléfono, no direcciones típicas
      const companyPattern = /^[A-ZÁÉÍÓÚÑÜ][A-Za-záéíóúñü\s&.,\-]{8,60}$/;
      const notCompanyPattern = /factura|invoice|fecha|date|tel|phone|email|@|www|http|calle|street|avenue|plaza/i;
      
      if (companyPattern.test(cleanLine) && 
          !notCompanyPattern.test(cleanLine) && 
          cleanLine.length < 60 &&
          !cleanLine.match(/^\d/) && // No empezar con número
          !cleanLine.includes('Passeig') && // Evitar direcciones
          !cleanLine.includes('Barcelona')) {
        invoiceData.company = cleanLine;
      }
    }
  }

  // Intentar extraer empresa del texto inicial (primera línea significativa)
  if (!invoiceData.company) {
    const firstLines = lines.slice(0, 5);
    for (const line of firstLines) {
      const cleanLine = line.trim();
      if (cleanLine.length > 8 && cleanLine.length < 50 && 
          !cleanLine.match(/^\d/) && 
          !cleanLine.toLowerCase().includes('passeig') &&
          !cleanLine.toLowerCase().includes('barcelona') &&
          !cleanLine.toLowerCase().includes('studios') &&
          cleanLine.match(/^[A-Z]/)) {
        invoiceData.company = cleanLine;
        break;
      }
    }
  }

  return invoiceData;
};

export default ocrService;
