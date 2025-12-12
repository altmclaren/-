import { Document } from '../components/DocumentTabs';

const CHARS_PER_PAGE = 2000; // Characters per page for text documents

export const processDocument = async (file: File): Promise<Document> => {
  const fileType = file.type;
  const fileName = file.name;

  if (fileType.startsWith('image/')) {
    return processImageDocument(file, fileName);
  } else if (fileType === 'application/pdf') {
    return processPDFDocument(file, fileName);
  } else if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
    return processTextDocument(file, fileName);
  } else {
    throw new Error('Неподдерживаемый формат файла');
  }
};

const processImageDocument = async (file: File, fileName: string): Promise<Document> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      resolve({
        id: generateId(),
        name: fileName,
        type: 'image',
        pages: [`![${fileName}](${imageUrl})`], // Single page with image
      });
    };
    reader.onerror = () => reject(new Error('Ошибка чтения изображения'));
    reader.readAsDataURL(file);
  });
};

const processPDFDocument = async (file: File, fileName: string): Promise<Document> => {
  // For now, we'll create a placeholder for PDF
  // In a production app, you'd use pdf.js or similar library
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      // Simple PDF parsing - in real app use pdf.js
      const text = await extractTextFromPDF(arrayBuffer);
      const pages = splitTextIntoPages(text);

      resolve({
        id: generateId(),
        name: fileName,
        type: 'pdf',
        pages: pages.length > 0 ? pages : ['PDF документ загружен.\n\nСодержимое будет отображено здесь.'],
      });
    };
    reader.onerror = () => reject(new Error('Ошибка чтения PDF'));
    reader.readAsArrayBuffer(file);
  });
};

const processTextDocument = async (file: File, fileName: string): Promise<Document> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const pages = splitTextIntoPages(text);

      resolve({
        id: generateId(),
        name: fileName,
        type: 'text',
        pages: pages.length > 0 ? pages : ['Пустой документ'],
      });
    };
    reader.onerror = () => reject(new Error('Ошибка чтения текстового файла'));
    reader.readAsText(file);
  });
};

const splitTextIntoPages = (text: string): string[] => {
  const pages: string[] = [];
  let currentPage = '';
  const lines = text.split('\n');

  for (const line of lines) {
    if (currentPage.length + line.length > CHARS_PER_PAGE) {
      pages.push(currentPage);
      currentPage = line + '\n';
    } else {
      currentPage += line + '\n';
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  // Simplified PDF text extraction
  // In a real app, use pdf.js library for proper extraction
  const uint8Array = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  let text = decoder.decode(uint8Array);

  // Try to extract readable text (very basic)
  // Remove binary/control characters
  text = text.replace(/[^\x20-\x7E\n\r\t]/g, '');

  // If we got very little readable text, show a message
  if (text.length < 100) {
    return `PDF Документ: ${text.length} символов\n\nДля полноценного просмотра PDF используйте специализированную библиотеку.`;
  }

  return text;
};

const generateId = (): string => {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
