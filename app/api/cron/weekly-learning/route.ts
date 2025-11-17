import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[v0] Cron job triggered: Weekly learning')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/weekly-learning`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`Learning failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[v0] Weekly learning completed:', data)

    return NextResponse.json({
      success: true,
      message: 'Weekly learning completed',
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[v0] Cron learning error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
