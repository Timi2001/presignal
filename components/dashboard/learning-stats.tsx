"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function LearningStats() {
  const [stats, setStats] = useState({
    accuracy: 0,
    signalsThisWeek: 0,
    truePositives: 0,
    falsePositives: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get this week's signals
      const { data: signals } = await supabase
        .from('signals')
        .select('validation_status')
        .gte('created_at', weekAgo);

      if (signals) {
        const truePositives = signals.filter(s => s.validation_status === 'true_positive').length;
        const falsePositives = signals.filter(s => s.validation_status === 'false_positive').length;
        const total = truePositives + falsePositives;
        const accuracy = total > 0 ? truePositives / total : 0;

        setStats({
          accuracy,
          signalsThisWeek: signals.length,
          truePositives,
          falsePositives
        });
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4" />
          Learning Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">System Accuracy</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-500">
                {stats.accuracy > 0 ? `${(stats.accuracy * 100).toFixed(0)}%` : '--'}
              </span>
              {stats.accuracy > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Signals This Week</span>
            <span className="text-lg font-bold">{stats.signalsThisWeek}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">True Positives</span>
            <span className="text-lg font-bold text-green-500">{stats.truePositives}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">False Positives</span>
            <span className="text-lg font-bold text-red-500">{stats.falsePositives}</span>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              System is learning from every signal. Performance improves over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
