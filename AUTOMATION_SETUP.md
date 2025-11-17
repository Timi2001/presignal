# Automation Setup Guide

Your Market Intelligence System runs automatically using **GitHub Actions** (free, every 30 minutes).

## Architecture

Since Vercel Hobby tier only supports daily cron jobs, we use **GitHub Actions** exclusively for automation:

- Every 30 minutes: Data collection + AI processing
- Every 2 hours: Signal validation
- Every Sunday: Weekly learning analysis

**Why GitHub Actions?**
- Completely FREE (2000 minutes/month included)
- Supports any schedule frequency
- No Vercel Pro upgrade needed ($20/month saved)
- Reliable execution with workflow logs

## Setup Steps

### 1. Environment Variables

Add these to your Vercel project (Settings > Environment Variables):

\`\`\`bash
# AI API Keys (already added)
GEMINI_API_KEY_1=your_key_here
GEMINI_API_KEY_2=your_key_here
GROQ_API_KEY_1=your_key_here
GROQ_API_KEY_2=your_key_here
PERPLEXITY_API_KEY=your_key_here

# Email for alerts (already added)
ALERT_EMAIL=your_email@example.com

# Cron secret (NEW - add this)
CRON_SECRET=your_random_secret_here

# App URL (NEW - add this)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

**Generate CRON_SECRET**: Visit `/generate-secret` in your deployed app or use browser console:
\`\`\`javascript
console.log(btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))))
\`\`\`

### 2. GitHub Secrets

Add these to your GitHub repository (Settings > Secrets and variables > Actions):

\`\`\`bash
VERCEL_APP_URL=https://your-app.vercel.app
CRON_SECRET=same_secret_as_vercel
\`\`\`

### 3. Push to GitHub

\`\`\`bash
git add .
git commit -m "Setup automation"
git push origin main
\`\`\`

GitHub Actions will automatically:
- Activate on push
- Start running every 30 minutes
- Trigger your Vercel API endpoints
- Show execution logs in Actions tab

### 4. Verify Automation

**Check GitHub Actions**:
1. Go to your GitHub repository
2. Click "Actions" tab
3. See 3 workflows:
   - "Market Intelligence - Data Collection" (every 30 min)
   - "Market Intelligence - Signal Validation" (every 2 hours)
   - "Market Intelligence - Weekly Learning" (Sundays)

**Check Vercel Logs**:
1. Go to your Vercel project dashboard
2. Click "Logs" tab
3. Filter by function name to see API executions

**Manual Testing**:
- Visit `/admin` to manually trigger collection/processing
- Check dashboard for new signals appearing

## How It Works

### Every 30 Minutes
1. GitHub Actions triggers at `:00` and `:30`
2. Calls `/api/cron/collect` with CRON_SECRET auth
3. System collects data from all 7 currency pairs using Gemini
4. Collector Agent (Groq) analyzes sentiment
5. Analyst Agent (Gemini) generates signals
6. Oracle Agent (Perplexity) validates high-confidence signals
7. Signals stored in database
8. Dashboard updates automatically

### Every 2 Hours
1. GitHub Actions triggers at `:00` of even hours
2. Calls `/api/cron/validate` with CRON_SECRET auth
3. System checks if predictions were accurate
4. Updates signal outcomes (true positive, false positive, pending)
5. Adjusts source credibility weights

### Weekly (Sunday at Midnight UTC)
1. GitHub Actions triggers every Sunday
2. Calls `/api/cron/weekly-learning` with CRON_SECRET auth
3. Learner Agent (Gemini Thinking) analyzes week's performance
4. Identifies patterns in successful/failed signals
5. Suggests improvements to detection logic
6. Stores meta-analysis in learning_metrics

## Monitoring

**Dashboard** (`/`): See live signals, learning stats, source performance

**Admin Panel** (`/admin`): Manual triggers, system status, logs

**GitHub Actions Logs**: Repository > Actions > Click any workflow run

**Email Alerts**: High-confidence signals (>0.8) sent to ALERT_EMAIL

## Troubleshooting

**Actions not running**:
- Check CRON_SECRET matches in both Vercel and GitHub
- Verify VERCEL_APP_URL in GitHub secrets is correct
- Ensure workflows are enabled (Actions tab > enable workflows)

**No signals appearing**:
- Check GitHub Actions logs for errors
- Check Vercel function logs for errors
- Verify API keys are valid
- Test manually from `/admin`

**Rate limits**:
- System uses 2 API keys per provider (Gemini, Groq)
- Automatic key rotation prevents limits
- 2-second delays between requests

**GitHub Actions quota**:
- Free tier: 2000 minutes/month
- Each collection run: ~2-3 minutes
- Daily usage: ~144 minutes (48 runs × 3 min)
- Monthly usage: ~4320 minutes
- **Solution if exceeded**: Reduce frequency to hourly (still free)

## Cost Analysis

**100% FREE**:
- Vercel: Hobby plan (no cron jobs needed)
- Supabase: 500MB database (free)
- GitHub Actions: 2000 minutes/month (free) - may need hourly frequency
- Gemini: 15 requests/min (free)
- Groq: 30 requests/min (free)
- Perplexity: Used sparingly for validations only

**Optional**: Reduce GitHub Actions runs to hourly if quota exceeded (still completely free)

## Workflow Files

Three GitHub Actions workflows are configured:

1. `.github/workflows/data-collection.yml` - Every 30 minutes
2. `.github/workflows/validation.yml` - Every 2 hours
3. `.github/workflows/weekly-learning.yml` - Weekly on Sunday

All workflows call Vercel API endpoints with CRON_SECRET authentication.

## Next Steps

1. ✅ Vercel crons removed (not needed on Hobby tier)
2. ⏳ Add CRON_SECRET to Vercel environment variables
3. ⏳ Add NEXT_PUBLIC_APP_URL to Vercel
4. ⏳ Add GitHub secrets (VERCEL_APP_URL, CRON_SECRET)
5. ⏳ Push to GitHub - automation activates automatically
6. ⏳ Monitor GitHub Actions tab for first run (within 30 minutes)

Your system is now fully autonomous and will continuously learn and improve - all on free tiers!
