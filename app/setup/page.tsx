import { checkDatabaseSetup } from '@/lib/db-helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SetupActions } from '@/components/setup/setup-actions';

export default async function SetupPage() {
  const setupStatus = await checkDatabaseSetup();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Database className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Database Setup</h1>
          <p className="text-muted-foreground">
            Check and configure your intelligence system database
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {setupStatus.isSetup ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Database Ready
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Setup Required
                </>
              )}
            </CardTitle>
            <CardDescription>
              {setupStatus.isSetup
                ? 'All required tables are configured correctly'
                : 'Some database tables are missing and need to be created'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!setupStatus.isSetup && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Missing Tables:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {setupStatus.missingTables.map((table) => (
                      <li key={table} className="text-muted-foreground">
                        {table}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-400">Setup Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Open your Supabase dashboard</li>
                    <li>Go to the SQL Editor</li>
                    <li>Run these scripts in order:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li className="font-mono text-xs">scripts/001_create_tables.sql</li>
                        <li className="font-mono text-xs">scripts/002_seed_data.sql</li>
                      </ul>
                    </li>
                    <li>Refresh this page to verify setup</li>
                  </ol>
                </div>

                <SetupActions isSetup={false} />
              </div>
            )}

            {setupStatus.isSetup && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                  <p className="text-sm text-green-400">
                    Your database is properly configured. You can now use the intelligence dashboard.
                  </p>
                </div>

                <SetupActions isSetup={true} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table Structure</CardTitle>
            <CardDescription>Required tables for the intelligence system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { name: 'currency_pairs', desc: '7 major pairs + gold' },
                { name: 'data_sources', desc: '15 platforms tracked' },
                { name: 'signals', desc: 'Detected market signals' },
                { name: 'signal_outcomes', desc: 'Validation results' },
                { name: 'raw_data_collection', desc: 'Collected data archive' },
                { name: 'learning_metrics', desc: 'AI learning progress' },
                { name: 'alert_history', desc: 'High-confidence alerts' },
              ].map((table) => (
                <div
                  key={table.name}
                  className={`p-3 rounded-lg border ${
                    setupStatus.missingTables.includes(table.name)
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-green-500/10 border-green-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono font-semibold">{table.name}</p>
                      <p className="text-xs text-muted-foreground">{table.desc}</p>
                    </div>
                    {setupStatus.missingTables.includes(table.name) ? (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
