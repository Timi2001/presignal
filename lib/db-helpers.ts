import { createClient } from "@/lib/supabase/server";
import { Signal, DataSource, CurrencyPair } from "./types";

export async function getCurrencyPairs(): Promise<CurrencyPair[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('currency_pairs')
    .select('*')
    .order('symbol');
  
  if (error) throw error;
  return data || [];
}

export async function getRecentSignals(limit = 50): Promise<Signal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

export async function getSignalsByCurrencyPair(pairId: string): Promise<Signal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('currency_pair_id', pairId)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) throw error;
  return data || [];
}

export async function getDataSourcePerformance(): Promise<DataSource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('data_sources')
    .select('*')
    .order('accuracy', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createSignal(signal: Partial<Signal>): Promise<Signal> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('signals')
    .insert(signal)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSignalValidation(
  signalId: string,
  validationStatus: string,
  validationWindows: Record<string, unknown>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('signals')
    .update({
      validation_status: validationStatus,
      validation_windows: validationWindows,
      updated_at: new Date().toISOString()
    })
    .eq('id', signalId);
  
  if (error) throw error;
}

export async function checkDatabaseSetup(): Promise<{
  isSetup: boolean;
  missingTables: string[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const requiredTables = [
      'currency_pairs',
      'data_sources',
      'signals',
      'signal_outcomes',
      'raw_data_collection',
      'learning_metrics',
      'alert_history'
    ];
    
    const missingTables: string[] = [];
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        // Table doesn't exist if we get this specific error code
        if (error && (error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
          missingTables.push(table);
        }
      } catch (tableError) {
        // If any error occurs checking this table, mark it as missing
        missingTables.push(table);
      }
    }
    
    return {
      isSetup: missingTables.length === 0,
      missingTables,
    };
  } catch (error) {
    // If the entire check fails, assume setup is not complete
    return {
      isSetup: false,
      missingTables: [],
      error: error instanceof Error ? error.message : 'Unknown error checking database'
    };
  }
}

export async function getCurrencyPairsSafe(): Promise<CurrencyPair[]> {
  try {
    return await getCurrencyPairs();
  } catch (error) {
    console.log('[v0] Error fetching currency pairs:', error);
    return [];
  }
}

export async function getRecentSignalsSafe(limit = 50): Promise<Signal[]> {
  try {
    return await getRecentSignals(limit);
  } catch (error) {
    console.log('[v0] Error fetching signals:', error);
    return [];
  }
}

export async function getDataSourcePerformanceSafe(): Promise<DataSource[]> {
  try {
    return await getDataSourcePerformance();
  } catch (error) {
    console.log('[v0] Error fetching data sources:', error);
    return [];
  }
}
