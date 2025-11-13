import axios, { AxiosProgressEvent } from 'axios';
import { UploadResponse, ProcessingJob } from '../types/upload.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percentCompleted);
          }
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.message || 'Upload failed');
  }
};

export const getFileInfo = async (fileId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/info/${fileId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch file info');
  }
};

export const getJobStatus = async (jobId: string): Promise<ProcessingJob> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
    if (response.data.success && response.data.job) {
      return response.data.job;
    }
    throw new Error('Job not found');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch job status');
  }
};
