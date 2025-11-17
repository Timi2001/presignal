-- Market Intelligence System Database Schema

-- 1. CURRENCY PAIRS TABLE
CREATE TABLE IF NOT EXISTS currency_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 7 pairs we're tracking
INSERT INTO currency_pairs (symbol, name) VALUES
  ('EUR/USD', 'Euro / US Dollar'),
  ('GBP/USD', 'British Pound / US Dollar'),
  ('USD/JPY', 'US Dollar / Japanese Yen'),
  ('USD/CHF', 'US Dollar / Swiss Franc'),
  ('AUD/USD', 'Australian Dollar / US Dollar'),
  ('USD/CAD', 'US Dollar / Canadian Dollar'),
  ('XAU/USD', 'Gold / US Dollar')
ON CONFLICT (symbol) DO NOTHING;

-- 2. DATA SOURCES TABLE (for tracking source credibility)
CREATE TABLE IF NOT EXISTS data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL, -- twitter, reddit, rss, youtube, etc
  weight DECIMAL DEFAULT 1.0, -- credibility weight (0.3 to 2.0)
  total_signals INTEGER DEFAULT 0,
  true_positives INTEGER DEFAULT 0,
  false_positives INTEGER DEFAULT 0,
  accuracy DECIMAL DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SIGNALS TABLE (main intelligence data)
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_pair_id UUID REFERENCES currency_pairs(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL, -- whisper, signal, context
  category TEXT NOT NULL, -- sentiment, narrative, event, technical, meta
  direction TEXT, -- bullish, bearish, neutral
  confidence DECIMAL NOT NULL, -- 0.0 to 1.0
  predicted_impact DECIMAL, -- expected percentage move
  keywords TEXT[], -- extracted keywords
  narrative TEXT, -- emerging narrative description
  raw_data JSONB, -- original data from sources
  source_ids UUID[], -- array of source IDs
  perplexity_validated BOOLEAN DEFAULT FALSE,
  cross_platform_confirmed BOOLEAN DEFAULT FALSE,
  validation_status TEXT DEFAULT 'pending', -- pending, true_positive, false_positive, partial
  validation_windows JSONB, -- {2hr, 8hr, 24hr, 48hr outcomes}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SIGNAL OUTCOMES TABLE (for learning system)
CREATE TABLE IF NOT EXISTS signal_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  validation_window TEXT NOT NULL, -- 2hr, 8hr, 24hr, 48hr
  actual_move DECIMAL, -- actual percentage move
  direction_correct BOOLEAN,
  threshold_met BOOLEAN,
  outcome TEXT, -- true_positive, false_positive, partial, pending
  validated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RAW DATA COLLECTION TABLE (before AI processing)
CREATE TABLE IF NOT EXISTS raw_data_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_platform TEXT NOT NULL,
  source_name TEXT,
  content TEXT NOT NULL,
  metadata JSONB, -- urls, authors, timestamps, engagement metrics
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- 6. LEARNING METRICS TABLE (weekly meta-analysis)
CREATE TABLE IF NOT EXISTS learning_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_signals INTEGER,
  accuracy_rate DECIMAL,
  best_performing_sources JSONB,
  worst_performing_sources JSONB,
  keyword_effectiveness JSONB,
  improvements_identified TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ALERT HISTORY TABLE (notifications sent to user)
CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- email, in_app
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_currency_pair ON signals(currency_pair_id);
CREATE INDEX IF NOT EXISTS idx_signals_confidence ON signals(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_signals_validation_status ON signals(validation_status);
CREATE INDEX IF NOT EXISTS idx_raw_data_processed ON raw_data_collection(processed);
CREATE INDEX IF NOT EXISTS idx_raw_data_collected_at ON raw_data_collection(collected_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE currency_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_data_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read for now since it's single user system)
-- For production with auth, replace 'true' with auth.uid() checks
CREATE POLICY "Allow public read currency_pairs" ON currency_pairs FOR SELECT USING (true);
CREATE POLICY "Allow public all data_sources" ON data_sources FOR ALL USING (true);
CREATE POLICY "Allow public all signals" ON signals FOR ALL USING (true);
CREATE POLICY "Allow public all signal_outcomes" ON signal_outcomes FOR ALL USING (true);
CREATE POLICY "Allow public all raw_data" ON raw_data_collection FOR ALL USING (true);
CREATE POLICY "Allow public all learning_metrics" ON learning_metrics FOR ALL USING (true);
CREATE POLICY "Allow public all alert_history" ON alert_history FOR ALL USING (true);
