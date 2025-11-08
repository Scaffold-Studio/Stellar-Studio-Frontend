'use client';

import { useStellarWallet } from '@/hooks/useStellarWallet';
import { FileCode } from 'lucide-react';
import { InfoCard } from '@/components/shared/InfoCard';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContractInfoDisplayProps {
  contractType: 'token_factory' | 'nft_factory' | 'governance_factory' | 'master_factory' | 'all';
}

// Contract addresses from stellar-studio-mcp-server configuration
const CONTRACTS = {
  local: {
    master_factory: 'CD52S6RP2P2RRPNUJOSMGVU43YLVJ2WALAYX6KIB3THMYAY3RWXY5CWS',
    token_factory: 'CBNNOTTOYXFBVRLRZO4IM65D2TCK7672C73QAVKIWA6NBRADB6QSPP5I',
    nft_factory: 'CBU4DRASKHPXQT6XETOYOIY7IFG3KBOC55XXKNNNSNSUPFWASUQQF5IR',
    governance_factory: 'CCRQ53J4INNSRRJYJKOAL7OKK2VYNHWIOILUGCO273IOCXCV5GTWWP74',
  },
  testnet: {
    master_factory: 'TESTNET_MASTER_FACTORY_ADDRESS_HERE',
    token_factory: 'TESTNET_TOKEN_FACTORY_ADDRESS_HERE',
    nft_factory: 'TESTNET_NFT_FACTORY_ADDRESS_HERE',
    governance_factory: 'TESTNET_GOVERNANCE_FACTORY_ADDRESS_HERE',
  },
  mainnet: {
    master_factory: 'MAINNET_MASTER_FACTORY_ADDRESS_HERE',
    token_factory: 'MAINNET_TOKEN_FACTORY_ADDRESS_HERE',
    nft_factory: 'MAINNET_NFT_FACTORY_ADDRESS_HERE',
    governance_factory: 'MAINNET_GOVERNANCE_FACTORY_ADDRESS_HERE',
  },
};

const CONTRACT_DESCRIPTIONS = {
  master_factory: 'Main factory contract - deploys and manages all other factories',
  token_factory: 'Token factory - deploys custom Stellar tokens (SEP-41 compatible)',
  nft_factory: 'NFT factory - deploys NFT collections (ERC-721 compatible)',
  governance_factory: 'Governance factory - deploys voting contracts with merkle tree verification',
};

export default function ContractInfoDisplay({ contractType }: ContractInfoDisplayProps) {
  const { network } = useStellarWallet();

  const networkKey = network === 'testnet' ? 'testnet' : network === 'mainnet' ? 'mainnet' : 'local';
  const contracts = CONTRACTS[networkKey];

  const contractsToShow =
    contractType === 'all'
      ? Object.keys(contracts)
      : [contractType];

  return (
    <InfoCard
      title="Stellar Studio Contracts"
      icon={FileCode}
      gradient="from-purple-500/10 via-pink-500/10 to-orange-500/10 border-purple-500/30"
    >
      {/* Network Badge */}
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-700">
        <span className="text-sm text-zinc-400">Network:</span>
        <NetworkBadge network={network} />
      </div>

      {/* Contract List */}
      <div className="space-y-4">
        {contractsToShow.map((type) => {
          const address = contracts[type as keyof typeof contracts];
          const description = CONTRACT_DESCRIPTIONS[type as keyof typeof CONTRACT_DESCRIPTIONS];

          return (
            <div
              key={type}
              className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-3"
            >
              {/* Contract Name */}
              <div>
                <h3 className="font-semibold text-purple-300 capitalize">
                  {type.replace('_', ' ')}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">{description}</p>
              </div>

              {/* Contract Address */}
              <AddressDisplay
                address={address}
                label="Contract Address"
                network={network}
                showCopy={true}
                showExplorer={true}
              />
            </div>
          );
        })}
      </div>

      {/* Info Alert */}
      <Alert className="bg-purple-500/10 border-purple-500/30">
        <AlertDescription className="text-sm text-zinc-300">
          {contractType === 'all' ? (
            <>
              These are the deployed Stellar Studio factory contracts. Use them to deploy
              tokens, NFTs, and governance contracts on the {network} network.
            </>
          ) : (
            <>
              This contract is deployed and ready to use on the {network} network.
            </>
          )}
        </AlertDescription>
      </Alert>
    </InfoCard>
  );
}
