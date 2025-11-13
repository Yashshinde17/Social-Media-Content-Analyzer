import { Router, Request, Response } from 'express';
import { JobStore } from '../services/job.store';

const router = Router();

/**
 * GET /api/jobs/:jobId
 * Get job status and result
 */
router.get('/:jobId', (req: Request, res: Response): void => {
  try {
    const { jobId } = req.params;

    const job = JobStore.getJob(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        error: 'Job not found',
        message: `No job found with ID: ${jobId}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job',
      message: error.message,
    });
  }
});

/**
 * GET /api/jobs
 * Get all jobs (for debugging)
 */
router.get('/', (_req: Request, res: Response): void => {
  try {
    const jobs = JobStore.getAllJobs();

    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs',
      message: error.message,
    });
  }
});

export default router;
