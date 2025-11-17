-- Remove all sample/test data to ensure clean production start

-- Delete test signal
DELETE FROM signals WHERE narrative LIKE '%Sample test signal%' OR narrative LIKE '%test%';

-- Delete any mock outcomes
DELETE FROM signal_outcomes WHERE id IN (
  SELECT so.id FROM signal_outcomes so
  JOIN signals s ON s.id = so.signal_id
  WHERE s.created_at < NOW() - INTERVAL '1 hour'
);

-- Delete old raw data from testing
DELETE FROM raw_data_collection WHERE created_at < NOW() - INTERVAL '1 hour';

-- Reset alert history from testing
DELETE FROM alert_history WHERE created_at < NOW() - INTERVAL '1 hour';

-- Keep learning_metrics but this clears any test data
DELETE FROM learning_metrics WHERE created_at < NOW() - INTERVAL '1 hour';

-- Verify data sources are clean (should have 15 sources)
SELECT COUNT(*) as source_count FROM data_sources;

-- Verify currency pairs are present (should have 7 pairs)
SELECT COUNT(*) as pair_count FROM currency_pairs;
