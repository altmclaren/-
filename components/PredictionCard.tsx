
import React from 'react';

interface PredictionCardProps {
  prediction: string;
  imageUrl: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, imageUrl }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-fade-in w-full">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={imageUrl} 
          alt="Тематическое изображение для предсказания" 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6 sm:p-8">
        <blockquote className="border-l-4 border-indigo-500 pl-4">
          <p className="text-lg sm:text-xl text-slate-200 italic leading-relaxed">
            {prediction}
          </p>
        </blockquote>
      </div>
    </div>
  );
};

// Add keyframes for animation in a style tag, as we can't use external CSS files.
// This is a common workaround when strictly avoiding .css files.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.7s ease-out forwards;
}
`;
document.head.appendChild(style);
