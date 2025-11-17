"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataSource } from "@/lib/types";
import { Target } from 'lucide-react';

interface SourcePerformanceProps {
  sources: DataSource[];
}

export function SourcePerformance({ sources }: SourcePerformanceProps) {
  const topSources = sources.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4" />
          Source Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSources.map((source, idx) => (
            <div key={source.id} className="flex items-center gap-3">
              <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                {idx + 1}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{source.name}</p>
                <p className="text-xs text-muted-foreground">{source.platform}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-500">
                  {(source.accuracy * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {source.total_signals} signals
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
