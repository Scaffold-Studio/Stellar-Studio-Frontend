/**
 * Transaction Event System
 *
 * Event types and emitter for tracking contract interactions and transactions
 * Enables activity tracking, toasts, and transaction receipts
 */

// ===== EVENT TYPES =====

export enum TransactionEventType {
  // Transaction lifecycle events
  TX_INITIATED = 'TX_INITIATED',
  TX_SIGNING = 'TX_SIGNING',
  TX_SENT = 'TX_SENT',
  TX_PENDING = 'TX_PENDING',
  TX_SUCCESS = 'TX_SUCCESS',
  TX_FAILED = 'TX_FAILED',
  TX_TIMEOUT = 'TX_TIMEOUT',

  // Contract query events (read operations)
  QUERY_STARTED = 'QUERY_STARTED',
  QUERY_SUCCESS = 'QUERY_SUCCESS',
  QUERY_FAILED = 'QUERY_FAILED',
}

// Base event interface
export interface BaseTransactionEvent {
  id: string; // Unique event ID
  timestamp: number; // Unix timestamp
  network: 'testnet' | 'mainnet' | 'local';
}

// Transaction initiated (before signing)
export interface TxInitiatedEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_INITIATED;
  contractAddress: string;
  operation: string; // e.g., "deploy_token", "transfer", "mint"
  params?: Record<string, any>;
}

// Transaction signing
export interface TxSigningEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_SIGNING;
  contractAddress: string;
  operation: string;
}

// Transaction sent to network
export interface TxSentEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_SENT;
  hash: string;
  contractAddress: string;
  operation: string;
}

// Transaction pending confirmation
export interface TxPendingEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_PENDING;
  hash: string;
  contractAddress: string;
  operation: string;
  attempts: number; // Polling attempts
}

// Transaction successful
export interface TxSuccessEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_SUCCESS;
  hash: string;
  contractAddress: string;
  operation: string;
  result?: any;
  durationMs: number; // Time from initiated to success
}

// Transaction failed
export interface TxFailedEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_FAILED;
  hash?: string;
  contractAddress: string;
  operation: string;
  error: string;
  stage: 'signing' | 'sending' | 'confirming'; // Where it failed
}

// Transaction timeout
export interface TxTimeoutEvent extends BaseTransactionEvent {
  type: TransactionEventType.TX_TIMEOUT;
  hash: string;
  contractAddress: string;
  operation: string;
  timeoutMs: number;
}

// Query started (read operation)
export interface QueryStartedEvent extends BaseTransactionEvent {
  type: TransactionEventType.QUERY_STARTED;
  contractAddress: string;
  method: string; // e.g., "balance", "total_supply"
  params?: Record<string, any>;
}

// Query successful
export interface QuerySuccessEvent extends BaseTransactionEvent {
  type: TransactionEventType.QUERY_SUCCESS;
  contractAddress: string;
  method: string;
  result: any;
  durationMs: number;
}

// Query failed
export interface QueryFailedEvent extends BaseTransactionEvent {
  type: TransactionEventType.QUERY_FAILED;
  contractAddress: string;
  method: string;
  error: string;
}

// Union type for all events
export type TransactionEvent =
  | TxInitiatedEvent
  | TxSigningEvent
  | TxSentEvent
  | TxPendingEvent
  | TxSuccessEvent
  | TxFailedEvent
  | TxTimeoutEvent
  | QueryStartedEvent
  | QuerySuccessEvent
  | QueryFailedEvent;

// ===== EVENT EMITTER =====

type EventListener = (event: TransactionEvent) => void;

class TransactionEventEmitter {
  private listeners: Map<TransactionEventType, Set<EventListener>> = new Map();
  private globalListeners: Set<EventListener> = new Set();

  /**
   * Subscribe to specific event type
   */
  on(eventType: TransactionEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Subscribe to all events
   */
  onAll(listener: EventListener): () => void {
    this.globalListeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /**
   * Emit an event
   */
  emit(event: TransactionEvent): void {
    // Call type-specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error('[TransactionEventEmitter] Listener error:', error);
        }
      });
    }

    // Call global listeners
    this.globalListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('[TransactionEventEmitter] Global listener error:', error);
      }
    });
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear();
    this.globalListeners.clear();
  }
}

// Singleton instance
export const transactionEvents = new TransactionEventEmitter();

// ===== EVENT HELPERS =====

/**
 * Generate unique event ID
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create base event
 */
export function createBaseEvent(network: 'testnet' | 'mainnet' | 'local'): BaseTransactionEvent {
  return {
    id: generateEventId(),
    timestamp: Date.now(),
    network,
  };
}
