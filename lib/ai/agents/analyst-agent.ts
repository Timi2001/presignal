/**
 * Agent 2: The Analyst
 * Deep pattern recognition and signal generation using Gemini 2.5 Flash
 */

import { keyManager } from '../api-key-manager';

interface AnalystResult {
  signalType: 'whisper' | 'signal' | 'context';
  category: 'sentiment' | 'narrative' | 'event' | 'technical' | 'meta';
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  predictedImpact: number;
  narrative: string;
  reasoning: string;
}

export async function runAnalystAgent(
  collectorResults: any[],
  historicalContext: string
): Promise<AnalystResult[]> {
  try {
    const geminiKey = keyManager.getGeminiKey();
    
    const prompt = `You are an expert forex market analyst with pattern recognition capabilities.

You have collected ${collectorResults.length} pieces of market intelligence. Analyze these for early market signals.

Recent Data Summary:
${collectorResults.map((r, i) => `${i+1}. ${r.quickSummary} (Sentiment: ${r.sentiment}, Anomaly: ${r.anomalyScore})`).join('\n')}

Historical Context:
${historicalContext}

Identify potential trading signals. For each signal:
1. Signal Type:
   - "whisper" (10min-2hr): Social sentiment spikes, coordination
   - "signal" (2-8hr): News convergence, narrative emergence  
   - "context" (8-48hr): Policy shifts, structural changes

2. Category: sentiment, narrative, event, technical, or meta
3. Direction: bullish, bearish, or neutral
4. Confidence: 0.0-1.0 (be conservative, only high confidence matters)
5. Predicted Impact: Expected % move (e.g., 0.5 for 0.5%)
6. Narrative: Concise explanation of what's happening
7. Reasoning: Why this matters for forex trading

Return array of signals in JSON format. Only return signals with confidence >= 0.5:
[
  {
    "signalType": "whisper|signal|context",
    "category": "sentiment|narrative|event|technical|meta",
    "direction": "bullish|bearish|neutral",
    "confidence": 0.75,
    "predictedImpact": 0.5,
    "narrative": "Brief description",
    "reasoning": "Why this matters"
  }
]

If no significant signals, return empty array [].`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[[\s\S]*\]/);
    const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    
    const signals = JSON.parse(jsonContent);
    
    console.log(`[v0] Analyst Agent generated ${signals.length} signals`);
    return signals;

  } catch (error) {
    console.error('[v0] Analyst Agent error:', error);
    return [];
  }
}
