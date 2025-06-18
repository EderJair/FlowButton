// src/services/cloudinaryService.js

import { CLOUDINARY_CONFIG, validateCloudinaryConfig } from '../config/cloudinary.js';

export const cloudinaryService = {
  // Subir imagen a Cloudinary
  uploadImage: async (file) => {
    try {
      // Validar configuración antes de subir
      if (!validateCloudinaryConfig()) {
        throw new Error('Cloudinary no está configurado. Revisa src/config/cloudinary.js');
      }
      
      console.log('☁️ Subiendo imagen a Cloudinary:', file.name);
      
      // Crear FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', CLOUDINARY_CONFIG.folder);
      formData.append('resource_type', CLOUDINARY_CONFIG.resourceType);
      
      // Endpoint de Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.error?.message || response.statusText}`);
      }
      
      const result = await response.json();
      
      console.log('✅ Imagen subida exitosamente:', result.secure_url);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        uploadedAt: result.created_at
      };
      
    } catch (error) {
      console.error('❌ Error al subir imagen a Cloudinary:', error);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  },
  // Obtener URL optimizada de la imagen
  getOptimizedUrl: (publicId, options = {}) => {
    const {
      width = 800,
      height = 600,
      quality = 'auto',
      format = 'auto'
    } = options;
    
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_limit,q_${quality},f_${format}/${publicId}`;
  },

  // Eliminar imagen de Cloudinary
  deleteImage: async (publicId) => {
    try {
      console.log('🗑️ Eliminando imagen de Cloudinary:', publicId);
      
      // Nota: Para eliminar imágenes necesitas usar el Admin API de Cloudinary
      // Esto requiere el API Secret que no debe estar en el frontend
      // Esta función debería implementarse en tu backend
      
      console.warn('⚠️ La eliminación de imágenes debe implementarse en el backend por seguridad');
      
      return { success: false, message: 'Eliminar desde backend' };
      
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', error);
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }
};

export default cloudinaryService;
