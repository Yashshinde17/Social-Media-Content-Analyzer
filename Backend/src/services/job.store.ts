import { ProcessingJob } from '../types/upload.types';
import { v4 as uuidv4 } from 'uuid';

// In-memory job store (in production, use a database)
const jobs = new Map<string, ProcessingJob>();

export class JobStore {
  /**
   * Create a new processing job
   */
  static createJob(
    fileId: string,
    filePath: string,
    fileType: 'pdf' | 'image'
  ): ProcessingJob {
    const job: ProcessingJob = {
      id: uuidv4(),
      fileId,
      status: 'pending',
      type: fileType === 'pdf' ? 'pdf' : 'ocr',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jobs.set(job.id, job);
    console.log(`Job created: ${job.id} for file: ${fileId}`);
    return job;
  }

  /**
   * Update job status
   */
  static updateJobStatus(
    jobId: string,
    status: ProcessingJob['status'],
    result?: ProcessingJob['result'],
    error?: string
  ): ProcessingJob | null {
    const job = jobs.get(jobId);
    if (!job) return null;

    job.status = status;
    job.updatedAt = new Date().toISOString();

    if (result) {
      job.result = result;
    }

    if (error) {
      job.error = error;
    }

    jobs.set(jobId, job);
    console.log(`Job updated: ${jobId} - Status: ${status}`);
    return job;
  }

  /**
   * Get job by ID
   */
  static getJob(jobId: string): ProcessingJob | null {
    return jobs.get(jobId) || null;
  }

  /**
   * Get all jobs for a file
   */
  static getJobsByFileId(fileId: string): ProcessingJob[] {
    return Array.from(jobs.values()).filter((job) => job.fileId === fileId);
  }

  /**
   * Delete a job
   */
  static deleteJob(jobId: string): boolean {
    return jobs.delete(jobId);
  }

  /**
   * Get all jobs
   */
  static getAllJobs(): ProcessingJob[] {
    return Array.from(jobs.values());
  }

  /**
   * Clear all jobs (for testing)
   */
  static clearAll(): void {
    jobs.clear();
  }
}
