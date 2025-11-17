import { GoogleGenerativeAI } from '@google/generative-ai';

const CURRENCY_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD'];

class APIKeyManager {
  private geminiKeys: string[];
  private currentGeminiIndex = 0;

  constructor() {
    this.geminiKeys = [
      process.env.GEMINI_API_KEY_1 || '',
      process.env.GEMINI_API_KEY_2 || ''
    ].filter(Boolean);
  }

  getNextGeminiKey(): string {
    if (this.geminiKeys.length === 0) throw new Error('No Gemini API keys available');
    const key = this.geminiKeys[this.currentGeminiIndex];
    this.currentGeminiIndex = (this.currentGeminiIndex + 1) % this.geminiKeys.length;
    return key;
  }
}

const keyManager = new APIKeyManager();

class RateLimiter {
  private lastRequestTime = 0;
  private minInterval = 2000; // 2 seconds between requests

  async wait() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

interface CollectedData {
  source_type: string;
  source_name: string;
  content: string;
  url: string;
  metadata: Record<string, any>;
}

async function callGeminiWithRetry(prompt: string, maxRetries = 1): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await rateLimiter.wait();
      
      const apiKey = keyManager.getNextGeminiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.3,
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );
      
      const generatePromise = model.generateContent(prompt).then(result => result.response.text());
      
      return await Promise.race([generatePromise, timeoutPromise]) as string;
    } catch (error: any) {
      console.error(`[v0] Gemini attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }
  
  throw new Error('All retry attempts failed');
}

export async function collectAllMarketData(): Promise<CollectedData[]> {
  console.log('[v0] Starting unified market data collection...');
  const allData: CollectedData[] = [];

  try {
    const promises = CURRENCY_PAIRS.map(async (pair) => {
      try {
        const prompt = `Search the web for the latest market intelligence on ${pair} in the past 6 hours.

Focus on:
1. Breaking news from major financial outlets
2. Social media sentiment from traders
3. Central bank statements or economic data
4. Unusual market movements

Return a JSON array (max 3 items) with this structure:
[
  {
    "source": "source name",
    "type": "news|social|economic|technical",
    "content": "brief description",
    "sentiment": "bullish|bearish|neutral",
    "confidence": 0.0-1.0,
    "timestamp": "ISO date"
  }
]

Only return the JSON array, no additional text.`;

        const response = await callGeminiWithRetry(prompt);
        
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const findings = JSON.parse(jsonMatch[0]);
          
          const items = findings.map((finding: any) => ({
            source_type: finding.type || 'news',
            source_name: finding.source || 'Gemini Search',
            content: `${pair}: ${finding.content}`,
            url: '',
            metadata: {
              pair,
              sentiment: finding.sentiment,
              confidence: finding.confidence,
              timestamp: finding.timestamp
            }
          }));
          
          console.log(`[v0] Collected ${items.length} signals for ${pair}`);
          return items;
        }
      } catch (error: any) {
        console.error(`[v0] Error collecting data for ${pair}:`, error.message);
      }
      return [];
    });

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allData.push(...result.value);
      }
    });

    console.log(`[v0] Collection complete: ${allData.length} total items`);
    return allData;
    
  } catch (error) {
    console.error('[v0] Unified collection error:', error);
    return allData;
  }
}
