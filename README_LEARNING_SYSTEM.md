# Learning & Validation System

## Overview

The system continuously learns from its predictions and improves accuracy over time.

## Validation Process

### Signal Outcomes

Each signal is validated at multiple time windows:
- **2 hours**: Ultra-early validation (whispers)
- **8 hours**: Early signal validation
- **24 hours**: Standard timeframe
- **48 hours**: Extended validation (context signals)

### Outcome Classification

- **True Positive**: Correct direction + threshold met
- **False Positive**: Wrong direction or no movement
- **Partial**: Correct direction but below threshold (50% credit)
- **Pending**: Still within validation window

### Thresholds

- **Major Pairs** (EUR/USD, GBP/USD, etc.): 0.4% move
- **Gold** (XAU/USD): 0.7% move

## Learning Mechanism

### Source Weight Updates

Each data source has a credibility weight (0.3 to 2.0):
- Starts at 1.0 (neutral)
- +0.05 per true positive (max 2.0)
- -0.10 per false positive (min 0.3)

Higher weight sources get more influence in future signals.

### Weekly Meta-Analysis

Every Sunday, the Learner Agent:
1. Calculates overall accuracy rate
2. Identifies best/worst performing sources
3. Analyzes keyword effectiveness
4. Suggests specific improvements
5. Stores insights in learning_metrics table

## Automation

### Validation (Every 2 hours)
GitHub Actions → `/api/validate-signals`
- Checks pending signals
- Fetches market data
- Updates validation status
- Adjusts source weights

### Learning (Weekly - Sunday midnight)
GitHub Actions → `/api/weekly-learning`
- Analyzes week's performance
- Runs Learner Agent
- Stores metrics
- Identifies improvements

## Alert System

High-confidence signals (≥70%) trigger alerts:
- Email notification (requires ALERT_EMAIL env var)
- In-app notification on dashboard
- Stored in alert_history table

## Manual Testing

Validate signals manually:
\`\`\`bash
curl -X POST https://your-app.vercel.app/api/validate-signals
\`\`\`

Trigger weekly learning:
\`\`\`bash
curl -X POST https://your-app.vercel.app/api/weekly-learning
\`\`\`

## Future Enhancements

1. Integrate real forex price API (Alpha Vantage, Frankfurter)
2. Add email service (Resend, SendGrid)
3. Implement SMS alerts for critical signals
4. Add machine learning model for pattern recognition
5. Create accuracy charts and visualizations
\`\`\`
