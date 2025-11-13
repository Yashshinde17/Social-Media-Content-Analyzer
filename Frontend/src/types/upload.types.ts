export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
}

export interface UploadResponse {
  success: boolean;
  file?: UploadedFile;
  jobId?: string;
  error?: string;
  message?: string;
}

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
    score: number;
    level: 'Very Easy' | 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult';
    gradeLevel: number;
  };
  sentiment: {
    score: number;
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
    score: number;
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
    score: number;
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

export interface ProcessingJob {
  id: string;
  fileId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'pdf' | 'ocr';
  result?: {
    text: string;
    metadata?: any;
    analysis?: ContentAnalysis;
    suggestions?: ContentSuggestions;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedFile: UploadedFile | null;
  jobId: string | null;
  jobStatus: ProcessingJob | null;
  isProcessing: boolean;
}
