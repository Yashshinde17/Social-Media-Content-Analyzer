import { Router, Request, Response } from 'express';
import { upload, getFileType } from '../middleware/upload.middleware';
import { UploadResponse, UploadedFile } from '../types/upload.types';
import { JobStore } from '../services/job.store';
import { ProcessingOrchestrator } from '../services/orchestrator.service';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * POST /api/upload
 * Upload a PDF or image file
 */
router.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
          message: 'Please provide a file to upload',
        } as UploadResponse);
        return;
      }

      const fileType = getFileType(req.file.mimetype);

      if (fileType === 'unknown') {
        res.status(400).json({
          success: false,
          error: 'Invalid file type',
          message: 'File type not supported',
        } as UploadResponse);
        return;
      }

      // Create uploaded file metadata
      const uploadedFile: UploadedFile = {
        id: uuidv4(),
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        fileType,
        uploadedAt: new Date().toISOString(),
      };

      // Create processing job
      const job = JobStore.createJob(
        uploadedFile.id,
        req.file.path,
        fileType
      );

      // Start processing asynchronously (don't await)
      ProcessingOrchestrator.processFile(
        job.id,
        req.file.path,
        fileType,
        'eng' // Default language
      ).catch((error) => {
        console.error('Background processing error:', error);
      });

      // In a production app, save this to a database
      // For now, we'll return it directly
      console.log('File uploaded successfully:', {
        id: uploadedFile.id,
        filename: uploadedFile.filename,
        type: fileType,
        size: `${(uploadedFile.size / 1024).toFixed(2)} KB`,
        jobId: job.id,
      });

      res.status(200).json({
        success: true,
        file: uploadedFile,
        jobId: job.id, // Include job ID for status tracking
        message: 'File uploaded successfully and processing started',
      } as UploadResponse);
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Upload failed',
        message: error.message || 'An error occurred during file upload',
      } as UploadResponse);
    }
  }
);

/**
 * GET /api/upload/info/:fileId
 * Get information about an uploaded file
 */
router.get('/info/:fileId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;

    // In production, fetch from database
    // For now, return a mock response
    res.status(200).json({
      success: true,
      message: 'File info endpoint - to be implemented with database',
      fileId,
    });
  } catch (error: any) {
    console.error('Error fetching file info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file info',
      message: error.message,
    });
  }
});

export default router;
