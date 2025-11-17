/**
 * Agent 1: The Collector
 * Fast sentiment classification and keyword extraction using Groq
 */

import { keyManager } from '../api-key-manager';

interface CollectorResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  relevantPairs: string[];
  anomalyScore: number; // 0-1, higher = more unusual
  quickSummary: string;
}

export async function runCollectorAgent(content: string): Promise<CollectorResult> {
  try {
    const groqKey = keyManager.getGroqKey();
    
    const prompt = `You are a forex market intelligence analyst. Analyze this content for forex trading signals.

Content:
${content.substring(0, 2000)}

Extract:
1. Sentiment (positive/bullish, negative/bearish, or neutral)
2. Key forex-related keywords (currencies, central banks, economic terms)
3. Relevant currency pairs mentioned (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, XAU/USD)
4. Anomaly score (0-1): How unusual or urgent is this content?
5. One-sentence summary

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "keywords": ["keyword1", "keyword2"],
  "relevantPairs": ["EUR/USD", "GBP/USD"],
  "anomalyScore": 0.7,
  "quickSummary": "..."
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a forex market analyst. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove \`\`\`json or \`\`\` wrapper if present
    if (content.startsWith('\`\`\`')) {
      content = content.replace(/^\`\`\`(?:json)?\n?/, '').replace(/\n?\`\`\`$/, '').trim();
    }
    
    const result = JSON.parse(content);
    
    console.log('[v0] Collector Agent processed content');
    return result;

  } catch (error) {
    console.error('[v0] Collector Agent error:', error);
    // Return default neutral result on error
    return {
      sentiment: 'neutral',
      keywords: [],
      relevantPairs: [],
      anomalyScore: 0,
      quickSummary: 'Error processing content'
    };
  }
}
