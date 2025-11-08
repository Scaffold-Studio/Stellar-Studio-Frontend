/**
 * StatusBadge Component - 2025 Design System
 *
 * Status indicators with new color scheme
 * Used for contract states (active/paused), transaction states, etc.
 */

'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Clock, Pause, LucideIcon } from 'lucide-react';

type StatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'pending'
  | 'active'
  | 'paused'
  | 'inactive'
  | 'passed'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { label: string; icon: LucideIcon; className: string }
> = {
  success: {
    label: 'Success',
    icon: CheckCircle2,
    className: 'bg-accent-success/10 text-accent-success border-accent-success/20',
  },
  error: {
    label: 'Error',
    icon: XCircle,
    className: 'bg-accent-error/10 text-accent-error border-accent-error/20',
  },
  warning: {
    label: 'Warning',
    icon: AlertCircle,
    className: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  },
  active: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-accent-success/10 text-accent-success border-accent-success/20',
  },
  paused: {
    label: 'Paused',
    icon: Pause,
    className: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  },
  inactive: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-text-quaternary/10 text-text-quaternary border-text-quaternary/20',
  },
  passed: {
    label: 'Passed',
    icon: CheckCircle2,
    className: 'bg-accent-success/10 text-accent-success border-accent-success/20',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-accent-error/10 text-accent-error border-accent-error/20',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
} as const;

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border inline-flex items-center gap-1.5',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" />}
      {displayLabel}
    </Badge>
  );
}
