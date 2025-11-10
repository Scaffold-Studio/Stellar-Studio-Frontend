/**
 * NFTContractInfo Component - 2025 Design System
 *
 * Displays NFT contract information with image support for token URI
 * Updated with new color scheme and image display
 * Presentational component - accepts data as props, no fetching
 */

'use client';

import { useEffect, useState } from 'react';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { InfoCard } from '@/components/shared/InfoCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Image as ImageIcon, Coins, User } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';

// Proper types based on tool return data
type NetworkType = 'local' | 'testnet' | 'mainnet';

type NFTBalanceData = {
  contractAddress: string;
  account: string;
  balance: string;
  network: NetworkType;
};

type NFTOwnerOfData = {
  contractAddress: string;
  tokenId: number;
  owner: string;
  network: NetworkType;
};

type NFTGetApprovedData = {
  contractAddress: string;
  tokenId: number;
  approved: string;
  network: NetworkType;
};

type NFTIsApprovedForAllData = {
  contractAddress: string;
  owner: string;
  operator: string;
  isApproved: boolean;
  network: NetworkType;
};

type NFTTokenUriData = {
  contractAddress: string;
  tokenId: number;
  tokenUri: string;
  network: NetworkType;
};

type NFTNameData = {
  contractAddress: string;
  name: string;
  network: NetworkType;
};

type NFTSymbolData = {
  contractAddress: string;
  symbol: string;
  network: NetworkType;
};

type NFTTotalSupplyData = {
  contractAddress: string;
  totalSupply: string;
  network: NetworkType;
};

type NFTGetOwnerTokenIdData = {
  contractAddress: string;
  owner: string;
  index: number;
  tokenId: string;
  network: NetworkType;
};

type NFTGetTokenIdData = {
  contractAddress: string;
  index: number;
  tokenId: string;
  network: NetworkType;
};

// Union type for all NFT query data types
type NFTQueryData =
  | NFTBalanceData
  | NFTOwnerOfData
  | NFTGetApprovedData
  | NFTIsApprovedForAllData
  | NFTTokenUriData
  | NFTNameData
  | NFTSymbolData
  | NFTTotalSupplyData
  | NFTGetOwnerTokenIdData
  | NFTGetTokenIdData;

type QueryType =
  | 'balance'
  | 'owner-of'
  | 'get-approved'
  | 'is-approved-for-all'
  | 'token-uri'
  | 'name'
  | 'symbol'
  | 'total-supply'
  | 'get-owner-token-id'
  | 'get-token-id';

interface NFTContractInfoProps {
  queryType: QueryType;
  data: NFTQueryData;
  error?: string;
}

const QUERY_LABELS: Record<QueryType, string> = {
  'balance': 'NFT Balance',
  'owner-of': 'NFT Owner',
  'get-approved': 'Approved Address',
  'is-approved-for-all': 'Operator Approval',
  'token-uri': 'NFT Metadata',
  'name': 'Collection Name',
  'symbol': 'Collection Symbol',
  'total-supply': 'Total Supply',
  'get-owner-token-id': 'Token ID by Owner',
  'get-token-id': 'Token ID by Index',
};

