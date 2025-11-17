import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function collectTwitterSentiment() {
  const results = [];
  
  try {
    const geminiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2;
    
    if (!geminiKey) {
      console.log('[v0] Gemini API key not found, skipping Twitter sentiment');
      return results;
    }

    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'XAU/USD'];

    for (const pair of pairs) {
      try {
        const { text } = await generateText({
          model: google('gemini-2.0-flash-exp', {
            useSearchGrounding: true,
          }),
          prompt: `What is the current social media sentiment and discussion around ${pair} in the last 2 hours on Twitter, Reddit, and trading forums? Summarize in 2-3 sentences focusing on directional bias (bullish/bearish/neutral) and key reasons mentioned by traders.`,
          temperature: 0.3,
        });
        
        if (text) {
          results.push({
            source_type: 'twitter',
            source_name: 'Social Sentiment',
            content: `${pair} Social Sentiment: ${text}`,
            url: '',
            metadata: { 
              pair,
              timestamp: new Date().toISOString()
            }
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`[v0] Twitter sentiment error for ${pair}:`, error);
      }
    }

    console.log(`[v0] Twitter sentiment collected ${results.length} items via Gemini Search`);
  } catch (error) {
    console.error('[v0] Twitter collection error:', error);
  }

  return results;
}
