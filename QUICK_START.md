# Quick Start Guide

Your Real-Time Market Intelligence System is ready! Here's what to do next.

## Current Status

✅ Database created (7 tables)
✅ Environment variables configured
✅ SQL scripts executed
✅ System deployed to Vercel

## Step 1: Verify Setup (2 minutes)

### Run the Seed Script

In Supabase SQL Editor, execute:
\`\`\`sql
-- Copy and paste contents of scripts/002_seed_data.sql
\`\`\`

This adds:
- 7 currency pairs
- 15 data sources
- 1 test signal

### Check the Dashboard

Visit your app homepage (`/`) and you should see:
- "Market Intelligence Hub" header with green "System Active" badge
- Empty or test signal in the feed
- 7 currency pair cards (EUR/USD, GBP/USD, etc.)
- Timeline, source performance, and learning stats sections

## Step 2: Test the System (5 minutes)

### Access Admin Panel

Click the **Settings icon** (gear) in the top-right corner OR visit `/admin`

### Run Tests in Order

1. **Trigger Collection**
   - Click the button
   - Should show "Data collection triggered" message
   - Note: Shows placeholder until GitHub Actions is set up

2. **Trigger Processing**
   - Click the button
   - This tests the AI pipeline (Collector → Analyst → Oracle)
   - Should show "Processed X items, generated Y signals"
   - Check dashboard - new signals should appear

3. **Trigger Validation** (after a few hours)
   - Tests signal validation logic
   - Shows true positives, false positives, pending

4. **Trigger Learning** (after accumulating signals)
   - Tests meta-analysis system
   - Shows accuracy percentage and sources updated

## Step 3: Enable Automation (10 minutes)

### A. Push to GitHub

\`\`\`bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Market Intelligence System"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
\`\`\`

### B. Add GitHub Secrets

1. Go to your GitHub repo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Name | Value | Where to Find |
|------|-------|---------------|
| `VERCEL_API_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `SUPABASE_URL` | Your Supabase URL | Vercel → Project → Vars |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Vercel → Project → Vars |
| `YOUTUBE_API_KEY` | (Optional) YouTube key | Google Cloud Console |

### C. Enable GitHub Actions

1. Go to your repo → **Actions** tab
2. You'll see 4 workflows:
   - Data Collection (every 30 min)
   - AI Processing (every 30 min)
   - Signal Validation (every 2 hours)
   - Weekly Learning (every Sunday)
3. Click **"I understand my workflows, go ahead and enable them"**

### D. Verify Automation

- Click on **Actions** tab
- Wait 30 minutes for first run
- Check workflow logs for any errors
- Visit dashboard - should see new signals appearing

## Step 4: Monitor & Iterate (Ongoing)

### Daily Monitoring

- Visit dashboard to see latest signals
- Check email for high-confidence alerts (if `ALERT_EMAIL` is set)
- Review source performance - which platforms are most accurate?

### Weekly Review

- Check learning stats - is accuracy improving?
- Review false positives - are there patterns?
- Adjust strategy based on insights

### GitHub Actions Logs

If something isn't working:
1. Go to GitHub repo → Actions tab
2. Click on failed workflow
3. Read error logs
4. Common issues:
   - Missing secrets
   - API rate limits
   - Network timeouts

## Understanding the Dashboard

### Live Signal Feed
- Shows latest signals with confidence scores
- Green = Bullish, Red = Bearish, Yellow = Neutral
- Higher confidence = stronger signal

### Currency Pair Cards
- Real-time sentiment for each pair
- Trending keywords
- Hot signals counter

### Multi-Layer Timeline
- **Whispers** (10min-2hr): Early sentiment shifts
- **Signals** (2-8hr): Confirmed patterns
- **Context** (8-48hr): Macro trends

### Source Performance
- Shows which platforms are most accurate
- Credibility scores update weekly
- Higher score = more reliable

### Learning Stats
- Overall system accuracy
- True positive rate
- Weekly improvement metrics

## What to Expect

### First 24 Hours
- System collecting initial data
- First signals appearing
- No validation data yet (signals need time to play out)

### First Week
- Validation data accumulating
- First learning cycle runs (Sunday)
- Source credibility weights update
- Accuracy metrics become meaningful

### First Month
- System has learned from 100+ signals
- Source weights reflect reality
- False positive rate decreases
- You can trust high-confidence signals

## Customization Ideas

### Add More Sources
Edit `scripts/collectors/*.py` to add:
- More RSS feeds
- Additional Reddit subreddits
- More YouTube channels
- Other financial news sites

### Adjust Thresholds
Edit validation logic in `lib/validation/market-data.ts`:
- Change percentage thresholds (currently 0.4% for pairs, 0.7% for gold)
- Adjust validation windows
- Modify confidence calculations

### Add Alert Rules
Edit `app/api/send-alert/route.ts`:
- Change alert threshold (currently 0.7)
- Add SMS alerts (Twilio)
- Add Telegram/Discord notifications

## Troubleshooting

### No Signals Appearing?
- Check Supabase → Table Editor → `raw_data_collection` (should have rows)
- Check Vercel → Functions → Logs (look for errors)
- Run manual test from `/admin` panel

### GitHub Actions Failing?
- Verify all secrets are added correctly
- Check Actions logs for specific errors
- Ensure `VERCEL_API_URL` has no trailing slash

### Dashboard Shows Errors?
- Check Supabase connection in Vercel logs
- Verify environment variables are set
- Ensure database tables exist (run SQL scripts)

## Support Resources

- **README.md** - Full architecture and features
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **README_AI_PIPELINE.md** - AI agent details
- **README_LEARNING_SYSTEM.md** - Learning system details

## Success Checklist

- [ ] Database seeded with 7 pairs and sources
- [ ] Dashboard loads without errors
- [ ] Admin panel accessible via settings icon
- [ ] Manual trigger tests work
- [ ] Code pushed to GitHub
- [ ] GitHub secrets configured
- [ ] GitHub Actions enabled
- [ ] First automated run completed
- [ ] Signals appearing on dashboard
- [ ] Email alerts working (if configured)

## You're All Set!

Your AI-powered market intelligence system is now running 24/7, analyzing data from across the internet to detect forex market shifts before they happen.

**Next**: Wait 30 minutes for the first automated collection, then check your dashboard for new signals.

**Questions?** Check the logs in Vercel (for API errors) or GitHub Actions (for scraper errors).

---

**Pro Tip**: Keep the admin panel (`/admin`) bookmarked for quick manual testing and monitoring.
