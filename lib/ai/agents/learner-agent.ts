/**
 * Agent 4: The Learner
 * Weekly meta-analysis using Gemini 2.5 Flash Thinking
 */

import { keyManager } from '../api-key-manager';

interface LearnerResult {
  accuracyRate: number;
  bestSources: Array<{ source: string; accuracy: number }>;
  worstSources: Array<{ source: string; accuracy: number }>;
  keywordEffectiveness: Record<string, number>;
  improvements: string[];
  insights: string;
}

export async function runLearnerAgent(
  weeklySignals: any[],
  sourcePerformance: any[]
): Promise<LearnerResult> {
  try {
    const geminiKey = keyManager.getGeminiKey();
    
    const prompt = `You are the meta-learning system for a forex intelligence platform.

Analyze this week's performance:

Total Signals: ${weeklySignals.length}
True Positives: ${weeklySignals.filter(s => s.validation_status === 'true_positive').length}
False Positives: ${weeklySignals.filter(s => s.validation_status === 'false_positive').length}

Source Performance:
${sourcePerformance.map(s => `${s.name}: ${s.accuracy.toFixed(2)} accuracy (${s.total_signals} signals)`).join('\n')}

Tasks:
1. Calculate overall accuracy rate
2. Identify best performing sources (top 3)
3. Identify worst performing sources (bottom 3)
4. Analyze keyword effectiveness (which keywords led to true positives?)
5. Suggest 3-5 specific improvements for next week
6. Provide strategic insights about market patterns

Respond in JSON:
{
  "accuracyRate": 0.65,
  "bestSources": [{"source": "name", "accuracy": 0.85}],
  "worstSources": [{"source": "name", "accuracy": 0.35}],
  "keywordEffectiveness": {"fed": 0.8, "ecb": 0.65},
  "improvements": ["improvement1", "improvement2"],
  "insights": "Strategic analysis..."
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 3000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Thinking API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    
    const result = JSON.parse(jsonContent);
    
    console.log('[v0] Learner Agent completed meta-analysis');
    return result;

  } catch (error) {
    console.error('[v0] Learner Agent error:', error);
    return {
      accuracyRate: 0,
      bestSources: [],
      worstSources: [],
      keywordEffectiveness: {},
      improvements: ['Error analyzing performance'],
      insights: 'Meta-analysis unavailable'
    };
  }
}
