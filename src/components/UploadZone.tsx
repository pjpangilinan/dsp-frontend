import React, { useState, useCallback } from 'react';
import type { AllowedMimeType } from '../types';

const ALLOWED_TYPES: AllowedMimeType[] = ['image/jpeg', 'image/png', 'video/mp4'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type as AllowedMimeType)) {
      setError("Invalid file type. Please upload JPG, PNG, or MP4.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 50MB.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent, dragging: boolean) => {
    e.preventDefault();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  return (
    <div 
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={`
        flex flex-col items-center justify-center gap-4 rounded-2xl border-[3px] border-dashed 
        transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-sm 
        w-full h-[220px] md:h-[260px] lg:h-[280px]
        ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 
          isDragging 
          ? 'border-primary bg-blue-50 dark:bg-[#1a202c] scale-[1.02]' 
          : 'border-gray-300 dark:border-surface-border bg-white dark:bg-surface-dark hover:border-primary hover:bg-slate-50 dark:hover:bg-[#20242c]'
        }
      `}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        onChange={handleInputChange}
        accept=".jpg, .jpeg, .png, .mp4" 
      />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className={`size-16 md:size-20 flex items-center justify-center rounded-full transition-all duration-300 ${isDragging ? 'scale-110 bg-primary/20' : 'bg-blue-50 dark:bg-primary/20 group-hover:scale-110 shadow-inner'}`}>
        <span className={`material-symbols-outlined text-4xl md:text-5xl ${error ? 'text-red-500' : 'text-primary'}`}>
          {error ? 'error' : (selectedFile ? 'check_circle' : 'cloud_upload')}
        </span>
      </div>

      <div className="flex flex-col items-center z-10 px-6 gap-1">
        <p className="text-lg md:text-2xl font-bold text-center text-slate-900 dark:text-white truncate max-w-[280px] md:max-w-[400px]">
          {error ? 'Upload Failed' : (selectedFile ? selectedFile.name : 'Drag & drop media here')}
        </p>
        
        {error ? (
           <p className="text-sm font-medium text-red-500 text-center">{error}</p>
        ) : (
          <p className="text-sm md:text-base font-medium text-slate-400 dark:text-gray-500 text-center">
            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG or MP4'}
          </p>
        )}
      </div>

      {!selectedFile && !error && (
        <button className="mt-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white text-sm md:text-base font-bold transition-all shadow-lg shadow-blue-500/20 z-10 pointer-events-none group-hover:translate-y-[-2px]">
          Browse Files
        </button>
      )}
    </div>
  );
};