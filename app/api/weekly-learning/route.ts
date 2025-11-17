import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runLearnerAgent } from '@/lib/ai/agents/learner-agent';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Starting weekly learning analysis...');
    
    const supabase = await createClient();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get this week's signals
    const { data: weeklySignals, error: signalsError } = await supabase
      .from('signals')
      .select('*')
      .gte('created_at', weekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (signalsError) {
      throw new Error(`Failed to fetch signals: ${signalsError.message}`);
    }

    // Get source performance
    const { data: sources, error: sourcesError } = await supabase
      .from('data_sources')
      .select('*')
      .order('accuracy', { ascending: false });

    if (sourcesError) {
      throw new Error(`Failed to fetch sources: ${sourcesError.message}`);
    }

    if (!weeklySignals || weeklySignals.length === 0) {
      console.log('[v0] No signals this week, skipping learning analysis');
      return NextResponse.json({
        success: true,
        message: 'No signals to analyze this week'
      });
    }

    console.log(`[v0] Analyzing ${weeklySignals.length} signals from this week`);

    // Run Learner Agent
    const learningResults = await runLearnerAgent(weeklySignals, sources || []);

    // Save learning metrics
    const { error: insertError } = await supabase
      .from('learning_metrics')
      .insert({
        week_start: weekAgo.toISOString().split('T')[0],
        week_end: now.toISOString().split('T')[0],
        total_signals: weeklySignals.length,
        accuracy_rate: learningResults.accuracyRate,
        best_performing_sources: learningResults.bestSources,
        worst_performing_sources: learningResults.worstSources,
        keyword_effectiveness: learningResults.keywordEffectiveness,
        improvements_identified: learningResults.improvements
      });

    if (insertError) {
      console.error('[v0] Failed to save learning metrics:', insertError);
    }

    console.log('[v0] Weekly learning analysis complete');

    return NextResponse.json({
      success: true,
      accuracy_rate: learningResults.accuracyRate,
      total_signals: weeklySignals.length,
      improvements: learningResults.improvements,
      insights: learningResults.insights
    });

  } catch (error) {
    console.error('[v0] Weekly learning error:', error);
    return NextResponse.json(
      { error: 'Learning analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}
