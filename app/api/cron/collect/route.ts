import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    // Verify this is a Vercel Cron request
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[v0] Cron job triggered: Data collection')

    // Trigger collection
    const collectionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/trigger-collection`,
      { method: 'POST' }
    )

    if (!collectionResponse.ok) {
      throw new Error(`Collection failed: ${collectionResponse.statusText}`)
    }

    const collectionData = await collectionResponse.json()
    console.log('[v0] Collection completed:', collectionData)

    // Trigger AI processing
    const processingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/trigger-analysis`,
      { method: 'POST' }
    )

    if (!processingResponse.ok) {
      throw new Error(`Processing failed: ${processingResponse.statusText}`)
    }

    const processingData = await processingResponse.json()
    console.log('[v0] Processing completed:', processingData)

    return NextResponse.json({
      success: true,
      message: 'Data collection and processing completed',
      collection: collectionData,
      processing: processingData,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[v0] Cron job error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
