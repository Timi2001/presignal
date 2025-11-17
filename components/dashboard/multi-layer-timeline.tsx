"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Signal } from "@/lib/types";
import { Layers, Clock } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

interface MultiLayerTimelineProps {
  signals: Signal[];
}

export function MultiLayerTimeline({ signals }: MultiLayerTimelineProps) {
  const whispers = signals.filter(s => s.signal_type === 'whisper');
  const signalLayer = signals.filter(s => s.signal_type === 'signal');
  const context = signals.filter(s => s.signal_type === 'context');

  const renderSignalList = (layerSignals: Signal[]) => (
    <div className="space-y-2">
      {layerSignals.slice(0, 8).map((signal) => (
        <div key={signal.id} className="flex items-center gap-3 p-3 rounded border border-border bg-card/50">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm">{signal.narrative}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(signal.created_at), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="outline">{(signal.confidence * 100).toFixed(0)}%</Badge>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Multi-Layer Signal Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whispers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whispers" className="gap-2">
              Whispers <Badge variant="secondary">{whispers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="signals" className="gap-2">
              Signals <Badge variant="secondary">{signalLayer.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="context" className="gap-2">
              Context <Badge variant="secondary">{context.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whispers" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ultra-early signals (10min-2hr) from social sentiment spikes and coordination patterns
            </p>
            {renderSignalList(whispers)}
          </TabsContent>

          <TabsContent value="signals" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Early signals (2hr-8hr) from news convergence and narrative emergence
            </p>
            {renderSignalList(signalLayer)}
          </TabsContent>

          <TabsContent value="context" className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Macro signals (8hr-48hr) from policy shifts and structural changes
            </p>
            {renderSignalList(context)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
