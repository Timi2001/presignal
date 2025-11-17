import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateSignalOutcome } from '@/lib/validation/market-data';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Starting signal validation...');
    
    const supabase = await createClient();
    const now = new Date();

    // Get pending signals that are ready for validation
    const { data: pendingSignals, error: fetchError } = await supabase
      .from('signals')
      .select('*')
      .eq('validation_status', 'pending')
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) {
      throw new Error(`Failed to fetch signals: ${fetchError.message}`);
    }

    if (!pendingSignals || pendingSignals.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No signals ready for validation',
        validated: 0
      });
    }

    console.log(`[v0] Found ${pendingSignals.length} signals to validate`);

    let validatedCount = 0;

    for (const signal of pendingSignals) {
      const signalTime = new Date(signal.created_at);
      const hoursSinceSignal = (now.getTime() - signalTime.getTime()) / (1000 * 60 * 60);

      // Determine which validation windows to check
      const windowsToCheck: string[] = [];
      if (hoursSinceSignal >= 2) windowsToCheck.push('2hr');
      if (hoursSinceSignal >= 8) windowsToCheck.push('8hr');
      if (hoursSinceSignal >= 24) windowsToCheck.push('24hr');
      if (hoursSinceSignal >= 48) windowsToCheck.push('48hr');

      if (windowsToCheck.length === 0) continue;

      // Validate each window
      const validationWindows = signal.validation_windows || {};
      let finalOutcome = 'pending';

      for (const window of windowsToCheck) {
        if (!validationWindows[window]) {
          const outcome = await validateSignalOutcome(signal, window);
          
          validationWindows[window] = outcome;

          // Save outcome to signal_outcomes table
          await supabase.from('signal_outcomes').insert({
            signal_id: signal.id,
            validation_window: window,
            actual_move: outcome.actualMove,
            direction_correct: outcome.directionCorrect,
            threshold_met: outcome.thresholdMet,
            outcome: outcome.outcome
          });

          // Update final outcome based on best window result
          if (outcome.outcome === 'true_positive') {
            finalOutcome = 'true_positive';
          } else if (finalOutcome !== 'true_positive' && outcome.outcome === 'partial') {
            finalOutcome = 'partial';
          } else if (finalOutcome === 'pending') {
            finalOutcome = outcome.outcome;
          }
        }
      }

      // Update signal with validation results
      await supabase
        .from('signals')
        .update({
          validation_status: finalOutcome,
          validation_windows: validationWindows,
          updated_at: now.toISOString()
        })
        .eq('id', signal.id);

      // Update source weights based on outcome
      if (signal.source_ids && signal.source_ids.length > 0) {
        await updateSourceWeights(signal.source_ids, finalOutcome, supabase);
      }

      validatedCount++;
    }

    console.log(`[v0] Validated ${validatedCount} signals`);

    return NextResponse.json({
      success: true,
      validated: validatedCount,
      message: `Successfully validated ${validatedCount} signals`
    });

  } catch (error) {
    console.error('[v0] Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function updateSourceWeights(
  sourceIds: string[],
  outcome: string,
  supabase: any
) {
  for (const sourceId of sourceIds) {
    const { data: source } = await supabase
      .from('data_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (source) {
      const totalSignals = source.total_signals + 1;
      let truePositives = source.true_positives;
      let falsePositives = source.false_positives;

      if (outcome === 'true_positive') {
        truePositives++;
      } else if (outcome === 'false_positive') {
        falsePositives++;
      } else if (outcome === 'partial') {
        truePositives += 0.5; // Partial counts as half
      }

      const accuracy = totalSignals > 0 ? truePositives / totalSignals : 0;
      
      // Update weight: starts at 1.0, ranges from 0.3 to 2.0
      let newWeight = source.weight;
      if (outcome === 'true_positive') {
        newWeight = Math.min(2.0, newWeight + 0.05);
      } else if (outcome === 'false_positive') {
        newWeight = Math.max(0.3, newWeight - 0.10);
      }

      await supabase
        .from('data_sources')
        .update({
          total_signals: totalSignals,
          true_positives: truePositives,
          false_positives: falsePositives,
          accuracy: accuracy,
          weight: newWeight,
          updated_at: new Date().toISOString()
        })
        .eq('id', sourceId);
    }
  }
}
