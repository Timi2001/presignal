'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SetupActionsProps {
  isSetup: boolean;
}

export function SetupActions({ isSetup }: SetupActionsProps) {
  if (!isSetup) {
    return (
      <Button onClick={() => window.location.reload()} className="w-full">
        Refresh Setup Status
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      <Button asChild className="flex-1">
        <Link href="/">Go to Dashboard</Link>
      </Button>
      <Button asChild variant="outline" className="flex-1">
        <Link href="/admin">Admin Panel</Link>
      </Button>
    </div>
  );
}
