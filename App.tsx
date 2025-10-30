import React, { useState, useCallback, useRef } from 'react';
import { generateFortune } from './services/geminiService';
import { PredictionCard } from './components/PredictionCard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SparklesIcon, DownloadIcon } from './components/icons';

declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGeneratePrediction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsInitial(false);

    try {
      const { prediction: newPrediction, imageUrl: newImageUrl } = await generateFortune();
      setPrediction(newPrediction);
      setImageUrl(newImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
      setPrediction(null);
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    // Временно убираем эффект наведения, чтобы он не попал на скриншот
    const imageElement = cardRef.current.querySelector('img');
    imageElement?.classList.remove('hover:scale-105');

    try {
      const scale = window.devicePixelRatio || 2;
      const canvas = await window.html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#1e293b', // Фон карточки, для корректного JPEG
        scale: scale, // Увеличиваем разрешение для четкости
      });
      const link = document.createElement('a');
      link.download = 'prediction-card.jpeg';
      link.href = canvas.toDataURL('image/jpeg', 1.0); // Максимальное качество JPEG
      link.click();
    } catch (err) {
      console.error("Failed to download card:", err);
      setError("Не удалось скачать карточку. Попробуйте снова.");
    } finally {
       // Возвращаем эффект наведения
      imageElement?.classList.add('hover:scale-105');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center flex-grow justify-center">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Предсказание Дня
          </h1>
          <p className="text-slate-400 mt-2">Загляните в свое будущее одним нажатием кнопки</p>
        </header>
        
        <main className="w-full">
          {isLoading && <Loader />}
          {error && <ErrorDisplay message={error} />}
          
          <div ref={cardRef} className="transition-opacity duration-700 ease-in-out">
            {isInitial && !isLoading && !error && (
              <PredictionCard 
                prediction="Нажмите на волшебную кнопку ниже, чтобы узнать, что приготовил для вас сегодняшний день."
                imageUrl="https://picsum.photos/800/600?grayscale&blur=2"
              />
            )}
            {!isInitial && !isLoading && !error && prediction && imageUrl && (
              <PredictionCard prediction={prediction} imageUrl={imageUrl} />
            )}
          </div>
        </main>
      </div>

      <footer className="w-full max-w-2xl mx-auto pt-8 pb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGeneratePrediction}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-105 transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
          >
            <SparklesIcon />
            <span>{isLoading ? 'Генерируем...' : 'Получить предсказание'}</span>
          </button>
          
          {prediction && !isLoading && (
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <DownloadIcon />
              <span>Скачать</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;