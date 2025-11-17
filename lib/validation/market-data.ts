/**
 * Market Data Validator
 * Fetches actual market moves to validate signals
 */

interface MarketMove {
  pair: string;
  priceChange: number;
  percentChange: number;
  timeframe: string;
}

export async function getMarketMove(
  pair: string,
  startTime: Date,
  endTime: Date
): Promise<MarketMove | null> {
  try {
    // In production, use a free forex API like:
    // - Frankfurter API (free, EUR-based)
    // - Exchange Rate API
    // - Alpha Vantage (free tier)
    
    // For now, simulate with placeholder
    // TODO: Implement real market data fetching
    
    console.log(`[v0] Fetching market data for ${pair} from ${startTime.toISOString()} to ${endTime.toISOString()}`);
    
    // Placeholder: return null for now
    return null;
    
  } catch (error) {
    console.error('[v0] Market data fetch error:', error);
    return null;
  }
}

export async function validateSignalOutcome(
  signal: any,
  validationWindow: string
): Promise<{
  actualMove: number;
  directionCorrect: boolean;
  thresholdMet: boolean;
  outcome: string;
}> {
  const windowHours: Record<string, number> = {
    '2hr': 2,
    '8hr': 8,
    '24hr': 24,
    '48hr': 48
  };

  const hours = windowHours[validationWindow] || 2;
  const startTime = new Date(signal.created_at);
  const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

  // Get actual market movement
  const marketMove = await getMarketMove(signal.currency_pair_id, startTime, endTime);

  if (!marketMove) {
    return {
      actualMove: 0,
      directionCorrect: false,
      thresholdMet: false,
      outcome: 'pending'
    };
  }

  const actualMove = Math.abs(marketMove.percentChange);
  
  // Determine thresholds based on pair
  const isGold = signal.currency_pair_id.includes('XAU');
  const threshold = isGold ? 0.7 : 0.4;

  // Check if direction matches
  const predictedBullish = signal.direction === 'bullish';
  const actualBullish = marketMove.percentChange > 0;
  const directionCorrect = predictedBullish === actualBullish;

  const thresholdMet = actualMove >= threshold;

  let outcome: string;
  if (directionCorrect && thresholdMet) {
    outcome = 'true_positive';
  } else if (!directionCorrect) {
    outcome = 'false_positive';
  } else if (directionCorrect && actualMove > 0 && actualMove < threshold) {
    outcome = 'partial';
  } else {
    outcome = 'false_positive';
  }

  return {
    actualMove,
    directionCorrect,
    thresholdMet,
    outcome
  };
}
