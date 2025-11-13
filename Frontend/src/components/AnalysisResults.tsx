import React from 'react';
import { ContentAnalysis, ContentSuggestions } from '../types/upload.types';
import './AnalysisResults.css';

interface AnalysisResultsProps {
  analysis: ContentAnalysis;
  suggestions: ContentSuggestions;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, suggestions }) => {
  const getProgressBarClass = (score: number) => {
    if (score >= 70) return '';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getSentimentIcon = (label: string) => {
    if (label === 'Positive') return '😊';
    if (label === 'Negative') return '😞';
    return '😐';
  };

  return (
    <div className="analysis-results">
      <div className="analysis-header">
        <h3 className="analysis-title">📊 Content Analysis & Suggestions</h3>
        <div className="overall-score">
          <div className="score-circle">
            <div className="score-value">{suggestions.overall.score}</div>
            <div className="score-label">Score</div>
          </div>
          <div className="rating-badge">{suggestions.overall.rating}</div>
        </div>
      </div>

      <div className="analysis-grid">
        {/* Metrics Card */}
        <div className="analysis-card">
          <h4 className="card-title">
            <span className="card-icon">📝</span>
            Content Metrics
          </h4>
          <div className="metric-row">
            <span className="metric-label">Words:</span>
            <span className="metric-value">{analysis.metrics.wordCount}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Sentences:</span>
            <span className="metric-value">{analysis.metrics.sentenceCount}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Paragraphs:</span>
            <span className="metric-value">{analysis.metrics.paragraphCount}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Reading Time:</span>
            <span className="metric-value">{analysis.metrics.readingTimeMinutes} min</span>
          </div>
        </div>

        {/* Readability Card */}
        <div className="analysis-card">
          <h4 className="card-title">
            <span className="card-icon">📖</span>
            Readability
          </h4>
          <div className="progress-bar-container">
            <div className="progress-label">
              <span>{analysis.readability.level}</span>
              <span>{analysis.readability.score}/100</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${getProgressBarClass(analysis.readability.score)}`}
                style={{ width: `${analysis.readability.score}%` }}
              />
            </div>
          </div>
          <div className="metric-row" style={{ marginTop: '1rem' }}>
            <span className="metric-label">Grade Level:</span>
            <span className="metric-value">{analysis.readability.gradeLevel}</span>
          </div>
        </div>

        {/* Engagement Card */}
        <div className="analysis-card">
          <h4 className="card-title">
            <span className="card-icon">🎯</span>
            Engagement
          </h4>
          <div className="progress-bar-container">
            <div className="progress-label">
              <span>Engagement Score</span>
              <span>{analysis.engagement.score}/100</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${getProgressBarClass(analysis.engagement.score)}`}
                style={{ width: `${analysis.engagement.score}%` }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            {analysis.engagement.factors.hasCallToAction && <div>✅ Has Call-to-Action</div>}
            {analysis.engagement.factors.hasQuestion && <div>✅ Has Questions</div>}
            {analysis.engagement.factors.hasHashtags && <div>✅ Has Hashtags</div>}
            {analysis.engagement.factors.hasEmoji && <div>✅ Has Emojis</div>}
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="analysis-card">
          <h4 className="card-title">
            <span className="card-icon">💭</span>
            Sentiment
          </h4>
          <div className="sentiment-indicator">
            <span className="sentiment-icon">{getSentimentIcon(analysis.sentiment.label)}</span>
            <span>{analysis.sentiment.label}</span>
          </div>
          <div className="metric-row" style={{ marginTop: '1rem' }}>
            <span className="metric-label">Confidence:</span>
            <span className="metric-value">{(analysis.sentiment.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Keywords Card */}
        <div className="analysis-card">
          <h4 className="card-title">
            <span className="card-icon">🔑</span>
            Top Keywords
          </h4>
          <div className="keywords-list">
            {analysis.keywords.slice(0, 8).map((keyword, index) => (
              <div key={index} className="keyword-tag">
                {keyword.word} ({keyword.count})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      {suggestions.improvements.length > 0 && (
        <div className="suggestions-section">
          <h4 className="suggestions-title">💡 Improvement Suggestions</h4>
          <div className="improvements-list">
            {suggestions.improvements.map((improvement, index) => (
              <div key={index} className={`improvement-item ${improvement.category.toLowerCase()}`}>
                <div className="improvement-header">
                  <span className="improvement-type">{improvement.type}</span>
                  <span className={`impact-badge ${improvement.impact.toLowerCase()}`}>
                    {improvement.impact} Impact
                  </span>
                </div>
                <p className="improvement-text">{improvement.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths Section */}
      {suggestions.strengths.length > 0 && (
        <div className="strengths-section">
          <h4>✨ Content Strengths</h4>
          <ul className="strengths-list">
            {suggestions.strengths.map((strength, index) => (
              <li key={index} className="strength-item">
                <span className="strength-icon">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hashtags Section */}
      {(suggestions.hashtags.recommended.length > 0 || suggestions.hashtags.trendy.length > 0) && (
        <div className="hashtags-section">
          <h4>🏷️ Suggested Hashtags</h4>
          <div className="hashtags-grid">
            {suggestions.hashtags.recommended.length > 0 && (
              <div className="hashtag-group">
                <h4>Based on Your Content:</h4>
                <div className="hashtag-list">
                  {suggestions.hashtags.recommended.map((tag, index) => (
                    <div key={index} className="hashtag">{tag}</div>
                  ))}
                </div>
              </div>
            )}
            {suggestions.hashtags.trendy.length > 0 && (
              <div className="hashtag-group">
                <h4>Trending:</h4>
                <div className="hashtag-list">
                  {suggestions.hashtags.trendy.map((tag, index) => (
                    <div key={index} className="hashtag">{tag}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call-to-Action Section */}
      {!suggestions.callToAction.detected && suggestions.callToAction.suggestions.length > 0 && (
        <div className="cta-section">
          <h4>📢 Call-to-Action Suggestions</h4>
          <ul className="cta-suggestions">
            {suggestions.callToAction.suggestions.map((cta, index) => (
              <li key={index} className="cta-suggestion">{cta}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
