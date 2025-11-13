export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extractedText?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProcessingResult {
  fileId: string;
  extractedText: string;
  processingTime: number;
  method: 'pdf' | 'ocr';
}
