# Real-Time Market Intelligence System

An AI-powered intelligence hub that detects forex market shifts before they happen by analyzing real-time data from multiple sources across the internet.

## Overview

This system processes information from RSS feeds (Bloomberg, Reuters, FT, WSJ), Reddit, News, Google Trends, and more to generate early market signals for 7 major currency pairs including gold. It runs automatically every 30 minutes using GitHub Actions and continuously learns from its predictions.

### Key Features

- **Multi-Agent AI Pipeline**: Groq (fast analysis) + Gemini 2.5 Flash (pattern recognition) + Perplexity (validation)
- **Multi-Layer Detection**: Catches signals at 3 time horizons (10min-2hr, 2-8hr, 8-48hr)
- **Self-Improving System**: Reinforcement learning that tracks accuracy and updates source credibility
- **Real-Time Dashboard**: Live signal feed with confidence scores and learning metrics
- **Fully Automated**: Runs every 30 minutes via GitHub Actions
- **Zero Cost**: Runs entirely on free tiers (Supabase, GitHub Actions)

## Quick Start

### 1. Run Database Scripts

Execute in Supabase SQL Editor (in order):

\`\`\`sql
-- Create all tables
scripts/001_create_tables.sql

-- Fix data sources schema
scripts/004_fix_data_sources.sql

-- Remove mock data before going live
scripts/005_remove_mock_data.sql
\`\`\`

### 2. Environment Variables

Add to Vercel (most already configured):

\`\`\`bash
# AI API Keys
GEMINI_API_KEY_1=
GEMINI_API_KEY_2=
GROQ_API_KEY_1=
GROQ_API_KEY_2=
PERPLEXITY_API_KEY=

# Email alerts
ALERT_EMAIL=your_email@example.com

# Cron security (NEW - required for automation)
CRON_SECRET=generate_random_secret_here

# App URL (NEW - required for automation)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

**Generate CRON_SECRET**: `openssl rand -base64 32`

### 3. GitHub Secrets

Add to Repository Settings > Secrets:

\`\`\`bash
VERCEL_APP_URL=https://your-app.vercel.app
CRON_SECRET=same_as_vercel
\`\`\`

### 4. Deploy & Activate

\`\`\`bash
git push origin main
# GitHub Actions auto-deploys and triggers automation
\`\`\`

### 5. Verify Automation

- Check GitHub Actions for triggers
- Visit `/admin` to manually test
- Visit `/` to see live signals

## Architecture

### Data Flow

\`\`\`
Every 30 minutes:
1. GitHub Actions triggers /api/cron/collect
2. Unified Collector (Gemini) scrapes all sources
3. Collector Agent (Groq) analyzes sentiment
4. Analyst Agent (Gemini) generates signals
5. Oracle Agent (Perplexity) validates high-confidence signals
6. Signals stored in Supabase
7. Dashboard updates in real-time

Every 2 hours:
- GitHub Actions triggers /api/cron/validate
- System checks prediction accuracy
- Updates source credibility weights

Weekly (Sunday):
- GitHub Actions triggers /api/cron/weekly-learning
- Learner Agent analyzes patterns
- Suggests detection improvements
\`\`\`

### AI Agents

1. **Collector Agent** (Groq) - Fast sentiment classification, keyword extraction
2. **Analyst Agent** (Gemini 2.5 Flash) - Pattern recognition, signal generation
3. **Oracle Agent** (Perplexity) - Real-time validation of high-confidence signals
4. **Learner Agent** (Gemini 2.5 Flash Thinking) - Weekly meta-analysis, weight updates

### Database Schema

- `currency_pairs` - 7 major pairs including gold
- `data_sources` - All sources with credibility scores (weight-based learning)
- `signals` - Generated signals with confidence, keywords, narrative
- `signal_outcomes` - Validation results (true/false positive)
- `raw_data_collection` - Scraped data from all sources
- `learning_metrics` - Weekly accuracy tracking
- `alert_history` - High-confidence signal alerts

## Currency Pairs Tracked

1. EUR/USD - Euro / US Dollar
2. GBP/USD - British Pound / US Dollar
3. USD/JPY - US Dollar / Japanese Yen
4. USD/CHF - US Dollar / Swiss Franc
5. AUD/USD - Australian Dollar / US Dollar
6. USD/CAD - US Dollar / Canadian Dollar
7. XAU/USD - Gold / US Dollar

## Data Sources

### Implemented Sources
- **RSS Feeds**: Bloomberg, Reuters, Financial Times, Wall Street Journal
- **Reddit**: r/Forex, r/wallstreetbets, r/economics
- **News**: Real-time forex news via Gemini with Google Search
- **Google Trends**: Trending currency topics via Gemini
- **Social Sentiment**: Twitter/X sentiment via Gemini

All data collection uses **Gemini 2.5 Flash with Google Search grounding** to avoid scraping blocks and get real-time web data.

### Signal Categories

- **Sentiment Signals**: Sudden shifts, influencer alignment
- **Narrative Signals**: Emerging keywords, cross-platform convergence
- **Event Signals**: Economic calendar, central bank tone changes
- **Technical Signals**: Market momentum, cross-asset correlations
- **Meta Signals**: Multiple weak signals aligning = strong signal

## Learning System

### How It Works

1. **Signal Generation**: AI predicts direction and impact for each currency pair
2. **Market Validation**: Checks actual price movements at 2hr, 8hr, 24hr intervals
3. **Outcome Classification**:
   - ✅ True Positive: Correct direction + meaningful move (≥0.4% for pairs, ≥0.7% for gold)
   - ❌ False Positive: Wrong direction or no meaningful move
   - ⏳ Pending: Still within validation window
4. **Weight Adjustment**:
   - Source credibility increases with accuracy (+0.05 per true positive, max 2.0)
   - Decreases with failures (-0.10 per false positive, min 0.3)
5. **Weekly Meta-Analysis**: Learner Agent identifies patterns and suggests improvements

## Dashboard Pages

**Main Dashboard** (`/`):
- Live signal feed with confidence scores
- 7 currency pair cards with real-time sentiment
- Multi-layer timeline (whispers, signals, context)
- Source performance tracking
- Learning statistics showing improvement over time
- System status indicator

**Admin Panel** (`/admin`):
- Manual trigger buttons for testing
- System logs and status
- Collection/processing controls
- Validation testing

## Automation Setup

See `AUTOMATION_SETUP.md` for complete guide.

**Quick Summary**:
- GitHub Actions: Runs every 30 minutes, 2 hours, and weekly (completely FREE)
- No Vercel cron jobs needed (Hobby tier limitation bypassed)
- Requires: CRON_SECRET, NEXT_PUBLIC_APP_URL environment variables
- 100% free using GitHub Actions (2000 minutes/month included)

## Cost Breakdown

**100% FREE** on free tiers:
- Supabase: 500MB database
- Vercel: Hobby plan (free, no cron jobs used)
- GitHub Actions: 2000 minutes/month (may need hourly frequency if exceeded)
- Groq: 30 requests/min (free)
- Gemini: 15 requests/min (free)
- Perplexity: Used sparingly for validations (free tier)

**No paid upgrades needed** - GitHub Actions handles all automation for free!

## Documentation

- `AUTOMATION_SETUP.md` - Complete automation configuration guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `QUICK_START.md` - Quick start guide
- `README_AI_PIPELINE.md` - AI agent technical details
- `README_LEARNING_SYSTEM.md` - Learning system deep dive

## Support

For issues:
1. Check GitHub Actions (Repository > Actions tab)
2. Test manually via `/admin` panel
3. Verify environment variables in Vercel
4. Check Supabase connection status

## Next Steps

1. ✅ Database tables created
2. ✅ Mock data removed
3. ⏳ Add CRON_SECRET and NEXT_PUBLIC_APP_URL to Vercel
4. ⏳ Add GitHub secrets
5. ⏳ Deploy and wait for first automated signals (30-60 minutes)
6. ⏳ Monitor learning metrics after first week

---

**Early awareness is alpha. Stay ahead of the market.**

Built with Next.js 15, Supabase, Groq, Gemini 2.5 Flash, and Perplexity.
