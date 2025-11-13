import { ContentAnalysis, ContentSuggestions } from '../types/analysis.types';

/**
 * Generate actionable suggestions to improve content engagement
 */
export class SuggestionEngine {
  /**
   * Generate comprehensive suggestions based on analysis
   */
  static generateSuggestions(analysis: ContentAnalysis): ContentSuggestions {
    const improvements = this.generateImprovements(analysis);
    const strengths = this.identifyStrengths(analysis);
    const hashtags = this.suggestHashtags(analysis);
    const callToAction = this.suggestCallToAction(analysis);
    const optimizations = this.suggestOptimizations(analysis);
    const overall = this.calculateOverallScore(analysis);

    return {
      overall,
      improvements,
      strengths,
      hashtags,
      callToAction,
      optimizations,
    };
  }

  /**
   * Calculate overall content quality score
   */
  private static calculateOverallScore(analysis: ContentAnalysis) {
    const scores = [
      analysis.readability.score,
      analysis.engagement.score,
      (analysis.sentiment.score + 1) * 50, // Convert -1 to 1 range to 0-100
    ];

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const score = Math.round(avgScore);

    let rating: ContentSuggestions['overall']['rating'];
    if (score >= 80) rating = 'Excellent';
    else if (score >= 65) rating = 'Good';
    else if (score >= 50) rating = 'Fair';
    else rating = 'Poor';

    return { score, rating };
  }

  /**
   * Generate improvement suggestions
   */
  private static generateImprovements(analysis: ContentAnalysis) {
    const improvements: ContentSuggestions['improvements'] = [];

    // Readability improvements
    if (analysis.readability.score < 60) {
      improvements.push({
        category: 'Critical',
        type: 'Readability',
        suggestion: `Your content is difficult to read (score: ${analysis.readability.score}/100). Use shorter sentences and simpler words to improve readability.`,
        impact: 'High',
      });
    }

    if (analysis.metrics.averageSentenceLength > 25) {
      improvements.push({
        category: 'Important',
        type: 'Readability',
        suggestion: `Your sentences are too long (avg: ${analysis.metrics.averageSentenceLength} words). Aim for 15-20 words per sentence for better engagement.`,
        impact: 'Medium',
      });
    }

    // Engagement improvements
    if (!analysis.engagement.factors.hasCallToAction) {
      improvements.push({
        category: 'Critical',
        type: 'Engagement',
        suggestion: 'Add a clear call-to-action (e.g., "Click to learn more", "Share your thoughts", "Subscribe for updates").',
        impact: 'High',
      });
    }

    if (!analysis.engagement.factors.hasQuestion) {
      improvements.push({
        category: 'Important',
        type: 'Engagement',
        suggestion: 'Ask a question to encourage audience interaction and comments.',
        impact: 'Medium',
      });
    }

    if (!analysis.engagement.factors.hasEmoji) {
      improvements.push({
        category: 'Optional',
        type: 'Engagement',
        suggestion: 'Consider adding relevant emojis to make your content more visually appealing and engaging.',
        impact: 'Low',
      });
    }

    if (!analysis.engagement.factors.hasHashtags) {
      improvements.push({
        category: 'Important',
        type: 'SEO',
        suggestion: 'Add relevant hashtags to increase discoverability and reach.',
        impact: 'High',
      });
    }

    if (!analysis.engagement.factors.hasNumbers) {
      improvements.push({
        category: 'Optional',
        type: 'Engagement',
        suggestion: 'Include specific numbers or statistics to add credibility and attract attention.',
        impact: 'Medium',
      });
    }

    // Length optimization
    if (analysis.metrics.wordCount < 50) {
      improvements.push({
        category: 'Important',
        type: 'Structure',
        suggestion: `Your content is too short (${analysis.metrics.wordCount} words). Aim for 50-300 words for optimal engagement.`,
        impact: 'High',
      });
    } else if (analysis.metrics.wordCount > 300) {
      improvements.push({
        category: 'Important',
        type: 'Structure',
        suggestion: `Your content is quite long (${analysis.metrics.wordCount} words). Consider breaking it into smaller chunks or using bullet points.`,
        impact: 'Medium',
      });
    }

    // Structure improvements
    if (!analysis.structure.hasIntro && analysis.metrics.wordCount > 100) {
      improvements.push({
        category: 'Important',
        type: 'Structure',
        suggestion: 'Add a strong opening paragraph to hook your readers immediately.',
        impact: 'Medium',
      });
    }

    if (analysis.structure.paragraphLengthVariation === 'Low' && analysis.metrics.paragraphCount > 2) {
      improvements.push({
        category: 'Optional',
        type: 'Structure',
        suggestion: 'Vary your paragraph lengths to create better visual rhythm and maintain reader interest.',
        impact: 'Low',
      });
    }

    // Sentiment improvements
    if (analysis.sentiment.label === 'Negative') {
      improvements.push({
        category: 'Important',
        type: 'Tone',
        suggestion: 'Your content has a negative tone. Consider using more positive language to increase engagement.',
        impact: 'High',
      });
    }

    return improvements.sort((a, b) => {
      const categoryOrder = { Critical: 0, Important: 1, Optional: 2 };
      return categoryOrder[a.category] - categoryOrder[b.category];
    });
  }

