import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function collectNewsArticles() {
  const results = [];
  
  try {
    const geminiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2;
    
    if (!geminiKey) {
      console.log('[v0] Gemini API key not found, skipping news');
      return results;
    }

    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'XAU/USD'];

    for (const pair of pairs) {
      try {
        const { text } = await generateText({
          model: google('gemini-2.0-flash-exp', {
            useSearchGrounding: true,
          }),
          prompt: `What are the top 2-3 breaking news stories in the last 4 hours that could impact ${pair}? Include central bank announcements, economic data releases, or geopolitical events. Be brief, factual, and cite sources if possible.`,
          temperature: 0.2,
        });
        
        if (text) {
          results.push({
            source_type: 'news',
            source_name: 'Breaking News',
            content: `${pair} Latest News: ${text}`,
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
        console.error(`[v0] News error for ${pair}:`, error);
      }
    }

    console.log(`[v0] News collected ${results.length} items via Gemini Search`);
  } catch (error) {
    console.error('[v0] News collection error:', error);
  }

  return results;
}
