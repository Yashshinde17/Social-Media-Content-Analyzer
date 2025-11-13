import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { uploadFile, getJobStatus } from '../services/upload.service';
import { UploadState } from '../types/upload.types';
import AnalysisResults from './AnalysisResults';
import './FileUpload.css';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff',
  'image/bmp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedFile: null,
    jobId: null,
    jobStatus: null,
    isProcessing: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload PDF or image files (JPEG, PNG, TIFF, BMP).`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }

    return null;
  };

  // Poll job status
  const pollJobStatus = async (jobId: string) => {
    try {
      const job = await getJobStatus(jobId);
      
      setUploadState((prev) => ({
        ...prev,
        jobStatus: job,
        isProcessing: job.status === 'pending' || job.status === 'processing',
      }));

      // Stop polling if job is complete or failed
      if (job.status === 'completed' || job.status === 'failed') {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } catch (error: any) {
      console.error('Error polling job status:', error);
    }
  };

  // Start polling when jobId changes
  useEffect(() => {
    if (uploadState.jobId && uploadState.isProcessing) {
      // Initial poll
      pollJobStatus(uploadState.jobId);
      
      // Poll every 2 seconds
      pollingIntervalRef.current = window.setInterval(() => {
        if (uploadState.jobId) {
          pollJobStatus(uploadState.jobId);
        }
      }, 2000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [uploadState.jobId, uploadState.isProcessing]);

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: validationError,
        uploadedFile: null,
        jobId: null,
        jobStatus: null,
        isProcessing: false,
      });
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      uploadedFile: null,
      jobId: null,
      jobStatus: null,
      isProcessing: false,
    });

    try {
      const response = await uploadFile(file, (progress) => {
        setUploadState((prev) => ({
          ...prev,
          progress,
        }));
      });

      if (response.success && response.file) {
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          uploadedFile: response.file,
          jobId: response.jobId || null,
          jobStatus: null,
          isProcessing: !!response.jobId,
        });
      } else {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: response.error || 'Upload failed',
          uploadedFile: null,
          jobId: null,
          jobStatus: null,
          isProcessing: false,
        });
      }
    } catch (error: any) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || 'An unexpected error occurred',
        uploadedFile: null,
        jobId: null,
        jobStatus: null,
        isProcessing: false,
      });
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedFile: null,
      jobId: null,
      jobStatus: null,
      isProcessing: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clear polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Document</h2>

      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''} ${
          uploadState.isUploading ? 'disabled' : ''
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="upload-icon">📄</div>
        <p className="drop-text">
          {dragActive
            ? 'Drop your file here'
            : 'Drag and drop your file here'}
        </p>
        <p className="drop-hint">
          Supported formats: PDF, JPEG, PNG, TIFF, BMP (Max 10MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
          onChange={handleChange}
          disabled={uploadState.isUploading}
        />
        <button
          className="upload-button"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
          disabled={uploadState.isUploading}
        >
          {uploadState.isUploading ? 'Uploading...' : 'Choose File'}
        </button>
      </div>

      {uploadState.isUploading && (
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
          <p className="progress-text">
            Uploading: {uploadState.progress}%
          </p>
        </div>
      )}

      {uploadState.error && (
        <div className="message error">
          <strong>Error:</strong> {uploadState.error}
        </div>
      )}

      {uploadState.uploadedFile && (
        <div className="file-preview">
          <h3 className="file-preview-title">✅ Upload Successful</h3>
          <div className="file-details">
            <div className="file-detail">
              <span className="file-detail-label">File Name:</span>
              <span className="file-detail-value">
                {uploadState.uploadedFile.originalName}
              </span>
            </div>
            <div className="file-detail">
              <span className="file-detail-label">Type:</span>
              <span
                className={`file-type-badge ${uploadState.uploadedFile.fileType}`}
              >
                {uploadState.uploadedFile.fileType}
              </span>
            </div>
            <div className="file-detail">
              <span className="file-detail-label">Size:</span>
              <span className="file-detail-value">
                {formatFileSize(uploadState.uploadedFile.size)}
              </span>
            </div>
            <div className="file-detail">
              <span className="file-detail-label">Upload ID:</span>
              <span className="file-detail-value">
                {uploadState.uploadedFile.id}
              </span>
            </div>
          </div>

          {/* Processing Status */}
          {uploadState.isProcessing && (
            <div className="message" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af' }}>
              <strong>⏳ Processing:</strong> Extracting text from your document...
            </div>
          )}

          {/* Processing Complete */}
          {uploadState.jobStatus?.status === 'completed' && uploadState.jobStatus.result && (
            <>
              <div className="message success">
                <strong>✅ Processing Complete!</strong> Text extracted successfully.
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px', maxHeight: '300px', overflow: 'auto' }}>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Extracted Text:</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                    {uploadState.jobStatus.result.text || 'No text found'}
                  </pre>
                  {uploadState.jobStatus.result.metadata?.confidence && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                      Confidence: {uploadState.jobStatus.result.metadata.confidence.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>

              {/* Display Analysis Results */}
              {uploadState.jobStatus.result.analysis && uploadState.jobStatus.result.suggestions && (
                <AnalysisResults
                  analysis={uploadState.jobStatus.result.analysis}
                  suggestions={uploadState.jobStatus.result.suggestions}
                />
              )}
            </>
          )}

          {/* Processing Failed */}
          {uploadState.jobStatus?.status === 'failed' && (
            <div className="message error">
              <strong>❌ Processing Failed:</strong> {uploadState.jobStatus.error || 'An error occurred during text extraction'}
            </div>
          )}

          <button className="reset-button" onClick={handleReset}>
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
