/**
 * LoadingCard Component - 2025 Design System
 *
 * Consistent loading skeleton with new colors
 * Used while fetching data from blockchain
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  title?: string;
  lines?: number;
  showIcon?: boolean;
  className?: string;
}

export function LoadingCard({
  title,
  lines = 3,
  showIcon = true,
  className,
}: LoadingCardProps) {
  return (
    <Card className={cn('border-border-subtle bg-bg-secondary animate-pulse', className)}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
        {showIcon && (
          <Skeleton className="size-9 rounded-lg bg-bg-tertiary" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-bg-tertiary" />
          {title && <Skeleton className="h-4 w-48 bg-bg-tertiary/50" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4 bg-bg-tertiary',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
}
