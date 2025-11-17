-- Add missing sources with correct schema
INSERT INTO data_sources (name, platform, weight) VALUES
  ('Gemini Search - News', 'news', 1.0),
  ('Gemini Search - Social', 'social', 1.0),
  ('Gemini Search - Economic', 'economic', 1.0),
  ('Gemini Search - Technical', 'technical', 1.0)
ON CONFLICT (name) DO NOTHING;
