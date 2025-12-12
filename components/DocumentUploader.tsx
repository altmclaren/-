import React, { useCallback } from 'react';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  }, [onUpload]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10 scale-105'
          : 'border-slate-600 hover:border-slate-500'
      }`}
    >
      <svg
        className="mx-auto h-12 w-12 text-slate-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-4">
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="mt-2 block text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            Выберите файл
          </span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".pdf,.txt,.jpg,.jpeg,.png,.gif"
            onChange={handleFileInput}
          />
        </label>
        <p className="mt-1 text-xs text-slate-400">
          или перетащите его сюда
        </p>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        PDF, TXT, JPG, PNG до 10MB
      </p>
    </div>
  );
};
