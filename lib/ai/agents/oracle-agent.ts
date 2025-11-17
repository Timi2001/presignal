/**
 * Agent 3: The Oracle
 * Deep-dive validation using Perplexity real-time search
 */

import { keyManager } from '../api-key-manager';

interface OracleResult {
  validated: boolean;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  contextualInsights: string;
  confidenceAdjustment: number; // -0.3 to +0.3
}

export async function runOracleAgent(
  signal: any
): Promise<OracleResult> {
  try {
    const perplexityKey = keyManager.getPerplexityKey();
    
    const searchQuery = `${signal.narrative} forex trading impact currency market`;
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a forex market research assistant. Provide factual, sourced information about currency market impacts.'
          },
          {
            role: 'user',
            content: `Research this forex market signal: "${signal.narrative}". 
            
Is this signal valid? Find:
1. Supporting evidence (recent events, data confirming this)
2. Contradicting evidence (factors that argue against this)
3. Contextual insights (broader market context)
4. Confidence adjustment (-0.3 to +0.3 based on findings)

Respond in JSON:
{
  "validated": true/false,
  "supportingEvidence": ["point1", "point2"],
  "contradictingEvidence": ["point1"],
  "contextualInsights": "...",
  "confidenceAdjustment": 0.1
}`
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      console.warn('[v0] Perplexity API error, skipping validation');
      return {
        validated: false,
        supportingEvidence: [],
        contradictingEvidence: [],
        contextualInsights: 'Validation unavailable',
        confidenceAdjustment: 0
      };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      console.log('[v0] Oracle Agent validated signal');
      return result;
    }
    
    return {
      validated: true,
      supportingEvidence: [content.substring(0, 200)],
      contradictingEvidence: [],
      contextualInsights: content.substring(0, 300),
      confidenceAdjustment: 0
    };

  } catch (error) {
    console.error('[v0] Oracle Agent error:', error);
    return {
      validated: false,
      supportingEvidence: [],
      contradictingEvidence: [],
      contextualInsights: 'Validation error',
      confidenceAdjustment: 0
    };
  }
}
