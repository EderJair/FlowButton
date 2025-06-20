// 🧪 SCRIPT DE PRUEBA - VERIFICAR CONEXIÓN CON BACKEND
// Este script te ayuda a verificar que tu endpoint /api/lawyer-consult esté funcionando

// Para usar este script:
// 1. Abre las DevTools del navegador (F12)
// 2. Ve a la pestaña Console
// 3. Pega este código y presiona Enter
// 4. Observa la respuesta en la consola

(async function testLawyerEndpoint() {
  console.log('🧪 INICIANDO PRUEBA DEL ENDPOINT DEL ABOGADO...');
  
  // Configuración (cambia esta URL por la de tu backend)
  const API_URL = 'http://localhost:5000/api'; // 👈 CAMBIA ESTA URL
  
  const testPayload = {
    message: "¿Cuáles son los derechos básicos de un trabajador?",
    userContext: {
      timestamp: new Date().toISOString(),
      user_id: 'test_user_' + Date.now(),
      source: 'flowbutton_test',
      session_id: 'test_session_' + Date.now()
    },
    consultationType: 'legal_advice'
  };
  
  console.log('📤 Enviando payload de prueba:', testPayload);
  
  try {
    const response = await fetch(`${API_URL}/lawyer-consult`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📡 Status de respuesta:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error HTTP:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Respuesta exitosa del backend:', data);
    
    // Intentar extraer la respuesta usando la misma lógica del modal
    let extractedResponse = null;
    
    if (data && data.success && data.data) {
      extractedResponse = data.data.response || data.data.message || data.data.content || data.data.answer;
      if (!extractedResponse && typeof data.data === 'string') {
        extractedResponse = data.data;
      }
    } else if (data && typeof data === 'object') {
      extractedResponse = data.response || data.message || data.content || data.answer || data.result;
    } else if (typeof data === 'string') {
      extractedResponse = data;
    }
    
    if (extractedResponse) {
      console.log('🎯 Respuesta extraída que se mostraría al usuario:', extractedResponse);
      console.log('✅ ¡PRUEBA EXITOSA! El endpoint está funcionando correctamente.');
    } else {
      console.warn('⚠️ Respuesta recibida pero no se pudo extraer el contenido');
      console.warn('Estructura de respuesta:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.error('Posibles causas:');
    console.error('- El backend no está corriendo');
    console.error('- La URL es incorrecta');
    console.error('- Problemas de CORS');
    console.error('- El endpoint /lawyer-consult no existe');
  }
})();

console.log('🔧 Para probar con una URL diferente, cambia la variable API_URL en el script');
