export type AllowedMimeType = 'image/jpeg' | 'image/png' | 'video/mp4';
export type PageView = 'home' | 'about' | 'analysis';

export interface AnalysisResult {
  original?: string;  
  processed: string;  
  verdict: 'REAL' | 'AI-GENERATED';
  confidence: number; 
  details: string;
  explanation: string;
}