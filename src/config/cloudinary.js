// src/config/cloudinary.js

// ⚠️  IMPORTANTE: Configura estas credenciales con tus datos de Cloudinary
// 📝 Para obtener estas credenciales:
// 1. Ve a https://cloudinary.com y crea una cuenta
// 2. En tu Dashboard, encontrarás el Cloud Name y API Key
// 3. Crea un Upload Preset en Settings > Upload > Upload presets
//    - Configúralo como "unsigned" para uso en frontend
//    - Establece el modo de subida como "unsigned"

export const CLOUDINARY_CONFIG = {
  // 🔧 Configurado con tus credenciales de Cloudinary
  cloudName: 'dhdpp8eq2',
  
  // 🔧 Upload Preset para facturas
  uploadPreset: 'facturas',
  
  // 📁 Carpeta donde se guardarán las imágenes
  folder: 'flowbutton/invoices',
  
  // 🌐 Configuración adicional
  resourceType: 'auto', // Permite imágenes y otros archivos
  allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
  maxFileSize: 10485760, // 10MB en bytes
  
  // 🎯 Transformaciones por defecto
  defaultTransformations: {
    quality: 'auto',
    format: 'auto',
    dpr: 'auto'
  }
};

// ✅ Validar configuración de Cloudinary
export const validateCloudinaryConfig = () => {
  const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;
  
  if (!cloudName || cloudName === 'your-cloud-name') {
    console.warn('⚠️ Cloud Name de Cloudinary no configurado');
    console.log('💡 Configura CLOUDINARY_CONFIG.cloudName en src/config/cloudinary.js');
    return false;
  }
  
  if (!uploadPreset || uploadPreset === 'your-upload-preset') {
    console.warn('⚠️ Upload Preset de Cloudinary no configurado');
    console.log('💡 Configura CLOUDINARY_CONFIG.uploadPreset en src/config/cloudinary.js');
    return false;
  }
  
  return true;
};

// 📚 URLs de documentación
export const CLOUDINARY_DOCS = {
  setup: 'https://cloudinary.com/documentation/react_quick_start',
  uploadPresets: 'https://cloudinary.com/documentation/upload_presets',
  dashboard: 'https://cloudinary.com/console'
};

export default CLOUDINARY_CONFIG;
