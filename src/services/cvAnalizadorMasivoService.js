// src/services/cvAnalysisService.js

const ANALYSIS_WEBHOOK = 'https://n8n-jose.up.railway.app/webhook/cv-masivo';

export const cvAnalizadorMasivoService = {
  analyzeCVs: async (data) => {
    try {
      const response = await fetch(ANALYSIS_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${text}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Fallo en conexión con N8N: ${error.message}`);
    }
  }
};
