// Simple Express server for testing FlowButton API endpoints
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Test endpoint for legal consultant
app.post('/api/lawyer-consult', (req, res) => {
  const { message, userContext, consultationType } = req.body;
  
  console.log('📋 Legal Consultant Request:', {
    message,
    userContext,
    consultationType
  });
  
  // Simulate processing delay
  setTimeout(() => {
    // Mock legal responses based on the message content
    const legalResponses = {
      'contrato': '📄 Para redactar un contrato de trabajo válido, debes incluir: datos de las partes, objeto del contrato, duración, remuneración, jornada laboral, y lugar de trabajo. Es recomendable establecer cláusulas sobre confidencialidad y terminación.',
      'consumidor': '🛡️ Como consumidor tienes derecho a: información veraz sobre productos/servicios, garantía legal, derecho de retracto en compras online (7 días), protección contra cláusulas abusivas, y reparación o indemnización por daños.',
      'poder': '📜 Un poder notarial es un documento que autoriza a otra persona (apoderado) a actuar en tu nombre. Debe ser otorgado ante notario, especificar las facultades concedidas, identificar claramente al apoderado, y puede ser general o específico.',
      'testamento': '📃 Para hacer un testamento válido necesitas: ser mayor de edad y estar en pleno uso de tus facultades, redactarlo de tu puño y letra (testamento ológrafo) o ante notario, firmarlo, y guardarlo en lugar seguro. Puedes modificarlo cuando desees.',
      'accidente': '🚨 En caso de accidente laboral: busca atención médica inmediata, reporta el incidente a tu empleador dentro de 24 horas, solicita copia del reporte, reúne evidencias (fotos, testigos), y considera consultar con un abogado especializado en derecho laboral.',
      'default': '⚖️ Entiendo tu consulta legal. Te recomiendo proporcionar más detalles específicos sobre tu situación para poder brindarte un asesoramiento más preciso. ¿Puedes contarme más sobre el contexto de tu pregunta?'
    };
    
    // Find appropriate response based on keywords
    let response = legalResponses.default;
    const messageLower = message.toLowerCase();
    
    for (const keyword in legalResponses) {
      if (messageLower.includes(keyword)) {
        response = legalResponses[keyword];
        break;
      }
    }
    
    // Add personalization if userContext is provided
    if (userContext) {
      response += `\n\n💡 Considerando tu contexto (${userContext}), te sugiero también consultar con un especialista en tu área específica.`;
    }
    
    res.json({
      success: true,
      data: {
        response: response,
        message: 'Consulta procesada exitosamente',
        consultationType: consultationType || 'general',
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        additionalResources: [
          'Código Civil Peruano',
          'Ley de Protección al Consumidor',
          'Código de Trabajo'
        ]
      }
    });
  }, 1000 + Math.random() * 2000); // Simulate realistic API delay
});

// Gmail + OpenAI endpoint
app.post('/api/send-email', (req, res) => {
  const { subject, message, recipients } = req.body;
  
  console.log('📧 Email Request:', {
    subject,
    message,
    recipients
  });
  
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        message: 'Email enviado exitosamente',
        emailId: 'email_' + Date.now(),
        timestamp: new Date().toISOString()
      }
    });
  }, 1500);
});

// Invoice OCR endpoint
app.post('/api/ocr-analysis', (req, res) => {
  const { imageUrl, extractedText } = req.body;
  
  console.log('📄 OCR Analysis Request:', {
    imageUrl,
    textLength: extractedText?.length || 0
  });
  
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        analysis: 'Factura procesada: Cliente ACME Corp, Monto: S/ 1,250.00, Fecha: 2024-01-15, Estado: Pagada',
        confidence: 0.92,
        extractedData: {
          client: 'ACME Corp',
          amount: 1250.00,
          currency: 'PEN',
          date: '2024-01-15',
          status: 'Pagada'
        }
      }
    });
  }, 2000);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FlowButton API Server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/lawyer-consult',
      'POST /api/send-email',
      'POST /api/ocr-analysis',
      'GET /api/health'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.url} is not a valid endpoint`,
    availableEndpoints: [
      'POST /api/lawyer-consult',
      'POST /api/send-email', 
      'POST /api/ocr-analysis',
      'GET /api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FlowButton API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/lawyer-consult`);
  console.log(`   POST http://localhost:${PORT}/api/send-email`);
  console.log(`   POST http://localhost:${PORT}/api/ocr-analysis`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});
