# Integración Frontend-Backend para Gmail + OpenAI

Este documento explica cómo conectar el modal de Gmail + OpenAI con tu backend existente.

## Estructura de Servicios

### 1. API Service (`src/services/api.js`)
Servicio base para todas las comunicaciones con el backend:
- Configuración automática de headers
- Manejo de tokens de autenticación
- Gestión centralizada de errores
- Soporte para métodos HTTP (GET, POST, PUT, DELETE)

### 2. Gmail Service (`src/services/gmailService.js`)
Servicio específico para el flujo Gmail + OpenAI:
- `generateAndSendEmail()`: Genera y envía email en una sola llamada
- `generateEmail()`: Solo genera el contenido del email
- `checkGmailConnection()`: Verifica la conexión con Gmail

### 3. Hook useGmailFlow (`src/hooks/useGmailFlow.js`)
Hook personalizado que gestiona:
- Estados de carga, error y éxito
- Funciones para interactuar con el servicio
- Limpieza automática de estados

## Configuración del Backend

### 1. Variables de Entorno
Copia `.env.example` a `.env` y configura:
```env
VITE_API_URL=http://localhost:3001/api
```

**Nota:** Este proyecto usa Vite, por lo que las variables de entorno deben empezar con `VITE_`.

### 2. Endpoints Esperados por el Frontend

#### POST `/gmail/generate-send`
Genera y envía un email usando OpenAI.

**Request Body:**
```json
{
  "destinatario": "ejemplo@correo.com",
  "prompt": "Escribe un email de cumpleaños para mi hermana",
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email enviado exitosamente",
  "data": {
    "emailId": "12345",
    "generatedContent": "Contenido del email...",
    "sentAt": "2024-01-20T10:00:00.000Z"
  }
}
```

#### POST `/gmail/generate` (Opcional)
Solo genera el contenido del email sin enviarlo.

**Request Body:**
```json
{
  "prompt": "Escribe un email de cumpleaños",
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

#### GET `/gmail/status` (Opcional)
Verifica la conexión con Gmail.

**Response:**
```json
{
  "connected": true,
  "email": "tu-email@gmail.com"
}
```

## Uso del Modal

### En tu componente padre:

```jsx
import { GmailOpenAIModal } from './path/to/modal';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailSent = (formData, result) => {
    console.log('Email enviado:', formData, result);
    // Manejar éxito
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Abrir Gmail + IA
      </button>
      
      <GmailOpenAIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSent}
      />
    </>
  );
};
```

## Personalización

### Modificar el Servicio
Si tu backend usa endpoints diferentes, modifica `gmailService.js`:

```javascript
// Cambiar el endpoint
export const gmailService = {
  generateAndSendEmail: async (emailData) => {
    const response = await api.post('/tu-endpoint-personalizado', {
      // Tu estructura de datos
    });
    return response;
  }
};
```

### Agregar Autenticación
Si necesitas autenticación, modifica `api.js`:

```javascript
// En el helper apiRequest
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### Manejo de Errores Personalizado
Modifica el hook `useGmailFlow.js` para manejar errores específicos:

```javascript
const generateAndSendEmail = async (formData) => {
  try {
    const response = await gmailService.generateAndSendEmail(formData);
    // Tu lógica de éxito
  } catch (error) {
    if (error.message.includes('Gmail not connected')) {
      // Manejar error específico
    }
    throw error;
  }
};
```

## Estados del Modal

El modal maneja automáticamente:
- ✅ **Loading**: Muestra spinner mientras procesa
- ✅ **Error**: Muestra mensaje de error si algo falla
- ✅ **Success**: Cierra modal y ejecuta callback de éxito
- ✅ **Validation**: Valida campos requeridos

## Testing

Para probar sin backend, puedes simular respuestas:

```javascript
// En gmailService.js - modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

export const gmailService = {
  generateAndSendEmail: async (emailData) => {
    if (isDevelopment) {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        message: "Email simulado enviado",
        data: { emailId: "test-123" }
      };
    }
    
    // Código real del API
    return await api.post('/gmail/generate-send', emailData);
  }
};
```

## Próximos Pasos

1. **Configurar tu backend** con los endpoints mencionados
2. **Actualizar la URL** en `.env`
3. **Probar la integración** con el modal
4. **Personalizar** según tus necesidades específicas

¡El frontend está listo para conectarse con tu backend!
