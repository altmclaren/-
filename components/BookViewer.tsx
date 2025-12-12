import React, { useState, useCallback } from 'react';

interface BookViewerProps {
  pages: string[];
  title: string;
}

export const BookViewer: React.FC<BookViewerProps> = ({ pages, title }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const handleNextPage = useCallback(() => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  }, [currentPage, pages.length, isFlipping]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  }, [currentPage, isFlipping]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNextPage();
    } else if (e.key === 'ArrowLeft') {
      handlePrevPage();
    }
  }, [handleNextPage, handlePrevPage]);

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <p>Нет страниц для отображения</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center w-full"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Book container */}
      <div className="relative w-full max-w-4xl perspective-1000">
        <div className="book-container relative h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden">
          {/* Current page */}
          <div
            className={`absolute inset-0 page-content transition-all duration-600 ${
              flipDirection === 'next' ? 'animate-flip-next' : ''
            } ${flipDirection === 'prev' ? 'animate-flip-prev' : ''}`}
          >
            <div className="h-full flex flex-col p-8">
              {/* Page content */}
              <div className="flex-1 overflow-auto text-slate-100 whitespace-pre-wrap">
                {pages[currentPage]}
              </div>

              {/* Page number */}
              <div className="text-center text-slate-500 text-sm mt-4">
                {currentPage + 1} / {pages.length}
              </div>
            </div>
          </div>

          {/* Page shadow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-700/50 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1 || isFlipping}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-700/50 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page progress bar */}
      <div className="w-full max-w-4xl mt-6">
        <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <p className="text-slate-500 text-sm mt-4">
        Используйте ← → для навигации
      </p>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes flip-next {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        @keyframes flip-prev {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        .animate-flip-next {
          animation: flip-next 0.6s ease-in-out;
          transform-style: preserve-3d;
        }

        .animate-flip-prev {
          animation: flip-prev 0.6s ease-in-out;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};
