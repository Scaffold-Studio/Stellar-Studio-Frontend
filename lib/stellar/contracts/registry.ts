/**
 * Contract Registry
 *
 * Centralized registry of all deployed factory contract addresses
 * Addresses are loaded from environment variables based on the current network
 */

import { getCurrentNetwork } from '../config';

export interface ContractAddresses {
  master_factory: string;
  token_factory: string;
  nft_factory: string;
  governance_factory: string;
}

// Contract addresses by network
export const CONTRACTS: Record<string, ContractAddresses> = {
  testnet: {
    master_factory: process.env.NEXT_PUBLIC_MASTER_FACTORY || '',
    token_factory: process.env.NEXT_PUBLIC_TOKEN_FACTORY || 'CAHLJEQUCNTV7JPAPCMLCBIHOX7FFB57DUARJ6XGTW27FPCVKKY7JM2A',
    nft_factory: process.env.NEXT_PUBLIC_NFT_FACTORY || 'CDJQAGTVOK37NPBWMADBJDGFYM6BEAFV4T45S23D4LQLGSTMRRZ5RQ6X',
    governance_factory: process.env.NEXT_PUBLIC_GOVERNANCE_FACTORY || 'CC3SLHSCJHP7YJ462ZIACJ54VOHL5ZFUODZKBTITIZSO74D4YOPR5WCE',
  },
  local: {
    master_factory: 'CD52S6RP2P2RRPNUJOSMGVU43YLVJ2WALAYX6KIB3THMYAY3RWXY5CWS',
    token_factory: 'CBNNOTTOYXFBVRLRZO4IM65D2TCK7672C73QAVKIWA6NBRADB6QSPP5I',
    nft_factory: 'CBU4DRASKHPXQT6XETOYOIY7IFG3KBOC55XXKNNNSNSUPFWASUQQF5IR',
    governance_factory: 'CCRQ53J4INNSRRJYJKOAL7OKK2VYNHWIOILUGCO273IOCXCV5GTWWP74',
  },
  mainnet: {
    master_factory: '',
    token_factory: '',
    nft_factory: '',
    governance_factory: '',
  },
};

export type ContractType = keyof ContractAddresses;

/**
 * Get contract address for the current network
 */
export function getContractAddress(contractType: ContractType): string {
  const network = getCurrentNetwork();
  const addresses = CONTRACTS[network] || CONTRACTS.testnet;
  const address = addresses[contractType];

  if (!address) {
    throw new Error(`No ${contractType} address found for network: ${network}`);
  }

  return address;
}

/**
 * Get all contract addresses for the current network
 */
export function getAllContractAddresses(): ContractAddresses {
  const network = getCurrentNetwork();
  return CONTRACTS[network] || CONTRACTS.testnet;
}

/**
 * Check if a contract address is configured for the current network
 */
export function isContractConfigured(contractType: ContractType): boolean {
  try {
    const address = getContractAddress(contractType);
    return !!address;
  } catch {
    return false;
  }
}
