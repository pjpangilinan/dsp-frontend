import React from 'react';

export const AboutPage: React.FC = () => (
  <div className="flex flex-col w-full max-w-4xl items-center justify-center animate-fade-in px-6">
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-3xl p-8 md:p-14 shadow-2xl w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            About DSPVerify
        </h2>
      </div>
      
      <div className="space-y-6 text-base md:text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
        <p>
          DSPVerify is a hybrid forensic system that identifies synthetic media by analyzing <strong>Digital Signal Processing (DSP)</strong> artifacts. Unlike "black box" neural networks, it uses a transparent, feature-based pipeline to ensure high interpretability.        </p>
        <p>
          The project detects high-frequency gradient anomalies via Sobel spatial filtering for images and temporal jitter variance for videos to identify AI-generated flickering. These features are then classified by a Random Forest model to provide a probabilistic authenticity verdict.        </p>
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-surface-border grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Version</span>
            <span className="text-base font-mono font-medium">1.0.0</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Engine</span>
            <span className="text-base font-mono font-medium">TensorFlow / OpenCV</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);