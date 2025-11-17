/**
 * API Key Manager with Round-Robin Rotation
 * Manages multiple API keys to avoid rate limits
 */

class APIKeyManager {
  private geminiKeys: string[];
  private groqKeys: string[];
  private geminiIndex: number = 0;
  private groqIndex: number = 0;

  constructor() {
    this.geminiKeys = [
      process.env.GEMINI_API_KEY_1 || '',
      process.env.GEMINI_API_KEY_2 || ''
    ].filter(key => key.length > 0);

    this.groqKeys = [
      process.env.GROQ_API_KEY_1 || '',
      process.env.GROQ_API_KEY_2 || ''
    ].filter(key => key.length > 0);

    if (this.geminiKeys.length === 0) {
      console.warn('[v0] No Gemini API keys configured');
    }
    if (this.groqKeys.length === 0) {
      console.warn('[v0] No Groq API keys configured');
    }
  }

  getGeminiKey(): string {
    if (this.geminiKeys.length === 0) {
      throw new Error('No Gemini API keys available');
    }
    const key = this.geminiKeys[this.geminiIndex];
    this.geminiIndex = (this.geminiIndex + 1) % this.geminiKeys.length;
    return key;
  }

  getGroqKey(): string {
    if (this.groqKeys.length === 0) {
      throw new Error('No Groq API keys available');
    }
    const key = this.groqKeys[this.groqIndex];
    this.groqIndex = (this.groqIndex + 1) % this.groqKeys.length;
    return key;
  }

  getPerplexityKey(): string {
    const key = process.env.PERPLEXITY_API_KEY || '';
    if (!key) {
      throw new Error('Perplexity API key not configured');
    }
    return key;
  }
}

export const keyManager = new APIKeyManager();
