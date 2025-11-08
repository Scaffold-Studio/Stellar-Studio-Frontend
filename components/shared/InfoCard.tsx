/**
 * InfoCard Component - 2025 Design System
 *
 * Reusable card pattern with new color scheme
 * Used across all Stellar components for consistent styling
 */

'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function InfoCard({
  title,
  description,
  icon: Icon,
  gradient,
  children,
  className,
  headerAction,
}: InfoCardProps) {
  return (
    <Card
      className={cn(
        'border-border-subtle bg-bg-secondary backdrop-blur-sm hover:border-accent-cyan/30 transition-all duration-300',
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className="p-2 rounded-lg bg-accent-cyan/10">
              <Icon className="size-5 text-accent-cyan" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-text-primary">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-text-tertiary mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        {headerAction && <div className="ml-2">{headerAction}</div>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
