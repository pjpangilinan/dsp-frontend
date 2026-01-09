import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';

interface HomePageProps {
  onStartAnalysis: (file: File) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col w-full max-w-3xl items-center gap-5 md:gap-6 animate-fade-in px-6">
      
      <div className="text-center flex flex-col items-center gap-2 md:gap-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
           Upload Media for Analysis
        </h1>
        <p className="text-base md:text-xl font-normal leading-relaxed text-slate-500 dark:text-gray-400 max-w-lg md:max-w-xl">
           Drag and drop your images or videos below to detect Deepfakes and AI-generated synthesis.
        </p>
      </div>

      <UploadZone onFileSelect={setFile} />

      <div className="w-full flex flex-col items-center gap-3">
        <button 
          disabled={!file}
          onClick={() => file && onStartAnalysis(file)}
          className="w-full h-12 md:h-14 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-slate-900 text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
        >
          {file ? (
             <span className="material-symbols-outlined text-xl">analytics</span>
          ) : (
             <span className="material-symbols-outlined text-xl">cloud_upload</span>
          )}
          <span>Start Analysis</span>
        </button>
        <p className="text-[10px] md:text-xs text-slate-400 dark:text-gray-600 text-center">
           Files are deleted immediately after analysis report generation.
        </p>
      </div>
    </div>
  );
};