  /**
   * Identify content strengths
   */
  private static identifyStrengths(analysis: ContentAnalysis): string[] {
    const strengths: string[] = [];

    if (analysis.readability.score >= 70) {
      strengths.push(`Excellent readability (${analysis.readability.score}/100) - easy for your audience to understand`);
    }

    if (analysis.engagement.score >= 70) {
      strengths.push(`Strong engagement factors (${analysis.engagement.score}/100) - well-optimized for interaction`);
    }

    if (analysis.sentiment.label === 'Positive') {
      strengths.push('Positive tone that resonates well with audiences');
    }

    if (analysis.engagement.factors.hasCallToAction) {
      strengths.push('Clear call-to-action encourages reader response');
    }

    if (analysis.engagement.factors.hasQuestion) {
      strengths.push('Engaging questions promote audience interaction');
    }

    if (analysis.engagement.factors.hasHashtags) {
      strengths.push('Good use of hashtags for discoverability');
    }

    if (analysis.engagement.factors.optimalLength) {
      strengths.push('Optimal content length for social media engagement');
    }

    if (analysis.structure.hasIntro && analysis.structure.hasConclusion) {
      strengths.push('Well-structured with clear beginning and ending');
    }

    if (analysis.keywords.length >= 5) {
      strengths.push('Rich keyword variety enhances SEO value');
    }

    return strengths;
  }

  /**
   * Suggest hashtags
   */
  private static suggestHashtags(analysis: ContentAnalysis) {
    const recommended = [...analysis.hashtags.suggested];

    // Add trending/generic hashtags based on content type
    const trendy = [
      '#SocialMedia',
      '#ContentMarketing',
      '#DigitalMarketing',
      '#Engagement',
      '#Marketing',
    ];

    return {
      recommended: recommended.slice(0, 5),
      trendy: trendy.slice(0, 5),
    };
  }

  /**
   * Suggest call-to-actions
   */
  private static suggestCallToAction(analysis: ContentAnalysis) {
    const detected = analysis.engagement.factors.hasCallToAction;

    const suggestions = [
      'What do you think? Share your thoughts in the comments!',
      'Click the link to learn more about this topic.',
      'Follow us for more insights like this!',
      'Tag someone who needs to see this!',
      'Double tap if you agree! ❤️',
      'Save this post for later reference.',
      'Share this with your network!',
      'Join the conversation - comment below!',
    ];

    return {
      detected,
      suggestions: detected ? [] : suggestions.slice(0, 3),
    };
  }

  /**
   * Suggest content optimizations
   */
  private static suggestOptimizations(analysis: ContentAnalysis) {
    const optimizations: ContentSuggestions['optimizations'] = [];

    // Suggest breaking long sentences
    if (analysis.metrics.averageSentenceLength > 25) {
      optimizations.push({
        title: 'Break down long sentences',
        before: 'Long sentences with multiple clauses',
        after: 'Short, punchy sentences. One idea per sentence.',
        reason: 'Improves readability and keeps readers engaged',
      });
    }

    // Suggest adding power words
    if (analysis.sentiment.label === 'Neutral') {
      optimizations.push({
        title: 'Use power words',
        before: 'Good information about the product',
        after: 'Amazing insights that transform your strategy',
        reason: 'Power words create emotional connection and drive action',
      });
    }

    // Suggest adding specific numbers
    if (!analysis.engagement.factors.hasNumbers) {
      optimizations.push({
        title: 'Include specific numbers',
        before: 'Many people use this method',
        after: '87% of successful marketers use this proven method',
        reason: 'Numbers add credibility and attract attention',
      });
    }

    return optimizations;
  }
}
