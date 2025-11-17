# Data Collection System

This system collects data from multiple sources every 30 minutes using GitHub Actions.

## Data Sources

1. **RSS Feeds** - Bloomberg, Reuters, FT, WSJ, BBC, CNN Business
2. **Reddit** - r/Forex, r/wallstreetbets, r/investing, r/economics
3. **Twitter** - Forex influencers and hashtags (requires implementation)
4. **YouTube** - Forex analysis channels
5. **Google Trends** - Currency pair search trends
6. **TradingView** - Trending forex trading ideas
7. **Central Banks** - Fed, ECB, BoE, BoJ statements

## Setup

### Local Testing

1. Install Python dependencies:
\`\`\`bash
pip install feedparser requests beautifulsoup4 pytrends
\`\`\`

2. Run collection manually:
\`\`\`bash
cd scripts
python run_collection.py
\`\`\`

### GitHub Actions Setup

1. Add secrets in GitHub repository settings:
   - `YOUTUBE_API_KEY` - Optional YouTube Data API key
   - `VERCEL_API_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)

2. The workflow runs automatically every 30 minutes

3. Manual trigger: Go to Actions tab → Data Collection → Run workflow

## API Endpoint

Data is sent to `/api/ingest` which stores it in Supabase for AI processing.

## Adding New Sources

1. Create a new collector in `scripts/collectors/`
2. Add import and call in `scripts/run_collection.py`
3. Test locally before deploying
