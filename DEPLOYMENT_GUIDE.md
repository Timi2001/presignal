# Deployment Guide - Real-Time Market Intelligence System

## Current Status ✅
- ✅ Database created (Supabase)
- ✅ API keys added
- ✅ SQL scripts executed
- 🔄 Ready for testing

## Next Steps

### 1. Test the System Locally

Visit the admin panel to manually test each component:
- Navigate to `/admin` in your browser
- Click "Trigger Collection" (will show placeholder response)
- Click "Trigger Processing" to test AI pipeline
- Click "Trigger Validation" to test validation logic
- Click "Trigger Learning" to test learning system

### 2. Set Up GitHub Actions (For 30-min Automation)

**a. Create GitHub Repository:**
\`\`\`bash
# Push your code to GitHub
git init
git add .
git commit -m "Initial commit: Market Intelligence System"
git remote add origin YOUR_REPO_URL
git push -u origin main
\`\`\`

**b. Add GitHub Secrets:**
Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `VERCEL_API_URL` = Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- `SUPABASE_URL` = (from Vercel env vars)
- `SUPABASE_SERVICE_ROLE_KEY` = (from Vercel env vars)
- `YOUTUBE_API_KEY` = (optional, for YouTube scraping)

**c. Enable GitHub Actions:**
- Go to your repo → Actions tab
- You'll see workflows: `data-collection.yml`, `ai-processing.yml`, `validation.yml`, `weekly-learning.yml`
- Enable them by clicking "I understand my workflows, go ahead and enable them"

**d. Verify Automation:**
- Data collection runs every 30 minutes
- AI processing runs every 30 minutes (after collection)
- Validation runs every 2 hours
- Learning runs every Sunday at midnight

### 3. Set Up Email Alerts

Add this environment variable in Vercel:
- `ALERT_EMAIL` = your-email@example.com

High-confidence signals (≥0.7) will be emailed to you automatically.

### 4. Monitor System Health

**Dashboard:** Visit `/` to see live intelligence feed
**Admin Panel:** Visit `/admin` to manually trigger components
**Logs:** Check Vercel logs for API routes and GitHub Actions logs for workflows

### 5. Python Environment (For GitHub Actions)

The GitHub Actions workflows automatically install required Python packages:
- `beautifulsoup4` - Web scraping
- `requests` - HTTP requests
- `praw` - Reddit API
- `google-api-python-client` - YouTube API
- `pytrends` - Google Trends
- `tweepy` or `snscrape` - Twitter scraping

No local Python setup needed - runs in GitHub Actions cloud.

## Troubleshooting

### No Signals Appearing?
1. Check Supabase dashboard - verify tables have data
2. Visit `/admin` and trigger collection + processing manually
3. Check Vercel function logs for errors

### GitHub Actions Failing?
1. Verify all secrets are added correctly
2. Check Actions tab for error logs
3. Ensure `VERCEL_API_URL` is correct (no trailing slash)

### API Rate Limits?
- System uses 2 Groq keys and 2 Gemini keys with rotation
- Perplexity Pro has high limits (falling back to free tier after 1 month)
- Reddit API: 100 req/min (sufficient for 30-min intervals)
- YouTube API: 10K units/day (sufficient)

## Architecture Summary

**Every 30 Minutes:**
1. GitHub Actions runs Python scrapers
2. Scrapers collect data from RSS, Reddit, YouTube, TradingView, etc.
3. Data sent to `/api/ingest` endpoint
4. Stored in `raw_data_collection` table
5. GitHub Actions triggers `/api/process`
6. AI agents analyze data (Groq + Gemini + Perplexity)
7. Signals generated and stored
8. Dashboard updates in real-time

**Every 2 Hours:**
- Validation system checks signal accuracy
- Updates outcomes (true positive, false positive, pending)

**Weekly:**
- Learner agent analyzes overall accuracy
- Updates source credibility weights
- System improves over time

## Cost Breakdown (All Free Tiers)

- Supabase: 500MB free (✅)
- Vercel: Hobby plan, 100GB bandwidth (✅)
- GitHub Actions: 2000 min/month free (✅)
- Groq: Free tier, generous limits (✅)
- Gemini: Free tier, 15 req/min (✅)
- Perplexity: Pro for 1 month, then free (✅)

**Total Cost: $0/month** 🎉

## Next Phase: Enhancements

After system is stable:
- Add more currency pairs
- Expand to crypto markets
- Add advanced chart visualizations
- Create mobile app
- Add Telegram/Discord alerts
- Implement more sophisticated ML models
