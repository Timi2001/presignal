import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { signalId } = await request.json();
    
    const supabase = await createClient();
    
    // Get signal details
    const { data: signal, error } = await supabase
      .from('signals')
      .select('*, currency_pairs(symbol)')
      .eq('id', signalId)
      .single();

    if (error || !signal) {
      throw new Error('Signal not found');
    }

    const alertEmail = process.env.ALERT_EMAIL;
    
    if (!alertEmail) {
      console.warn('[v0] ALERT_EMAIL not configured, skipping email');
      return NextResponse.json({
        success: false,
        message: 'Alert email not configured'
      });
    }

    // Send email alert (using a service like Resend, SendGrid, etc.)
    // For now, just log it
    console.log('[v0] ALERT: High confidence signal detected!');
    console.log(`Pair: ${signal.currency_pairs?.symbol}`);
    console.log(`Direction: ${signal.direction}`);
    console.log(`Confidence: ${(signal.confidence * 100).toFixed(0)}%`);
    console.log(`Narrative: ${signal.narrative}`);

    // TODO: Implement actual email sending
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'alerts@yourdomain.com',
    //   to: alertEmail,
    //   subject: `High Confidence Signal: ${signal.currency_pairs?.symbol} ${signal.direction}`,
    //   html: `<p>${signal.narrative}</p>`
    // });

    // Save to alert history
    await supabase.from('alert_history').insert({
      signal_id: signalId,
      alert_type: 'email',
      delivered: true
    });

    return NextResponse.json({
      success: true,
      message: 'Alert sent successfully'
    });

  } catch (error) {
    console.error('[v0] Alert sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send alert', details: String(error) },
      { status: 500 }
    );
  }
}
