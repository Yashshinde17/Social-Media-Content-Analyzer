import { ContentAnalysis } from '../types/analysis.types';

/**
 * Analyze text content for social media optimization
 */
export class ContentAnalyzer {
  /**
   * Perform comprehensive content analysis
   */
  static analyze(text: string): ContentAnalysis {
    const metrics = this.calculateMetrics(text);
    const readability = this.calculateReadability(text, metrics);
    const sentiment = this.analyzeSentiment(text);
    const keywords = this.extractKeywords(text);
    const hashtags = this.analyzeHashtags(text);
    const engagement = this.analyzeEngagement(text);
    const structure = this.analyzeStructure(text);

    return {
      text,
      metrics,
      readability,
      sentiment,
      keywords,
      hashtags,
      engagement,
      structure,
    };
  }

  /**
   * Calculate basic text metrics
   */
  private static calculateMetrics(text: string) {
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;

    const averageWordLength = wordCount > 0
      ? words.reduce((sum, word) => sum + word.length, 0) / wordCount
      : 0;

    const averageSentenceLength = sentenceCount > 0
      ? wordCount / sentenceCount
      : 0;

    // Average reading speed: 200 words per minute
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    return {
      characterCount: characters,
      wordCount,
      sentenceCount,
      paragraphCount,
      averageWordLength: Math.round(averageWordLength * 10) / 10,
      averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
      readingTimeMinutes,
    };
  }

  /**
   * Calculate readability score (Flesch Reading Ease)
   */
  private static calculateReadability(text: string, metrics: any) {
    const { wordCount, sentenceCount, characterCount } = metrics;

    if (sentenceCount === 0 || wordCount === 0) {
      return {
        score: 0,
        level: 'Very Difficult' as const,
        gradeLevel: 16,
      };
    }

    const avgSentenceLength = wordCount / sentenceCount;
    const avgSyllablesPerWord = this.estimateSyllables(text) / wordCount;

    // Flesch Reading Ease formula
    let score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

    // Determine level
    let level: ContentAnalysis['readability']['level'];
    let gradeLevel: number;

    if (score >= 90) {
      level = 'Very Easy';
      gradeLevel = 5;
    } else if (score >= 80) {
      level = 'Easy';
      gradeLevel = 6;
    } else if (score >= 70) {
      level = 'Moderate';
      gradeLevel = 8;
    } else if (score >= 60) {
      level = 'Moderate';
      gradeLevel = 10;
    } else if (score >= 50) {
      level = 'Difficult';
      gradeLevel = 12;
    } else {
      level = 'Very Difficult';
      gradeLevel = 16;
    }

    return {
      score: Math.round(score),
      level,
      gradeLevel,
    };
  }

  /**
   * Estimate syllable count (simple heuristic)
   */
  private static estimateSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;

    for (const word of words) {
      if (word.length <= 3) {
        syllables += 1;
      } else {
        const vowels = word.match(/[aeiouy]+/g);
        syllables += vowels ? vowels.length : 1;
      }
    }

    return syllables;
  }

  /**
   * Analyze sentiment (simple rule-based)
   */
  private static analyzeSentiment(text: string) {
    const lowerText = text.toLowerCase();

    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'love', 'best', 'awesome', 'perfect', 'happy', 'success', 'win',
      'beautiful', 'brilliant', 'exciting', 'enjoy', 'delighted'
    ];

    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor',
      'fail', 'failure', 'disappointed', 'wrong', 'problem', 'issue',
      'difficult', 'hard', 'sad', 'angry', 'frustrating'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const score = totalSentimentWords > 0
      ? (positiveCount - negativeCount) / totalSentimentWords
      : 0;

    let label: ContentAnalysis['sentiment']['label'];
    if (score > 0.1) label = 'Positive';
    else if (score < -0.1) label = 'Negative';
    else label = 'Neutral';

    const confidence = totalSentimentWords > 0
      ? Math.min(totalSentimentWords / 10, 1)
      : 0.5;

    return {
      score: Math.round(score * 100) / 100,
      label,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  /**
   * Extract important keywords
   */
  private static extractKeywords(text: string) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
      'can', 'could', 'may', 'might', 'must', 'this', 'that', 'these', 'those'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    const keywords = Array.from(wordFreq.entries())
      .map(([word, count]) => ({
        word,
        count,
        relevance: Math.min(count / words.length * 100, 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return keywords;
  }

  /**
   * Analyze hashtags
   */
  private static analyzeHashtags(text: string) {
    const existingHashtags = text.match(/#\w+/g) || [];
    const existing = existingHashtags.map(tag => tag.toLowerCase());

    // Generate suggested hashtags based on keywords
    const keywords = this.extractKeywords(text);
    const suggested = keywords
      .slice(0, 5)
      .map(k => `#${k.word}`)
      .filter(tag => !existing.includes(tag.toLowerCase()));

    return {
      existing: Array.from(new Set(existing)),
      suggested,
    };
  }

  /**
   * Analyze engagement factors
   */
  private static analyzeEngagement(text: string) {
    const factors = {
      hasCallToAction: /\b(click|subscribe|follow|share|comment|like|buy|download|join|register|sign up|learn more|get started|try now|shop now)\b/i.test(text),
      hasQuestion: /\?/.test(text),
      hasEmoji: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u.test(text),
      hasHashtags: /#\w+/.test(text),
      hasNumbers: /\d+/.test(text),
      hasURL: /https?:\/\/\S+/.test(text),
      optimalLength: text.split(/\s+/).length >= 50 && text.split(/\s+/).length <= 300,
    };

    const trueCount = Object.values(factors).filter(Boolean).length;
    const score = Math.round((trueCount / Object.keys(factors).length) * 100);

    return {
      score,
      factors,
    };
  }

  /**
   * Analyze content structure
   */
  private static analyzeStructure(text: string) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);

    const hasIntro = paragraphs.length > 0 && paragraphLengths[0] > 10;
    const hasBody = paragraphs.length > 1;
    const hasConclusion = paragraphs.length > 2 && paragraphLengths[paragraphLengths.length - 1] > 10;

    // Calculate variation in paragraph lengths
    const avgLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
    const variance = paragraphLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / paragraphLengths.length;
    const stdDev = Math.sqrt(variance);

    let paragraphLengthVariation: ContentAnalysis['structure']['paragraphLengthVariation'];
    if (stdDev < 10) paragraphLengthVariation = 'Low';
    else if (stdDev < 30) paragraphLengthVariation = 'Medium';
    else paragraphLengthVariation = 'High';

    return {
      hasIntro,
      hasBody,
      hasConclusion,
      paragraphLengthVariation,
    };
  }
}
