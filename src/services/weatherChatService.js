// src/services/weatherChatService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class WeatherChatService {
  // Envía el mensaje del usuario al backend POST /api/weather
  // Incluye la ubicación si está disponible (requerida por el backend)
  async sendMessage(message, weatherContext = null) {
    try {
      const payload = {
        message: message
      };

      // Si tenemos contexto meteorológico, agregar la ubicación que el backend requiere
      if (weatherContext && weatherContext.location) {
        payload.location = weatherContext.location;
      }

      console.log('🚀 Sending to backend:', payload);
      console.log('📡 URL:', `${API_BASE_URL}/weather`);

      const response = await fetch(`${API_BASE_URL}/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Intentar leer el cuerpo de la respuesta para más detalles del error
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }      const data = await response.json();
      console.log('✅ Success response:', data);
      
      // Extraer el mensaje de la respuesta del backend
      // El backend envía: { success: true, message: "...", iaResponse: { output: "mensaje aquí" } }
      // Necesitamos devolver: { message: "mensaje aquí" }
      const aiMessage = data.iaResponse?.output || data.output || data.message || 'Respuesta recibida del backend';
      
      return {
        message: aiMessage,
        isError: false,
        fallback: false
      };
    } catch (error) {
      console.error('Error sending weather chat message:', error);
      
      // Fallback response si el backend no está disponible
      return {
        message: this.generateFallbackResponse(message),
        isError: true,
        fallback: true
      };
    }
  }

  // Respuesta de fallback si el backend no está disponible
  generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('lluvia') || lowerMessage.includes('paraguas')) {
      return '🌧️ Basándome en los datos meteorológicos, te recomiendo llevar paraguas si la probabilidad de lluvia es alta. El viento también puede afectar el uso del paraguas.';
    }
    
    if (lowerMessage.includes('ropa') || lowerMessage.includes('vestir')) {
      return '👕 Para elegir ropa adecuada, considera la temperatura actual y la sensación térmica. Si hay viento, puede hacer que sientas más frío del indicado.';
    }
    
    if (lowerMessage.includes('actividad') || lowerMessage.includes('exterior') || lowerMessage.includes('aire libre')) {
      return '🏃‍♂️ Para actividades al aire libre, revisa la temperatura, viento y condición general. Los días soleados con poco viento son ideales.';
    }
    
    if (lowerMessage.includes('fin de semana') || lowerMessage.includes('mañana')) {
      return '📅 Te recomiendo revisar el pronóstico de varios días en la pestaña de pronóstico para planificar mejor tus actividades.';
    }

    if (lowerMessage.includes('temperatura') || lowerMessage.includes('calor') || lowerMessage.includes('frío')) {
      return '🌡️ La temperatura actual y la sensación térmica pueden variar. Considera también la humedad y el viento para una mejor percepción del clima.';
    }

    // Respuesta genérica
    return '🤖 Estoy aquí para ayudarte con consultas meteorológicas. Puedes preguntarme sobre el clima actual, pronósticos, qué ropa usar, actividades al aire libre, y más. (Nota: Backend temporalmente no disponible, usando respuesta local)';
  }
}

export default new WeatherChatService();
