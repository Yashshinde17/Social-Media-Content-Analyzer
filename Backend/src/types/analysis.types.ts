export interface ContentAnalysis {
  text: string;
  metrics: {
    characterCount: number;
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordLength: number;
    averageSentenceLength: number;
    readingTimeMinutes: number;
  };
  readability: {
    score: number; // 0-100, higher is easier to read
    level: 'Very Easy' | 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult';
    gradeLevel: number;
  };
  sentiment: {
    score: number; // -1 (negative) to 1 (positive)
    label: 'Negative' | 'Neutral' | 'Positive';
    confidence: number;
  };
  keywords: {
    word: string;
    count: number;
    relevance: number;
  }[];
  hashtags: {
    existing: string[];
    suggested: string[];
  };
  engagement: {
    score: number; // 0-100
    factors: {
      hasCallToAction: boolean;
      hasQuestion: boolean;
      hasEmoji: boolean;
      hasHashtags: boolean;
      hasNumbers: boolean;
      hasURL: boolean;
      optimalLength: boolean;
    };
  };
  structure: {
    hasIntro: boolean;
    hasBody: boolean;
    hasConclusion: boolean;
    paragraphLengthVariation: 'Low' | 'Medium' | 'High';
  };
}

export interface ContentSuggestions {
  overall: {
    score: number; // 0-100
    rating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  };
  improvements: {
    category: 'Critical' | 'Important' | 'Optional';
    type: 'Readability' | 'Engagement' | 'SEO' | 'Structure' | 'Tone';
    suggestion: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  strengths: string[];
  hashtags: {
    recommended: string[];
    trendy: string[];
  };
  callToAction: {
    detected: boolean;
    suggestions: string[];
  };
  optimizations: {
    title: string;
    before: string;
    after: string;
    reason: string;
  }[];
}
