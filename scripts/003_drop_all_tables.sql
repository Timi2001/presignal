-- Emergency script to drop all tables and start fresh
-- WARNING: This will delete ALL data!

DROP TABLE IF EXISTS alert_history CASCADE;
DROP TABLE IF EXISTS learning_metrics CASCADE;
DROP TABLE IF EXISTS signal_outcomes CASCADE;
DROP TABLE IF EXISTS signals CASCADE;
DROP TABLE IF EXISTS raw_data_collection CASCADE;
DROP TABLE IF EXISTS data_sources CASCADE;
DROP TABLE IF EXISTS currency_pairs CASCADE;

-- Drop indexes if they exist
DROP INDEX IF EXISTS idx_signals_created_at;
DROP INDEX IF EXISTS idx_signals_currency_pair;
DROP INDEX IF EXISTS idx_signals_confidence;
DROP INDEX IF EXISTS idx_signals_validation_status;
DROP INDEX IF EXISTS idx_raw_data_processed;
DROP INDEX IF EXISTS idx_raw_data_collected_at;
