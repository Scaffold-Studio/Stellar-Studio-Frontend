/**
 * Activity Provider
 *
 * Tracks recent transactions and contract interactions
 * Provides activity history for UI components
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { transactionEvents, TransactionEvent, TransactionEventType } from '@/lib/stellar/events/transaction-events';
import { toast } from '@/components/toast';

// Activity item - simplified view of transaction events
export interface ActivityItem {
  id: string;
  timestamp: number;
  type: 'transaction' | 'query';
  status: 'pending' | 'success' | 'failed' | 'timeout';
  contractAddress: string;
  operation: string;
  hash?: string;
  result?: any;
  error?: string;
  network: 'testnet' | 'mainnet' | 'local';
  durationMs?: number;
}

interface ActivityContextType {
  activities: ActivityItem[];
  pendingActivities: ActivityItem[];
  recentActivities: ActivityItem[]; // Last 20 completed activities
  clearActivities: () => void;
  getActivityByHash: (hash: string) => ActivityItem | undefined;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const MAX_ACTIVITIES = 100; // Maximum activities to keep in memory
const MAX_RECENT = 20; // Maximum recent activities to show
const STORAGE_KEY = 'stellar-studio-activities'; // localStorage key

// Load activities from localStorage
function loadActivitiesFromStorage(): ActivityItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as ActivityItem[];
    // Filter out pending transactions (they're ephemeral)
    return parsed.filter((a) => a.status !== 'pending');
  } catch (error) {
    console.warn('[ActivityProvider] Failed to load from localStorage:', error);
    return [];
  }
}

// Save activities to localStorage
function saveActivitiesToStorage(activities: ActivityItem[]) {
  if (typeof window === 'undefined') return;

  try {
    // Only save completed transactions (exclude pending)
    const toSave = activities.filter((a) => a.status !== 'pending');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('[ActivityProvider] Failed to save to localStorage:', error);
  }
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>(loadActivitiesFromStorage);

  // Handle transaction events
  const handleEvent = useCallback((event: TransactionEvent) => {
    console.log('[ActivityProvider] Event received:', event.type);

    setActivities((prev) => {
      let updated = [...prev];
      const existingIndex = updated.findIndex((a) => a.id === event.id);

      switch (event.type) {
        case TransactionEventType.TX_INITIATED: {
          // Create new activity
          const newActivity: ActivityItem = {
            id: event.id,
            timestamp: event.timestamp,
            type: 'transaction',
            status: 'pending',
            contractAddress: event.contractAddress,
            operation: event.operation,
            network: event.network,
          };
          updated.unshift(newActivity);
          break;
        }

        case TransactionEventType.TX_SENT: {
          // Update with hash
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              hash: event.hash,
              status: 'pending',
            };
          }

          // Show toast
          toast({
            type: 'success',
            description: `Transaction sent: ${event.operation}`,
          });
          break;
        }

        case TransactionEventType.TX_SUCCESS: {
          // Update with success
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: 'success',
              result: event.result,
              durationMs: event.durationMs,
            };
          }

          // Show success toast
          toast({
            type: 'success',
            description: `✓ ${event.operation} completed successfully`,
          });
          break;
        }

        case TransactionEventType.TX_FAILED: {
          // Update with failure
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: 'failed',
              error: event.error,
              hash: event.hash || updated[existingIndex].hash,
            };
          }

          // Show error toast
          toast({
            type: 'error',
            description: `✗ ${event.operation} failed: ${event.error}`,
          });
          break;
        }

        case TransactionEventType.TX_TIMEOUT: {
          // Update with timeout
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: 'timeout',
              error: 'Transaction timed out',
            };
          }

          // Show timeout toast
          toast({
            type: 'error',
            description: `⏱ ${event.operation} timed out`,
          });
          break;
        }

        case TransactionEventType.QUERY_STARTED: {
          // Create new query activity
          const newActivity: ActivityItem = {
            id: event.id,
            timestamp: event.timestamp,
            type: 'query',
            status: 'pending',
            contractAddress: event.contractAddress,
            operation: event.method,
            network: event.network,
          };
          updated.unshift(newActivity);
          break;
        }

        case TransactionEventType.QUERY_SUCCESS: {
          // Update query with success
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: 'success',
              result: event.result,
              durationMs: event.durationMs,
            };
          }
          break;
        }

        case TransactionEventType.QUERY_FAILED: {
          // Update query with failure
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: 'failed',
              error: event.error,
            };
          }
          break;
        }
      }

      // Limit total activities
      if (updated.length > MAX_ACTIVITIES) {
        updated = updated.slice(0, MAX_ACTIVITIES);
      }

      return updated;
    });
  }, []);

  // Subscribe to transaction events
  useEffect(() => {
    const unsubscribe = transactionEvents.onAll(handleEvent);
    return unsubscribe;
  }, [handleEvent]);

  // Save to localStorage whenever activities change
  useEffect(() => {
    saveActivitiesToStorage(activities);
  }, [activities]);

  // Get pending activities
  const pendingActivities = activities.filter((a) => a.status === 'pending');

  // Get recent completed activities
  const recentActivities = activities
    .filter((a) => a.status !== 'pending')
    .slice(0, MAX_RECENT);

  // Clear all activities
  const clearActivities = useCallback(() => {
    setActivities([]);
    // Also clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[ActivityProvider] Failed to clear localStorage:', error);
    }
  }, []);

  // Get activity by transaction hash
  const getActivityByHash = useCallback(
    (hash: string) => {
      return activities.find((a) => a.hash === hash);
    },
    [activities]
  );

  const value: ActivityContextType = {
    activities,
    pendingActivities,
    recentActivities,
    clearActivities,
    getActivityByHash,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
