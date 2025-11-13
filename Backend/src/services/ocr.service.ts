import { createWorker, Worker } from 'tesseract.js';
import path from 'path';

export interface OCRExtractionResult {
  success: boolean;
  text: string;
  confidence?: number;
  metadata?: {
    language: string;
    blocks?: number;
  };
  error?: string;
}

// Global worker instance (reused for better performance)
let worker: Worker | null = null;

/**
 * Initialize Tesseract worker
 * @param language - Language code (default: 'eng')
 */
async function initializeWorker(language: string = 'eng'): Promise<Worker> {
  if (!worker) {
    console.log('Initializing Tesseract worker...');
    worker = await createWorker(language);
    console.log('Tesseract worker initialized');
  }
  return worker;
}

/**
 * Extract text from an image file using OCR
 * @param filePath - Absolute path to the image file
 * @param language - Language code (default: 'eng')
 * @returns Extraction result with text and confidence score
 */
export async function extractTextFromImage(
  filePath: string,
  language: string = 'eng'
): Promise<OCRExtractionResult> {
  try {
    // Initialize worker
    const tesseractWorker = await initializeWorker(language);

    console.log('Processing image with OCR:', filePath);

    // Perform OCR
    const { data } = await tesseractWorker.recognize(filePath);

    // Clean and format text
    const cleanedText = cleanText(data.text);

    return {
      success: true,
      text: cleanedText,
      confidence: data.confidence,
      metadata: {
        language,
        blocks: data.blocks?.length || 0,
      },
    };
  } catch (error: any) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      text: '',
      error: error.message || 'Failed to extract text from image',
    };
  }
}

/**
 * Clean and format extracted text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
function cleanText(text: string): string {
  // Remove excessive whitespace while preserving line breaks
  let cleaned = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  // Remove multiple consecutive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Terminate the Tesseract worker (call on server shutdown)
 */
export async function terminateWorker(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
    console.log('Tesseract worker terminated');
  }
}

/**
 * Validate if file is an image
 * @param filePath - Path to the file
 * @returns True if file has image extension
 */
export function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext);
}
