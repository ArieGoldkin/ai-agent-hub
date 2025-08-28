/**
 * Decision Quality Tracking Module
 * 
 * Tracks decision quality, confidence scores, and trends over time.
 */

import type { SessionContext, DecisionRecord } from '../types/context.js';

/**
 * Calculate confidence trend from decision history
 */
export function calculateConfidenceTrend(decisions: DecisionRecord[]): string {
  if (decisions.length < 3) return 'insufficient-data';
  
  const recent = decisions.slice(-3);
  const earlier = decisions.slice(-6, -3);
  
  if (earlier.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, d) => sum + d.confidence, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum, d) => sum + d.confidence, 0) / earlier.length;
  
  const diff = recentAvg - earlierAvg;
  if (diff > 0.1) return 'improving';
  if (diff < -0.1) return 'declining';
  return 'stable';
}

/**
 * Generate quality improvement recommendations
 */
export function generateQualityRecommendations(avgQuality: number, trend: string): string[] {
  const recommendations: string[] = [];
  
  if (avgQuality < 0.6) {
    recommendations.push('Focus on improving decision confidence through better context');
  }
  
  if (trend === 'declining') {
    recommendations.push('Review recent decisions to identify quality issues');
  }
  
  if (avgQuality > 0.8 && trend === 'improving') {
    recommendations.push('Excellent decision quality - maintain current practices');
  }
  
  return recommendations;
}

/**
 * Track decision quality and confidence scores
 */
export function trackDecisionQuality(context: SessionContext): { 
  averageQuality: number; 
  confidenceTrend: string; 
  recommendations: string[] 
} {
  const decisions = context.decisionHistory;
  if (decisions.length === 0) {
    return { 
      averageQuality: 0, 
      confidenceTrend: 'insufficient-data', 
      recommendations: ['Add more decision entries to enable quality tracking'] 
    };
  }

  const avgQuality = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length;
  const trend = calculateConfidenceTrend(decisions);
  const recommendations = generateQualityRecommendations(avgQuality, trend);

  return {
    averageQuality: avgQuality,
    confidenceTrend: trend,
    recommendations
  };
}