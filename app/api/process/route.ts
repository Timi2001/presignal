import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runCollectorAgent } from '@/lib/ai/agents/collector-agent';
import { runAnalystAgent } from '@/lib/ai/agents/analyst-agent';
import { runOracleAgent } from '@/lib/ai/agents/oracle-agent';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Starting AI processing pipeline...');
    
    const supabase = await createClient();
    
    // Get unprocessed raw data
    const { data: rawData, error: fetchError } = await supabase
      .from('raw_data_collection')
      .select('*')
      .eq('processed', false)
      .order('collected_at', { ascending: false })
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch raw data: ${fetchError.message}`);
    }

    if (!rawData || rawData.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new data to process',
        signals_generated: 0
      });
    }

    console.log(`[v0] Processing ${rawData.length} raw data items...`);

    // Step 1: Run Collector Agent on all raw data (parallel processing)
    const collectorResults = await Promise.all(
      rawData.map(item => runCollectorAgent(item.content))
    );

    console.log('[v0] Collector Agent completed');

    // Step 2: Run Analyst Agent to generate signals
    const historicalContext = "System is in learning phase. No historical patterns yet.";
    const signals = await runAnalystAgent(collectorResults, historicalContext);

    console.log(`[v0] Analyst Agent generated ${signals.length} signals`);

    // Step 3: Validate high-confidence signals with Oracle Agent
    const validatedSignals = [];
    
    for (const signal of signals) {
      if (signal.confidence >= 0.7) {
        console.log('[v0] Validating high-confidence signal with Oracle...');
        const oracleResult = await runOracleAgent(signal);
        
        // Adjust confidence based on Oracle validation
        const adjustedConfidence = Math.max(0, Math.min(1, 
          signal.confidence + oracleResult.confidenceAdjustment
        ));

        validatedSignals.push({
          ...signal,
          confidence: adjustedConfidence,
          perplexity_validated: oracleResult.validated,
          oracle_insights: oracleResult.contextualInsights
        });
      } else {
        validatedSignals.push(signal);
      }
    }

    // Step 4: Save signals to database
    const { data: currencyPairs } = await supabase
      .from('currency_pairs')
      .select('id, symbol');

    const signalsToInsert = validatedSignals.map(signal => {
      // Map signal to currency pair
      const relevantPairs = collectorResults
        .flatMap(r => r.relevantPairs)
        .filter(p => p);
      
      const pairSymbol = relevantPairs[0] || 'EUR/USD';
      const pair = currencyPairs?.find(p => p.symbol === pairSymbol);

      return {
        currency_pair_id: pair?.id || currencyPairs?.[0]?.id,
        signal_type: signal.signalType,
        category: signal.category,
        direction: signal.direction,
        confidence: signal.confidence,
        predicted_impact: signal.predictedImpact,
        keywords: collectorResults.flatMap(r => r.keywords).slice(0, 10),
        narrative: signal.narrative,
        raw_data: { reasoning: signal.reasoning },
        source_ids: [],
        perplexity_validated: signal.perplexity_validated || false,
        cross_platform_confirmed: collectorResults.length > 5,
        validation_status: 'pending'
      };
    });

    if (signalsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('signals')
        .insert(signalsToInsert);

      if (insertError) {
        console.error('[v0] Failed to insert signals:', insertError);
      } else {
        console.log(`[v0] Saved ${signalsToInsert.length} signals to database`);
      }
    }

    // Mark raw data as processed
    const rawDataIds = rawData.map(d => d.id);
    await supabase
      .from('raw_data_collection')
      .update({ processed: true })
      .in('id', rawDataIds);

    console.log('[v0] AI processing pipeline completed successfully');

    return NextResponse.json({
      success: true,
      raw_data_processed: rawData.length,
      signals_generated: signalsToInsert.length,
      high_confidence_signals: validatedSignals.filter(s => s.confidence >= 0.7).length
    });

  } catch (error) {
    console.error('[v0] Processing pipeline error:', error);
    return NextResponse.json(
      { error: 'Processing failed', details: String(error) },
      { status: 500 }
    );
  }
}
