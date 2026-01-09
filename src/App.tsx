import { useState } from 'react';
import type { PageView } from './types';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleStartAnalysis = (file: File) => {
    setCurrentFile(file);
    setCurrentPage('analysis');
  };

  const handleReset = () => {
    setCurrentFile(null);
    setCurrentPage('home');
  };

  return (
    <div className="dark min-h-screen w-full bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white selection:bg-primary/30 flex flex-col">
      <Header 
        page={currentPage} 
        fileName={currentFile?.name || null} 
        onNavigate={setCurrentPage} 
      />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center w-full py-8 md:py-0">
        {currentPage === 'home' && <HomePage onStartAnalysis={handleStartAnalysis} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'analysis' && <AnalysisPage file={currentFile} onReset={handleReset} />}
      </main>
    </div>
  );
}