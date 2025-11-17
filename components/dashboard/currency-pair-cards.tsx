"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyPair, Signal } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CurrencyPairCardsProps {
  pairs: CurrencyPair[];
  signals: Signal[];
}

export function CurrencyPairCards({ pairs, signals }: CurrencyPairCardsProps) {
  const getPairSignals = (pairId: string) => {
    return signals.filter(s => s.currency_pair_id === pairId);
  };

  const getOverallSentiment = (pairSignals: Signal[]) => {
    if (pairSignals.length === 0) return 'neutral';
    const recentSignals = pairSignals.slice(0, 5);
    const bullishCount = recentSignals.filter(s => s.direction === 'bullish').length;
    const bearishCount = recentSignals.filter(s => s.direction === 'bearish').length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  };

  const getAvgConfidence = (pairSignals: Signal[]) => {
    if (pairSignals.length === 0) return 0;
    const recent = pairSignals.slice(0, 5);
    const sum = recent.reduce((acc, s) => acc + s.confidence, 0);
    return sum / recent.length;
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'bullish') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (sentiment === 'bearish') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Currency Pairs Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pairs.map((pair) => {
          const pairSignals = getPairSignals(pair.id);
          const sentiment = getOverallSentiment(pairSignals);
          const avgConfidence = getAvgConfidence(pairSignals);
          const hotSignals = pairSignals.filter(s => s.confidence >= 0.7).length;

          return (
            <Card key={pair.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pair.symbol}</CardTitle>
                  {getSentimentIcon(sentiment)}
                </div>
                <p className="text-xs text-muted-foreground">{pair.name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                  <Badge variant={sentiment === 'bullish' ? 'default' : sentiment === 'bearish' ? 'destructive' : 'secondary'}>
                    {sentiment}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Confidence</span>
                  <span className="text-sm font-medium">{(avgConfidence * 100).toFixed(0)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hot Signals</span>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-400">
                    {hotSignals}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Signals</span>
                  <span className="text-sm font-medium">{pairSignals.length}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
