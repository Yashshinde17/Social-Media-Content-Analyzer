import fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';
import path from 'path';

export interface PDFExtractionResult {
  success: boolean;
  text: string;
  metadata?: {
    pages: number;
    info?: any;
  };
  error?: string;
}

/**
 * Extract text from a PDF file
 * @param filePath - Absolute path to the PDF file
 * @returns Extraction result with text and metadata
 */
export async function extractTextFromPDF(
  filePath: string
): Promise<PDFExtractionResult> {
  try {
    // Read PDF file as buffer
    const dataBuffer = await fs.readFile(filePath);

    // Parse PDF - pdf-parse v1.1.1 exports as default
    const data = await (pdfParse as any)(dataBuffer);

    // Clean and format text
    const cleanedText = cleanText(data.text);

    return {
      success: true,
      text: cleanedText,
      metadata: {
        pages: data.numpages,
        info: data.info,
      },
    };
  } catch (error: any) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      text: '',
      error: error.message || 'Failed to extract text from PDF',
    };
  }
}

/**
 * Clean and format extracted text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
function cleanText(text: string): string {
  // Remove excessive whitespace while preserving paragraphs
  let cleaned = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  // Remove multiple consecutive newlines (keep max 2 for paragraph breaks)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Validate if file is a PDF
 * @param filePath - Path to the file
 * @returns True if file has .pdf extension
 */
export function isPDFFile(filePath: string): boolean {
  return path.extname(filePath).toLowerCase() === '.pdf';
}
