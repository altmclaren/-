import React from 'react';

export interface Document {
  id: string;
  name: string;
  pages: string[];
  type: 'text' | 'image' | 'pdf';
}

interface DocumentTabsProps {
  documents: Document[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onCloseDocument: (id: string) => void;
  onAddDocument: () => void;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  documents,
  activeDocumentId,
  onSelectDocument,
  onCloseDocument,
  onAddDocument,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`group relative flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-all min-w-max ${
            doc.id === activeDocumentId
              ? 'bg-slate-800 text-white shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => onSelectDocument(doc.id)}
        >
          {/* Document icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {doc.type === 'pdf' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            ) : doc.type === 'image' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            )}
          </svg>

          {/* Document name */}
          <span className="text-sm font-medium max-w-[150px] truncate">
            {doc.name}
          </span>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseDocument(doc.id);
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-600 rounded p-1"
            aria-label={`Close ${doc.name}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {/* Add document button */}
      <button
        onClick={onAddDocument}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-t-lg transition-all min-w-max"
        aria-label="Add document"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="text-sm font-medium">Добавить документ</span>
      </button>
    </div>
  );
};
