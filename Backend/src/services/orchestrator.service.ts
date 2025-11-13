import { JobStore } from './job.store';
import { extractTextFromPDF } from './pdf.service';
import { extractTextFromImage } from './ocr.service';
import { ContentAnalyzer } from './analyzer.service';
import { SuggestionEngine } from './suggestion.service';
import { ProcessingJob } from '../types/upload.types';

export class ProcessingOrchestrator {
  /**
   * Start processing a file (async)
   * @param jobId - Job ID
   * @param filePath - Path to the uploaded file
   * @param fileType - Type of file ('pdf' or 'image')
   * @param language - Language code for OCR (optional)
   */
  static async processFile(
    jobId: string,
    filePath: string,
    fileType: 'pdf' | 'image',
    language: string = 'eng'
  ): Promise<void> {
    // Update job status to processing
    JobStore.updateJobStatus(jobId, 'processing');

    try {
      if (fileType === 'pdf') {
        // Process PDF
        const result = await extractTextFromPDF(filePath);

        if (result.success) {
          // Analyze content
          const analysis = ContentAnalyzer.analyze(result.text);
          const suggestions = SuggestionEngine.generateSuggestions(analysis);

          JobStore.updateJobStatus(jobId, 'completed', {
            text: result.text,
            metadata: result.metadata,
            analysis,
            suggestions,
          });
        } else {
          JobStore.updateJobStatus(
            jobId,
            'failed',
            undefined,
            result.error || 'PDF extraction failed'
          );
        }
      } else {
        // Process image with OCR
        const result = await extractTextFromImage(filePath, language);

        if (result.success) {
          // Analyze content
          const analysis = ContentAnalyzer.analyze(result.text);
          const suggestions = SuggestionEngine.generateSuggestions(analysis);

          JobStore.updateJobStatus(jobId, 'completed', {
            text: result.text,
            metadata: {
              confidence: result.confidence,
              ...result.metadata,
            },
            analysis,
            suggestions,
          });
        } else {
          JobStore.updateJobStatus(
            jobId,
            'failed',
            undefined,
            result.error || 'OCR extraction failed'
          );
        }
      }
    } catch (error: any) {
      console.error('Processing error:', error);
      JobStore.updateJobStatus(
        jobId,
        'failed',
        undefined,
        error.message || 'An unexpected error occurred'
      );
    }
  }

  /**
   * Get job status and result
   */
  static getJobStatus(jobId: string): ProcessingJob | null {
    return JobStore.getJob(jobId);
  }
}
