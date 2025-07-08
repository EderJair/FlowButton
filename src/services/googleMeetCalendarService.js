// src/services/googleMeetCalendarService.js

const WEBHOOK_URL = 'https://n8n-jose.up.railway.app/webhook/create-meeting';

export const googleMeetCalendarService = {
  createMeetAppointment: async (appointmentData) => {
    try {
      console.group('🔍 DEBUG N8N Request - Inicio');
      console.log('1. URL del webhook:', WEBHOOK_URL);
      console.log('2. Datos recibidos del hook:', appointmentData);
      console.log('3. Tipo de datos:', typeof appointmentData);
      console.log('4. appointmentData.mensaje:', appointmentData.mensaje);
      
      // Validar que tenemos los datos
      if (!appointmentData || !appointmentData.mensaje) {
        throw new Error('No se recibieron datos válidos del formulario');
      }
      
      // Crear payload simple como N8N espera
      const payload = {
        message: appointmentData.mensaje  // Solo enviar "message"
      };
      
      console.log('5. Payload final a enviar:');
      console.log(JSON.stringify(payload, null, 2));
      
      console.log('6. Iniciando fetch...');
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('7. Response recibida:');
      console.log('   - Status:', response.status);
      console.log('   - StatusText:', response.statusText);
      console.log('   - OK:', response.ok);
      console.log('   - Headers:', Object.fromEntries(response.headers.entries()));
      
      // Leer respuesta como texto PRIMERO
      const responseText = await response.text();
      console.log('8. Response como texto:');
      console.log('   - Length:', responseText.length);
      console.log('   - Content:', `"${responseText}"`);
      console.log('   - First 100 chars:', responseText.substring(0, 100));
      
      if (!response.ok) {
        console.error('❌ Response no OK');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Body: ${responseText}`);
      }
      
      // Intentar parsear JSON solo si hay contenido
      let result;
      if (responseText.trim().length > 0) {
        try {
          result = JSON.parse(responseText);
          console.log('9. ✅ JSON parseado exitosamente:', result);
        } catch (jsonError) {
          console.warn('9. ⚠️ Error parseando JSON:', jsonError.message);
          console.log('   - Tratando como texto plano');
          result = { 
            success: true, 
            message: 'Event created successfully',
            rawResponse: responseText 
          };
        }
      } else {
        console.log('9. ✅ Respuesta vacía - asumiendo éxito');
        result = { success: true, message: 'Event created successfully' };
      }
      
      console.log('10. Resultado final:', result);
      console.groupEnd();
      
      return result;
      
    } catch (error) {
      console.group('❌ ERROR en createMeetAppointment');
      console.error('Error tipo:', error.constructor.name);
      console.error('Error mensaje:', error.message);
      console.error('Error stack:', error.stack);
      
      // Si es error de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Error de conexión - verificar URL y conectividad');
      }
      
      console.groupEnd();
      throw new Error(`Error conectando con N8N: ${error.message}`);
    }
  },

  checkWebhookStatus: async () => {
    try {
      console.log('🔍 Verificando webhook status...');
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Webhook status check:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Error verificando webhook:', error);
      return false;
    }
  }
};

export default googleMeetCalendarService;