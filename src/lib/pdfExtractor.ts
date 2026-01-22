import * as pdfjsLib from 'pdfjs-dist';

// Use jsdelivr CDN for worker - more reliable than unpkg
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface PDFExtractionResult {
  text: string;
  numPages: number;
  success: boolean;
  error?: string;
}

/**
 * Extract text content from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  try {
    console.log('📄 Starting PDF text extraction for:', file.name);
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`📊 PDF loaded: ${pdf.numPages} pages`);
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
      
      console.log(`✅ Extracted page ${pageNum}/${pdf.numPages}`);
    }
    
    // Clean up the text
    const cleanedText = fullText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .trim();
    
    console.log(`✅ PDF extraction complete: ${cleanedText.length} characters`);
    
    return {
      text: cleanedText,
      numPages: pdf.numPages,
      success: true
    };
    
  } catch (error) {
    console.error('❌ PDF extraction failed:', error);
    return {
      text: '',
      numPages: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Extract a preview (first N characters) from PDF text
 */
export function getTextPreview(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to cut at a sentence or word boundary
  const preview = text.substring(0, maxLength);
  const lastPeriod = preview.lastIndexOf('.');
  const lastSpace = preview.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.7) {
    return preview.substring(0, lastPeriod + 1);
  } else if (lastSpace > maxLength * 0.7) {
    return preview.substring(0, lastSpace) + '...';
  }
  
  return preview + '...';
}

