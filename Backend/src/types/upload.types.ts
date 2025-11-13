import { ContentAnalysis, ContentSuggestions } from './analysis.types';

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
}

export interface UploadResponse {
  success: boolean;
  file?: UploadedFile;
  jobId?: string;
  error?: string;
  message?: string;
}

export interface ProcessingJob {
  id: string;
  fileId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'pdf' | 'ocr';
  result?: {
    text: string;
    metadata?: any;
    analysis?: ContentAnalysis;
    suggestions?: ContentSuggestions;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}
