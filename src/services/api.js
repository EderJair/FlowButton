// src/services/api.js

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Función helper para hacer requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }  try {
    // Removido: console.log de URL y configuración (muy verbosos)
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', response.status, response.statusText);
      console.error('❌ Error body:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    // Removido: console.log de respuesta exitosa (muy verboso)
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Métodos HTTP helpers
export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { method: 'GET', ...options }),
    
  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),
    
  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),
    
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { method: 'DELETE', ...options }),
};

export { API_BASE_URL };
