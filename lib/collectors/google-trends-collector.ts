import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function collectGoogleTrends() {
  const results = [];
  
  try {
    const geminiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2;
    
    if (!geminiKey) {
      console.log('[v0] Gemini API key not found, skipping trends');
      return results;
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp', {
        useSearchGrounding: true,
      }),
      prompt: `What are the top 5 trending topics RIGHT NOW (in the last 4 hours) related to forex, currency markets, EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, and gold (XAU/USD)? Include topics about central banks (Fed, ECB, BoE, BoJ), economic data releases, and geopolitical events affecting currencies. 
      
Return ONLY a JSON array of objects with "topic" and "relevance" fields. Example: [{"topic": "Fed rate decision", "relevance": "EUR/USD, USD/JPY"}]`,
      temperature: 0.2,
    });
    
    try {
      const trends = JSON.parse(text);
      
      for (const trend of trends.slice(0, 5)) {
        results.push({
          source_type: 'google_trends',
          source_name: 'Market Trends',
          content: `Trending now: ${trend.topic} (${trend.relevance})`,
          url: '',
          metadata: { 
            topic: trend.topic,
            relevance: trend.relevance,
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (parseError) {
      console.log('[v0] Could not parse trends JSON, trying plain text');
      // If JSON parsing fails, store as plain text
      results.push({
        source_type: 'google_trends',
        source_name: 'Market Trends',
        content: text,
        url: '',
        metadata: { 
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`[v0] Trends collected ${results.length} topics via Gemini Search`);
  } catch (error) {
    console.error('[v0] Trends collection error:', error);
  }

  return results;
}
