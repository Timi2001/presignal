"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Signal } from "@/lib/types";
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

interface SignalFeedProps {
  signals: Signal[];
}

export function SignalFeed({ signals }: SignalFeedProps) {
  const latestSignals = signals.slice(0, 10);

  const getDirectionIcon = (direction: string | null) => {
    if (direction === 'bullish') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (direction === 'bearish') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (confidence >= 0.6) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getSignalTypeColor = (type: string) => {
    if (type === 'whisper') return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (type === 'signal') return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Signal Feed
          </CardTitle>
          <Badge variant="secondary">{signals.length} Total Signals</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {latestSignals.map((signal) => (
            <div
              key={signal.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-1">
                {getDirectionIcon(signal.direction)}
                <Badge className={getConfidenceColor(signal.confidence)}>
                  {(signal.confidence * 100).toFixed(0)}%
                </Badge>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getSignalTypeColor(signal.signal_type)}>
                    {signal.signal_type}
                  </Badge>
                  <Badge variant="outline">{signal.category}</Badge>
                  {signal.perplexity_validated && (
                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                      Perplexity Validated
                    </Badge>
                  )}
                  {signal.cross_platform_confirmed && (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Cross-Platform
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-foreground">{signal.narrative}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}</span>
                  {signal.keywords.length > 0 && (
                    <span className="flex items-center gap-1">
                      Keywords: {signal.keywords.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
