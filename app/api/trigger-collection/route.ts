import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { collectAllMarketData } from '@/lib/collectors/unified-collector';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[v0] Starting real-time data collection...');
    
    const supabase = await createClient();
    
    const startTime = Date.now();
    const collectionPromise = collectAllMarketData();
    
    // Wait up to 45 seconds max
    const timeoutPromise = new Promise<any[]>((resolve) => 
      setTimeout(() => resolve([]), 45000)
    );
    
    const allData = await Promise.race([collectionPromise, timeoutPromise]);
    const elapsed = Date.now() - startTime;
    
    console.log(`[v0] Collected ${allData.length} items in ${elapsed}ms`);

    if (allData.length > 0) {
      const { error: insertError } = await supabase
        .from('raw_data_collection')
        .insert(allData.map(item => ({
          source_platform: item.source_type,
          source_name: item.source_name,
          content: item.content,
          metadata: item.metadata,
          collected_at: new Date().toISOString(),
          processed: false
        })));

      if (insertError) {
        console.error('[v0] Failed to insert data:', insertError);
        throw insertError;
      }
    }

    console.log('[v0] Data collection completed successfully');

    return NextResponse.json({
      success: true,
      items_collected: allData.length,
      elapsed_ms: elapsed,
      message: allData.length > 0 
        ? `Successfully collected ${allData.length} market signals`
        : 'No new signals detected'
    });

  } catch (error) {
    console.error('[v0] Collection error:', error);
    return NextResponse.json(
      { error: 'Collection failed', details: String(error) },
      { status: 500 }
    );
  }
}
