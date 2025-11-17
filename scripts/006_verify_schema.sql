-- Verify all tables have correct schema
-- Run this to check if your database is properly set up

-- Check all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'currency_pairs',
    'data_sources', 
    'signals',
    'signal_outcomes',
    'raw_data_collection',
    'learning_metrics',
    'alert_history'
  )
ORDER BY table_name;

-- Check created_at columns exist in all tables
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'created_at'
  AND table_name IN (
    'currency_pairs',
    'data_sources',
    'signals',
    'learning_metrics',
    'raw_data_collection',
    'alert_history'
  )
ORDER BY table_name;

-- Show current data counts
SELECT 'currency_pairs' as table_name, COUNT(*) as count FROM currency_pairs
UNION ALL
SELECT 'data_sources', COUNT(*) FROM data_sources
UNION ALL
SELECT 'signals', COUNT(*) FROM signals
UNION ALL
SELECT 'raw_data_collection', COUNT(*) FROM raw_data_collection
UNION ALL
SELECT 'signal_outcomes', COUNT(*) FROM signal_outcomes
UNION ALL
SELECT 'learning_metrics', COUNT(*) FROM learning_metrics
UNION ALL
SELECT 'alert_history', COUNT(*) FROM alert_history;
