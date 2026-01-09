import React, { useEffect, useState } from 'react';
import type { AnalysisResult } from '../types';
import { analyzeFile } from '../services/api';

interface AnalysisPageProps {
  file: File | null;
  onReset: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ file, onReset }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!file) return;

    const runAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await analyzeFile(file);
        
        // Normalize the data
        const normalizedResult: AnalysisResult = {
            original: rawData.original,
            processed: rawData.processed,
            
            // --- FIX START ---
            // We use rawData.verdict directly because the backend 
            // now sends "REAL" or "AI-GENERATED".
            verdict: rawData.verdict, 
            // --- FIX END ---

            confidence: typeof rawData.confidence === 'number' ? rawData.confidence : 0,
            details: rawData.details || `Model: RandomForest (DSP) | Input: ${file.name}`,
            explanation: rawData.explanation || (rawData.verdict === 'AI-GENERATED' 
                ? "The DSP pipeline detected significant high-frequency artifacts or temporal jitter."
                : "The file exhibits natural frequency distribution consistent with authentic media.")
        };

        setResult(normalizedResult);
      } catch (err) {
        console.error(err);
        setError('Failed to connect to the analysis engine. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [file]);

  // --- HELPER: Format Bytes ---
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // --- HELPER: Determine Risk Level ---
  const getRiskLevel = (probability: number) => {
    if (probability < 0.30) return 'safe';     // 0-30%
    if (probability < 0.60) return 'warning';  // 30-60%
    return 'danger';                           // 60-100%
  };

  // --- HELPER: Get Colors based on Risk ---
  const getRiskColor = (level: string, type: 'bg' | 'text' | 'border' | 'bar') => {
    switch (level) {
      case 'safe':
        if (type === 'bg') return 'bg-green-50 dark:bg-green-900/10';
        if (type === 'border') return 'border-green-500';
        if (type === 'text') return 'text-green-700 dark:text-green-400';
        if (type === 'bar') return 'bg-green-500';
        return '';
      case 'warning':
        if (type === 'bg') return 'bg-amber-50 dark:bg-amber-900/10';
        if (type === 'border') return 'border-amber-500';
        if (type === 'text') return 'text-amber-700 dark:text-amber-400';
        if (type === 'bar') return 'bg-amber-500';
        return '';
      case 'danger':
        if (type === 'bg') return 'bg-red-50 dark:bg-red-900/10';
        if (type === 'border') return 'border-red-500';
        if (type === 'text') return 'text-red-700 dark:text-red-400';
        if (type === 'bar') return 'bg-red-500';
        return '';
      default: return '';
    }
  };

  if (!file) return null;

  const riskLevel = result ? getRiskLevel(result.confidence) : 'safe';

  return (
    <div className="w-full max-w-6xl px-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Report</h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-border rounded-lg transition-colors"
        >
          Analyze Another File
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-surface-border"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 animate-pulse">
            Processing {file.type.startsWith('video') ? 'video frames' : 'image artifacts'}...
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          <button 
            onClick={onReset}
            className="mt-4 px-4 py-2 bg-white dark:bg-red-900/40 text-red-600 dark:text-red-300 text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
{/* --- LEFT COLUMN: Visuals Only --- */}
          <div className="space-y-6">
            
            {/* 1. Heatmap Card */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-surface-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                {file.type.startsWith('video') ? 'Motion Consistency Plot' : 'Frequency Heatmap'}
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-black/5 relative group">
                <img 
                  src={result.processed} 
                  alt="Processed Analysis" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* 2. Original Image Card */}
            {result.original && (
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-surface-border opacity-75 hover:opacity-100 transition-opacity">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Original Input</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-black/5">
                  <img 
                    src={result.original} 
                    alt="Original" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Verdict, Details & Metadata --- */}
          <div className="space-y-6">
            <div className={`p-8 rounded-3xl border-2 ${getRiskColor(riskLevel, 'bg')} ${getRiskColor(riskLevel, 'border')}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`material-symbols-outlined text-3xl ${getRiskColor(riskLevel, 'text')}`}>
                  {riskLevel === 'danger' ? 'warning' : 'verified_user'}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">System Verdict</span>
              </div>
              
              <h1 className={`text-5xl font-black ${getRiskColor(riskLevel, 'text')}`}>
                {result.verdict}
              </h1>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${getRiskColor(riskLevel, 'bar')}`} 
                    style={{ width: `${(result.confidence || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {((result.confidence || 0) * 100).toFixed(1)}% AI Probability
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-surface-border space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Analysis</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-surface-border">
                <p className="font-mono text-sm text-primary">
                  {'>'} {result.details}
                </p>
              </div>
            </div>

<div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-surface-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">File Metadata</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 dark:border-surface-border pb-2">
                    <span className="text-slate-500 text-sm">Filename</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-xs truncate max-w-[200px]" title={file.name}>{file.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-surface-border pb-2">
                    <span className="text-slate-500 text-sm">Size</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-surface-border pb-2">
                    <span className="text-slate-500 text-sm">Type</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-xs uppercase">{file.type.split('/')[1] || 'UNKNOWN'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-surface-border pb-2">
                    <span className="text-slate-500 text-sm">Analysis Res</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">64x64 px (Tensor)</span>
                </div>
                <div className="flex justify-between pt-1">
                    <span className="text-slate-500 text-sm">Model</span>
                    <span className="font-mono text-slate-400 text-xs">RandomForest (DSP)</span>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      )}
    </div>
  );
};