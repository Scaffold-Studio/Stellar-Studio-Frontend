import {
  StellarWalletsKit,
  allowAllModules,
  FREIGHTER_ID,
  WalletNetwork,
} from '@creit.tech/stellar-wallets-kit';
import { getNetworkConfig } from './config';

const SELECTED_WALLET_ID = 'selectedWalletId';

export function getSelectedWalletId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_WALLET_ID);
}

export function setSelectedWalletId(walletId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_WALLET_ID, walletId);
}

export function clearSelectedWalletId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELECTED_WALLET_ID);
}

// Initialize the wallet kit
export function createWalletKit(): StellarWalletsKit {
  const config = getNetworkConfig();

  // Map Stellar network passphrase to WalletNetwork
  let network: WalletNetwork;
  if (config.networkPassphrase.includes('Test')) {
    network = WalletNetwork.TESTNET;
  } else if (config.networkPassphrase.includes('Public')) {
    network = WalletNetwork.PUBLIC;
  } else {
    network = WalletNetwork.STANDALONE;
  }

  return new StellarWalletsKit({
    modules: allowAllModules(),
    network,
    selectedWalletId: getSelectedWalletId() || FREIGHTER_ID,
  });
}

// Wallet kit singleton
let walletKitInstance: StellarWalletsKit | null = null;

export function getWalletKit(): StellarWalletsKit {
  if (!walletKitInstance) {
    walletKitInstance = createWalletKit();
  }
  return walletKitInstance;
}

export function resetWalletKit(): void {
  walletKitInstance = null;
}

// Helper functions
export async function getPublicKey(): Promise<string | null> {
  if (!getSelectedWalletId()) return null;

  try {
    const kit = getWalletKit();
    const { address } = await kit.getAddress();
    return address;
  } catch (error) {
    console.error('Error getting public key:', error);
    return null;
  }
}

export async function connect(callback?: () => Promise<void>): Promise<string | null> {
  try {
    const kit = getWalletKit();

    return await new Promise((resolve) => {
      kit.openModal({
        onWalletSelected: async (option) => {
          try {
            setSelectedWalletId(option.id);
            if (callback) await callback();
            const { address } = await kit.getAddress();
            resolve(address);
          } catch (e) {
            console.error('Error connecting wallet:', e);
            resolve(null);
          }
        },
        onClosed: () => {
          resolve(null);
        },
      });
    });
  } catch (error) {
    console.error('Error opening wallet modal:', error);
    return null;
  }
}

export async function disconnect(callback?: () => Promise<void>): Promise<void> {
  try {
    clearSelectedWalletId();
    resetWalletKit();
    if (callback) await callback();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
}

export async function signTransaction(xdr: string): Promise<string> {
  const kit = getWalletKit();
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    networkPassphrase: getNetworkConfig().networkPassphrase,
  });
  return signedTxXdr;
}
