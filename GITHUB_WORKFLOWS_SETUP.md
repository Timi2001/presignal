# GitHub Workflows Manual Setup Guide

If v0's automatic push isn't working, follow these steps to add the workflows manually:

## Option 1: Create Files Directly in GitHub (Easiest)

### Step 1: Create the workflows folder
1. Go to your GitHub repository
2. Click "Add file" → "Create new file"
3. Type: `.github/workflows/data-collection.yml`
4. GitHub will automatically create the folders

### Step 2: Add Data Collection Workflow
Paste this content into `.github/workflows/data-collection.yml`:

\`\`\`yaml
name: Data Collection & Processing

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  collect-and-process:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Data Collection
        run: |
          curl -X POST "${{ secrets.VERCEL_APP_URL }}/api/trigger-collection" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
\`\`\`

Click **"Commit changes"**

### Step 3: Add Validation Workflow
1. Click "Add file" → "Create new file"
2. Type: `.github/workflows/validation.yml`
3. Paste this content:

\`\`\`yaml
name: Signal Validation

on:
  schedule:
    - cron: '0 */2 * * *'  # Every 2 hours
  workflow_dispatch:

jobs:
  validate-signals:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Signal Validation
        run: |
          curl -X POST "${{ secrets.VERCEL_APP_URL }}/api/validate-signals" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
\`\`\`

Click **"Commit changes"**

### Step 4: Add Learning Workflow
1. Click "Add file" → "Create new file"
2. Type: `.github/workflows/weekly-learning.yml`
3. Paste this content:

\`\`\`yaml
name: Weekly Learning

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight UTC
  workflow_dispatch:

jobs:
  weekly-learning:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Weekly Learning
        run: |
          curl -X POST "${{ secrets.VERCEL_APP_URL }}/api/weekly-learning" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
\`\`\`

Click **"Commit changes"**

---

## Option 2: Download and Push (If you have Git installed)

1. Download your project from v0 (click three dots → Download ZIP)
2. Extract the ZIP file
3. Open terminal in that folder
4. Run these commands:

\`\`\`bash
git init
git remote add origin https://github.com/YOUR_USERNAME/presignal.git
git add .github/workflows/
git commit -m "Add automation workflows"
git push origin main
\`\`\`

---

## Verify Setup

After adding the workflows:

1. Go to **Actions** tab in GitHub
2. You should see three workflows:
   - Data Collection & Processing
   - Signal Validation
   - Weekly Learning
3. Click "Data Collection & Processing"
4. Click **"Run workflow"** → **"Run workflow"**
5. Wait 2-3 minutes
6. Check your dashboard for new signals

---

## Troubleshooting

**If workflows don't appear:**
- Make sure you're in the correct repository
- Check that files are in `.github/workflows/` (exact path)
- File extension must be `.yml` (not `.yaml`)

**If runs fail:**
- Verify secrets are set: Settings → Secrets → Actions
- Check that VERCEL_APP_URL is your deployed URL
- Check that CRON_SECRET matches between GitHub and Vercel
