import { Router, Request, Response } from 'express';
import { ContentAnalyzer } from '../services/analyzer.service';
import { SuggestionEngine } from '../services/suggestion.service';

const router = Router();

/**
 * POST /api/analyze
 * Analyze text content and provide suggestions
 * Body: { text: string }
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Missing or invalid text parameter',
        message: 'Please provide text content to analyze',
      });
      return;
    }

    if (text.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Empty text',
        message: 'Please provide non-empty text content',
      });
      return;
    }

    // Perform analysis
    console.log(`Analyzing text (${text.length} characters)...`);
    const analysis = ContentAnalyzer.analyze(text);
    const suggestions = SuggestionEngine.generateSuggestions(analysis);

    res.status(200).json({
      success: true,
      data: {
        analysis,
        suggestions,
      },
      message: 'Content analyzed successfully',
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error.message || 'An error occurred during content analysis',
    });
  }
});

export default router;
