export interface CurrencyPair {
  id: string;
  symbol: string;
  name: string;
  created_at: string;
}

export interface DataSource {
  id: string;
  name: string;
  platform: string;
  weight: number;
  total_signals: number;
  true_positives: number;
  false_positives: number;
  accuracy: number;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  currency_pair_id: string;
  signal_type: 'whisper' | 'signal' | 'context';
  category: 'sentiment' | 'narrative' | 'event' | 'technical' | 'meta';
  direction: 'bullish' | 'bearish' | 'neutral' | null;
  confidence: number;
  predicted_impact: number | null;
  keywords: string[];
  narrative: string;
  raw_data: Record<string, unknown>;
  source_ids: string[];
  perplexity_validated: boolean;
  cross_platform_confirmed: boolean;
  validation_status: 'pending' | 'true_positive' | 'false_positive' | 'partial';
  validation_windows: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SignalOutcome {
  id: string;
  signal_id: string;
  validation_window: string;
  actual_move: number | null;
  direction_correct: boolean | null;
  threshold_met: boolean | null;
  outcome: 'true_positive' | 'false_positive' | 'partial' | 'pending';
  validated_at: string;
}

export interface LearningMetrics {
  id: string;
  week_start: string;
  week_end: string;
  total_signals: number;
  accuracy_rate: number;
  best_performing_sources: Record<string, unknown>;
  worst_performing_sources: Record<string, unknown>;
  keyword_effectiveness: Record<string, unknown>;
  improvements_identified: string[];
  created_at: string;
}

export interface AlertHistory {
  id: string;
  signal_id: string;
  alert_type: 'email' | 'in_app';
  sent_at: string;
  delivered: boolean;
}
