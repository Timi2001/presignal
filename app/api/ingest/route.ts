import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface RawDataItem {
  source_platform: string;
  source_name: string;
  content: string;
  metadata: Record<string, unknown>;
  collected_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: RawDataItem[] = await request.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Insert raw data into database
    const { data: inserted, error } = await supabase
      .from('raw_data_collection')
      .insert(data.map(item => ({
        source_platform: item.source_platform,
        source_name: item.source_name,
        content: item.content,
        metadata: item.metadata,
        collected_at: item.collected_at,
        processed: false
      })))
      .select();

    if (error) {
      console.error('[v0] Database insert error:', error);
      return NextResponse.json(
        { error: 'Failed to insert data', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[v0] Successfully ingested ${inserted?.length || 0} items`);

    return NextResponse.json({
      success: true,
      items_ingested: inserted?.length || 0,
      message: 'Data ingested successfully'
    });

  } catch (error) {
    console.error('[v0] Ingestion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
