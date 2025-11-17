"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

export function AlertHistory() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAlerts() {
      const supabase = createClient();
      
      const { data } = await supabase
        .from('alert_history')
        .select('*, signals(narrative, confidence, direction)')
        .order('sent_at', { ascending: false })
        .limit(5);

      if (data) {
        setAlerts(data);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" />
          Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No alerts yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              High-confidence signals will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded border border-border bg-card/50">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant={alert.signals?.direction === 'bullish' ? 'default' : 'destructive'}>
                    {alert.signals?.direction}
                  </Badge>
                  <Badge variant="outline">
                    {(alert.signals?.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-sm mb-1">{alert.signals?.narrative}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(alert.sent_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
