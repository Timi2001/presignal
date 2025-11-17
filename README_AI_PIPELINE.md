# Multi-Agent AI Pipeline

## Architecture

The system uses 4 AI agents working together:

### Agent 1: The Collector (Groq)
- **Model**: Llama 3.3 70B
- **Speed**: Ultra-fast (~1s per item)
- **Task**: Quick sentiment classification, keyword extraction, anomaly detection
- **Output**: Structured data for Analyst

### Agent 2: The Analyst (Gemini 2.5 Flash)
- **Model**: Gemini 2.0 Flash Experimental
- **Task**: Deep pattern recognition, signal generation, confidence scoring
- **Output**: Trading signals with reasoning

### Agent 3: The Oracle (Perplexity)
- **Model**: Sonar
- **Task**: Real-time web validation, evidence gathering
- **Output**: Validated signals with supporting/contradicting evidence

### Agent 4: The Learner (Gemini Thinking)
- **Model**: Gemini 2.0 Flash Thinking
- **Task**: Weekly meta-analysis, source weight updates, improvement suggestions
- **Output**: Learning metrics and system improvements

## API Keys Required

Add these to your Vercel project environment variables:

\`\`\`
GEMINI_API_KEY_1=your_key_1
GEMINI_API_KEY_2=your_key_2
GROQ_API_KEY_1=your_key_1
GROQ_API_KEY_2=your_key_2
PERPLEXITY_API_KEY=your_key
\`\`\`

## Flow

1. **Data Collection** (GitHub Actions every 30 min)
   → Stores raw data in Supabase

2. **AI Processing** (GitHub Actions 5 min after collection)
   → GET /api/trigger-analysis
   → POST /api/process
   → Multi-agent pipeline runs:
     - Collector: Fast analysis
     - Analyst: Signal generation
     - Oracle: High-confidence validation
   → Signals saved to database

3. **Dashboard Display**
   → Real-time signal feed updates
   → User sees new signals immediately

## Manual Testing

Trigger processing manually:
\`\`\`bash
curl https://your-app.vercel.app/api/trigger-analysis
\`\`\`

## Rate Limits

- **Groq**: 30 req/min (free) - Using 2 keys = 60 req/min
- **Gemini**: 15 req/min (free) - Using 2 keys = 30 req/min  
- **Perplexity**: 50 req/day (free tier) - Only for high-confidence signals

Round-robin rotation prevents rate limit issues.
\`\`\`