export default function NFTContractInfo({
  queryType,
  data,
  error,
}: NFTContractInfoProps) {
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch NFT metadata from URI
  useEffect(() => {
    const fetchMetadata = async () => {
      if (queryType === 'token-uri') {
        const uriData = data as NFTTokenUriData;
        if (uriData.tokenUri) {
          setImageLoading(true);
          try {
            // If it's an IPFS URI, convert to HTTP gateway
            let uri = uriData.tokenUri;
            if (uri.startsWith('ipfs://')) {
              uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }

            const response = await fetch(uri);
            const metadata = await response.json();
            setNftMetadata(metadata);
          } catch (err) {
            console.error('Error fetching NFT metadata:', err);
          } finally {
            setImageLoading(false);
          }
        }
      }
    };

    fetchMetadata();
  }, [data, queryType]);

  const formatResult = () => {
    switch (queryType) {
      case 'balance':
        const balanceData = data as NFTBalanceData;
        return (
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-accent-purple" />
            <span className="text-2xl font-bold text-text-primary">
              {balanceData.balance}
            </span>
          </div>
        );

      case 'total-supply':
        const supplyData = data as NFTTotalSupplyData;
        return (
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-accent-purple" />
            <span className="text-2xl font-bold text-text-primary">
              {supplyData.totalSupply}
            </span>
          </div>
        );

      case 'get-owner-token-id':
        const ownerTokenData = data as NFTGetOwnerTokenIdData;
        return (
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-accent-purple" />
            <span className="text-2xl font-bold text-text-primary">
              {ownerTokenData.tokenId}
            </span>
          </div>
        );

      case 'get-token-id':
        const tokenIdData = data as NFTGetTokenIdData;
        return (
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-accent-purple" />
            <span className="text-2xl font-bold text-text-primary">
              {tokenIdData.tokenId}
            </span>
          </div>
        );

      case 'is-approved-for-all':
        const approvalData = data as NFTIsApprovedForAllData;
        return (
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${approvalData.isApproved ? 'text-accent-success' : 'text-text-tertiary'}`}>
              {approvalData.isApproved ? 'Approved for All' : 'Not Approved'}
            </span>
          </div>
        );

      case 'token-uri':
        const uriData = data as NFTTokenUriData;
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ImageIcon className="size-5 text-accent-purple shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-text-tertiary mb-2">Token URI</p>
                <code className="text-xs text-accent-cyan bg-bg-tertiary px-3 py-2 rounded-lg border border-border-subtle block break-all font-mono">
                  {uriData.tokenUri}
                </code>
              </div>
            </div>

            {/* NFT Image Display */}
            {nftMetadata && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border-subtle rounded-lg overflow-hidden bg-bg-tertiary"
              >
                {nftMetadata.image && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={nftMetadata.image.startsWith('ipfs://')
                        ? nftMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                        : nftMetadata.image
                      }
                      alt={nftMetadata.name || 'NFT'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-nft.png';
                      }}
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {nftMetadata.name && (
                    <h4 className="font-semibold text-text-primary">{nftMetadata.name}</h4>
                  )}
                  {nftMetadata.description && (
                    <p className="text-sm text-text-secondary">{nftMetadata.description}</p>
                  )}
                  {nftMetadata.attributes && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {nftMetadata.attributes.map((attr: any, idx: number) => (
                        <div key={idx} className="bg-bg-secondary rounded-md p-2">
                          <p className="text-xs text-text-tertiary">{attr.trait_type}</p>
                          <p className="text-sm text-text-primary font-medium">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {imageLoading && (
              <div className="flex items-center justify-center p-8 bg-bg-tertiary rounded-lg border border-border-subtle">
                <div className="animate-spin size-8 border-2 border-accent-cyan border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        );

      case 'owner-of':
        const ownerData = data as NFTOwnerOfData;
        return (
          <AddressDisplay
            address={ownerData.owner}
            label="Owner"
            showCopy={true}
            showExplorer={true}
            network={ownerData.network}
          />
        );

      case 'get-approved':
        const approvedData = data as NFTGetApprovedData;
        return (
          <AddressDisplay
            address={approvedData.approved}
            label="Approved Address"
            showCopy={true}
            showExplorer={true}
            network={approvedData.network}
          />
        );

      case 'name':
        const nameData = data as NFTNameData;
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">Collection Name</p>
            <p className="text-2xl font-bold text-text-primary">{nameData.name}</p>
          </div>
        );

      case 'symbol':
        const symbolData = data as NFTSymbolData;
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">Symbol</p>
            <p className="text-2xl font-bold text-text-primary">{symbolData.symbol}</p>
          </div>
        );

      default:
        return (
          <pre className="text-xs text-text-secondary bg-bg-tertiary p-3 rounded-lg border border-border-subtle overflow-auto font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        );
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="bg-accent-error/10 border-accent-error/30">
        <AlertCircle className="size-4" />
        <AlertDescription className="text-text-secondary">
          {typeof error === 'string' ? error : 'Failed to fetch NFT information'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <InfoCard
      title={QUERY_LABELS[queryType]}
      description={`Query result from NFT contract`}
      icon={queryType === 'token-uri' ? ImageIcon : queryType.includes('balance') ? Coins : User}
      gradient="from-accent-purple/5 to-accent-cyan/5"
    >
      <div className="space-y-4">
        <AddressDisplay
          address={data.contractAddress}
          label="NFT Contract"
          showCopy={true}
          showExplorer={true}
          network={data.network}
          truncate={true}
        />

        <div className="pt-4 border-t border-border-subtle">
          {formatResult()}
        </div>
      </div>
    </InfoCard>
  );
}
