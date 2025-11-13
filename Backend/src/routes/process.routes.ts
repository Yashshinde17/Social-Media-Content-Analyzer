import { Router, Request, Response } from 'express';
import { extractTextFromPDF } from '../services/pdf.service';
import { extractTextFromImage } from '../services/ocr.service';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

/**
 * POST /api/process/pdf
 * Extract text from an uploaded PDF file
 * Body: { filePath: string }
 */
router.post('/pdf', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      res.status(400).json({
        success: false,
        error: 'Missing filePath parameter',
        message: 'Please provide the file path to process',
      });
      return;
    }

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'The specified file does not exist',
      });
      return;
    }

    // Extract text from PDF
    console.log('Processing PDF:', filePath);
    const result = await extractTextFromPDF(filePath);

    if (!result.success) {
      res.status(500).json({
        success: false,
        error: 'Extraction failed',
        message: result.error || 'Failed to extract text from PDF',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        text: result.text,
        metadata: result.metadata,
      },
      message: 'Text extracted successfully',
    });
  } catch (error: any) {
    console.error('PDF processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Processing failed',
      message: error.message || 'An error occurred while processing the PDF',
    });
  }
});

/**
 * POST /api/process/extract
 * Extract text from a file (auto-detect type)
 * Body: { filePath: string, fileType: 'pdf' | 'image' }
 */
router.post('/extract', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, fileType } = req.body;

    if (!filePath || !fileType) {
      res.status(400).json({
        success: false,
        error: 'Missing parameters',
        message: 'Please provide filePath and fileType',
      });
      return;
    }

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'The specified file does not exist',
      });
      return;
    }

    if (fileType === 'pdf') {
      const result = await extractTextFromPDF(filePath);

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: 'Extraction failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        fileType: 'pdf',
        data: {
          text: result.text,
          metadata: result.metadata,
        },
      });
    } else if (fileType === 'image') {
      // Extract language parameter (default: 'eng')
      const language = req.body.language || 'eng';
      const result = await extractTextFromImage(filePath, language);

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: 'OCR failed',
          message: result.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        fileType: 'image',
        data: {
          text: result.text,
          confidence: result.confidence,
          metadata: result.metadata,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid file type',
        message: 'Supported types: pdf, image',
      });
    }
  } catch (error: any) {
    console.error('Processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Processing failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/process/ocr
 * Extract text from an image using OCR
 * Body: { filePath: string, language?: string }
 */
router.post('/ocr', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, language = 'eng' } = req.body;

    if (!filePath) {
      res.status(400).json({
        success: false,
        error: 'Missing filePath parameter',
        message: 'Please provide the file path to process',
      });
      return;
    }

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'The specified file does not exist',
      });
      return;
    }

    // Extract text from image
    console.log('Processing image with OCR:', filePath, 'Language:', language);
    const result = await extractTextFromImage(filePath, language);

    if (!result.success) {
      res.status(500).json({
        success: false,
        error: 'OCR failed',
        message: result.error || 'Failed to extract text from image',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        text: result.text,
        confidence: result.confidence,
        metadata: result.metadata,
      },
      message: 'Text extracted successfully using OCR',
    });
  } catch (error: any) {
    console.error('OCR processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Processing failed',
      message: error.message || 'An error occurred while processing the image',
    });
  }
});

export default router;
