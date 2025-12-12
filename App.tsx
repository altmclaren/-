import React, { useState, useCallback } from 'react';
import { DocumentTabs, Document } from './components/DocumentTabs';
import { BookViewer } from './components/BookViewer';
import { DocumentUploader } from './components/DocumentUploader';
import { processDocument } from './services/documentProcessor';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setShowUploader(false);

    try {
      const document = await processDocument(file);
      setDocuments(prev => [...prev, document]);
      setActiveDocumentId(document.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSelectDocument = useCallback((id: string) => {
    setActiveDocumentId(id);
  }, []);

  const handleCloseDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const newDocs = prev.filter(doc => doc.id !== id);
      if (activeDocumentId === id) {
        setActiveDocumentId(newDocs.length > 0 ? newDocs[0].id : null);
      }
      return newDocs;
    });
  }, [activeDocumentId]);

  const handleAddDocument = useCallback(() => {
    setShowUploader(true);
  }, []);

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Просмотр Документов
        </h1>
        <p className="text-slate-400 mt-2">
          Загрузите документы и читайте их как настоящую книгу
        </p>
      </header>

      {/* Document Tabs */}
      {documents.length > 0 && (
        <div className="mb-6">
          <DocumentTabs
            documents={documents}
            activeDocumentId={activeDocumentId}
            onSelectDocument={handleSelectDocument}
            onCloseDocument={handleCloseDocument}
            onAddDocument={handleAddDocument}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {isUploading && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-slate-400">Обработка документа...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!isUploading && !activeDocument && !showUploader && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <svg
              className="w-24 h-24 text-slate-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">
              Нет открытых документов
            </h2>
            <p className="text-slate-400 mb-6">
              Загрузите документ, чтобы начать чтение
            </p>
            <button
              onClick={handleAddDocument}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              Загрузить документ
            </button>
          </div>
        )}

        {showUploader && !isUploading && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Загрузка документа</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <DocumentUploader onUpload={handleUpload} />
          </div>
        )}

        {!isUploading && activeDocument && !showUploader && (
          <BookViewer pages={activeDocument.pages} title={activeDocument.name} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>Поддерживаемые форматы: PDF, TXT, JPG, PNG</p>
      </footer>
    </div>
  );
};

export default App;
