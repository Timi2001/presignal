-- Seed initial data for testing
-- This script should be run AFTER 001_create_tables.sql

-- Note: Currency pairs are already inserted in 001_create_tables.sql
-- This script adds data sources and a test signal

-- Insert initial data sources with neutral credibility
INSERT INTO data_sources (name, platform, weight) VALUES
  ('Bloomberg', 'rss', 1.0),
  ('Reuters', 'rss', 1.0),
  ('Financial Times', 'rss', 1.0),
  ('Wall Street Journal', 'rss', 1.0),
  ('r/Forex', 'reddit', 1.0),
  ('r/wallstreetbets', 'reddit', 1.0),
  ('r/economics', 'reddit', 1.0),
  ('Financial YouTube Channels', 'youtube', 1.0),
  ('Google Trends', 'google_trends', 1.0),
  ('TradingView Ideas', 'tradingview', 1.0),
  ('Federal Reserve', 'central_bank', 1.0),
  ('European Central Bank', 'central_bank', 1.0),
  ('Bank of England', 'central_bank', 1.0),
  ('Bank of Japan', 'central_bank', 1.0),
  ('Twitter/X', 'twitter', 1.0)
ON CONFLICT (name) DO NOTHING;

-- Insert sample test signal (for UI testing)
INSERT INTO signals (
  currency_pair_id,
  signal_type,
  category,
  direction,
  confidence,
  predicted_impact,
  keywords,
  narrative,
  raw_data,
  validation_status
)
SELECT 
  cp.id,
  'signal',
  'sentiment',
  'bullish',
  0.75,
  0.5,
  ARRAY['test', 'signal', 'forex'],
  'Sample test signal - System initialization',
  '{"test": true, "message": "This is a test signal for UI verification"}'::jsonb,
  'pending'
FROM currency_pairs cp
WHERE cp.symbol = 'EUR/USD'
LIMIT 1;
