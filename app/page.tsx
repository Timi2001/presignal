import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { SignalFeed } from '@/components/dashboard/signal-feed';
import { CurrencyPairCards } from '@/components/dashboard/currency-pair-cards';
import { MultiLayerTimeline } from '@/components/dashboard/multi-layer-timeline';
import { SourcePerformance } from '@/components/dashboard/source-performance';
import { LearningStats } from '@/components/dashboard/learning-stats';
import { AlertHistory } from '@/components/dashboard/alert-history';
import { SystemStatus } from '@/components/dashboard/system-status';
import { 
  checkDatabaseSetup, 
  getCurrencyPairsSafe, 
  getRecentSignalsSafe, 
  getDataSourcePerformanceSafe 
} from '@/lib/db-helpers';

export default async function IntelligenceDashboard() {
  let setupStatus;
  try {
    setupStatus = await checkDatabaseSetup();
  } catch (error) {
    console.log('[v0] Error checking database setup:', error);
    redirect('/setup');
  }
  
  if (!setupStatus.isSetup) {
    redirect('/setup');
  }

  const [pairs, signals, sources] = await Promise.all([
    getCurrencyPairsSafe(),
    getRecentSignalsSafe(50),
    getDataSourcePerformanceSafe()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Live Signal Feed */}
        <section>
          <Suspense fallback={<div>Loading signals...</div>}>
            <SignalFeed signals={signals} />
          </Suspense>
        </section>

        {/* Currency Pair Cards */}
        <section>
          <Suspense fallback={<div>Loading pairs...</div>}>
            <CurrencyPairCards pairs={pairs} signals={signals} />
          </Suspense>
        </section>

        {/* Multi-Layer Timeline */}
        <section>
          <Suspense fallback={<div>Loading timeline...</div>}>
            <MultiLayerTimeline signals={signals} />
          </Suspense>
        </section>

        {/* Bottom Grid: Source Performance, Learning Stats, Alert History, System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Suspense fallback={<div>Loading...</div>}>
            <SourcePerformance sources={sources} />
          </Suspense>
          
          <Suspense fallback={<div>Loading...</div>}>
            <LearningStats />
          </Suspense>
          
          <Suspense fallback={<div>Loading...</div>}>
            <AlertHistory />
          </Suspense>

          <SystemStatus />
        </div>
      </main>
    </div>
  );
}
