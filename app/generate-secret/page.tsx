'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

export default function GenerateSecretPage() {
  const [secret, setSecret] = useState('')
  const [copied, setCopied] = useState(false)

  const generateSecret = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const base64 = btoa(String.fromCharCode(...array))
    setSecret(base64)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Generate CRON_SECRET</CardTitle>
          <CardDescription>
            Generate a secure random secret for your Vercel Cron Jobs and GitHub Actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateSecret} className="w-full">
            Generate Secret
          </Button>

          {secret && (
            <div className="space-y-2">
              <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                {secret}
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
            <p className="font-semibold">Next steps after copying:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Add to Vercel: Settings → Environment Variables → Add CRON_SECRET</li>
              <li>Add to GitHub: Settings → Secrets and variables → Actions → New secret</li>
              <li>Use the same value for both</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
