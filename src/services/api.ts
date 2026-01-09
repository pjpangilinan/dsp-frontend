import type { AnalysisResult } from '../types';

const API_URL = 'https://dsp.tail841e2c.ts.net:8443';

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  // Determine endpoint based on file type
  const endpoint = file.type.startsWith('video/') ? '/analyze_video' : '/analyze_image';

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Helper to fix base64 strings if they are missing headers
    const fixBase64 = (str: string | undefined) => {
      if (!str) return undefined;
      return str.startsWith('data:') ? str : `data:image/png;base64,${str}`;
    };

    return {
      ...data,
      original: fixBase64(data.original),
      processed: fixBase64(data.processed),
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};