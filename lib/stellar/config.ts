import { Networks } from '@stellar/stellar-sdk';

export interface NetworkConfig {
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
}

export const NETWORK_CONFIG: Record<string, NetworkConfig> = {
  testnet: {
    networkPassphrase: Networks.TESTNET,
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  local: {
    networkPassphrase: Networks.STANDALONE,
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    horizonUrl: 'http://localhost:8000',
  },
  mainnet: {
    networkPassphrase: Networks.PUBLIC,
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
  },
};

export function getNetworkConfig(): NetworkConfig {
  const network = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet') as string;

  if (!NETWORK_CONFIG[network]) {
    console.warn(`Unknown network: ${network}, defaulting to testnet`);
    return NETWORK_CONFIG.testnet;
  }

  return NETWORK_CONFIG[network];
}

export function getCurrentNetwork(): 'testnet' | 'mainnet' | 'local' {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
  if (network === 'testnet' || network === 'mainnet' || network === 'local') {
    return network;
  }
  return 'testnet';
}

// Contract Factory Addresses - Local network (hardcoded)
const LOCAL_FACTORY_ADDRESSES = {
  master_factory: 'CD52S6RP2P2RRPNUJOSMGVU43YLVJ2WALAYX6KIB3THMYAY3RWXY5CWS',
  token_factory: 'CBNNOTTOYXFBVRLRZO4IM65D2TCK7672C73QAVKIWA6NBRADB6QSPP5I',
  nft_factory: 'CBU4DRASKHPXQT6XETOYOIY7IFG3KBOC55XXKNNNSNSUPFWASUQQF5IR',
  governance_factory: 'CCRQ53J4INNSRRJYJKOAL7OKK2VYNHWIOILUGCO273IOCXCV5GTWWP74',
};

// Testnet addresses - hardcoded (from deployment)
// Updated Nov 10, 2025 - NFT Factory with custom metadata support
const TESTNET_FACTORY_ADDRESSES = {
  master_factory: 'CCQM52Z3ANW6TGJQMAS7GK5SD5U4ZHZKHAA6BXBFVRMYDDCASOAC3N3G',
  token_factory: 'CAHLJEQUCNTV7JPAPCMLCBIHOX7FFB57DUARJ6XGTW27FPCVKKY7JM2A',
  nft_factory: 'CB47RPH7MM662KJ3ZJLPEP4PVJIFUL4NQKKYNWZQ3J773MQUJYU33GCZ', // ✅ Updated with metadata support
  governance_factory: 'CC3SLHSCJHP7YJ462ZIACJ54VOHL5ZFUODZKBTITIZSO74D4YOPR5WCE',
};

export type FactoryType = 'master_factory' | 'token_factory' | 'nft_factory' | 'governance_factory';

export function getFactoryAddress(factoryType: FactoryType): string {
  const network = getCurrentNetwork();

  let address: string;

  if (network === 'local') {
    address = LOCAL_FACTORY_ADDRESSES[factoryType];
  } else if (network === 'testnet') {
    address = TESTNET_FACTORY_ADDRESSES[factoryType];
  } else {
    // Mainnet - read from env
    const envKey = `NEXT_PUBLIC_${factoryType.toUpperCase()}`;
    address = process.env[envKey] || '';
  }

  console.log(`[Config] Getting factory address for ${factoryType} on ${network}:`, address);

  if (!address || address.length === 0) {
    throw new Error(
      `Factory contract address not configured for ${factoryType} on ${network} network. ` +
      `Please check your configuration.`
    );
  }

  return address;
}