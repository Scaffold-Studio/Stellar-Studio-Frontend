/**
 * NFTContractInfo Component - 2025 Design System
 *
 * Displays NFT contract information with image support for token URI
 * Updated with new color scheme and image display
 */

'use client';

import { useEffect, useState } from 'react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useContractQuery } from '@/lib/stellar/hooks/useContractQuery';
import { NFTContractClient } from '@/lib/stellar/clients';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { InfoCard } from '@/components/shared/InfoCard';
import { LoadingCard } from '@/components/shared/LoadingCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Image as ImageIcon, Coins, User } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';

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
  contractAddress: string;
  account?: string;
  tokenId?: number;
  owner?: string;
  operator?: string;
  index?: number;
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
  contractAddress,
  account,
  tokenId,
  owner,
  operator,
  index,
}: NFTContractInfoProps) {
  const wallet = useStellarWallet();
  const { query, isLoading, data, error } = useContractQuery<any>();
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet.publicKey) return;

      try {
        const client = new NFTContractClient(contractAddress, wallet);
        let assembled;

        switch (queryType) {
          case 'balance':
            if (!account) throw new Error('Account required for balance query');
            assembled = await client.balance(account);
            break;
          case 'owner-of':
            if (tokenId === undefined) throw new Error('Token ID required');
            assembled = await client.ownerOf(tokenId);
            break;
          case 'get-approved':
            if (tokenId === undefined) throw new Error('Token ID required');
            assembled = await client.getApproved(tokenId);
            break;
          case 'is-approved-for-all':
            if (!owner || !operator) throw new Error('Owner and operator required');
            assembled = await client.isApprovedForAll(owner, operator);
            break;
          case 'token-uri':
            if (tokenId === undefined) throw new Error('Token ID required');
            assembled = await client.tokenUri(tokenId);
            break;
          case 'name':
            assembled = await client.name();
            break;
          case 'symbol':
            assembled = await client.symbol();
            break;
          case 'total-supply':
            assembled = await client.totalSupply();
            break;
          case 'get-owner-token-id':
            if (!owner || index === undefined) throw new Error('Owner and index required');
            assembled = await client.getOwnerTokenId(owner, index);
            break;
          case 'get-token-id':
            if (index === undefined) throw new Error('Index required');
            assembled = await client.getTokenId(index);
            break;
          default:
            throw new Error(`Unknown query type: ${queryType}`);
        }

        await query(assembled);
      } catch (err: any) {
        console.error('Error fetching NFT info:', err);
      }
    };

    fetchData();
  }, [queryType, contractAddress, account, tokenId, owner, operator, index, wallet.publicKey]);

  // Fetch NFT metadata from URI
  useEffect(() => {
    const fetchMetadata = async () => {
      if (queryType === 'token-uri' && data && typeof data === 'string') {
        setImageLoading(true);
        try {
          // If it's an IPFS URI, convert to HTTP gateway
          let uri = data;
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
    };

    fetchMetadata();
  }, [data, queryType]);

  const formatResult = () => {
    switch (queryType) {
      case 'balance':
      case 'total-supply':
      case 'get-owner-token-id':
      case 'get-token-id':
        return (
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-accent-purple" />
            <span className="text-2xl font-bold text-text-primary">
              {data?.toString() || '0'}
            </span>
          </div>
        );
      
      case 'is-approved-for-all':
        return (
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${data ? 'text-accent-success' : 'text-text-tertiary'}`}>
              {data ? 'Approved for All' : 'Not Approved'}
            </span>
          </div>
        );
      
      case 'token-uri':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ImageIcon className="size-5 text-accent-purple shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-text-tertiary mb-2">Token URI</p>
                <code className="text-xs text-accent-cyan bg-bg-tertiary px-3 py-2 rounded-lg border border-border-subtle block break-all font-mono">
                  {data}
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
      case 'get-approved':
        return (
          <AddressDisplay
            address={data}
            label={queryType === 'owner-of' ? 'Owner' : 'Approved Address'}
            showCopy={true}
            showExplorer={true}
            network={wallet.network}
          />
        );
      
      case 'name':
      case 'symbol':
        return (
          <div>
            <p className="text-sm text-text-tertiary mb-2">
              {queryType === 'name' ? 'Collection Name' : 'Symbol'}
            </p>
            <p className="text-2xl font-bold text-text-primary">{data}</p>
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

  if (isLoading) {
    return <LoadingCard title={QUERY_LABELS[queryType]} lines={3} />;
  }

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
          address={contractAddress}
          label="NFT Contract"
          showCopy={true}
          showExplorer={true}
          network={wallet.network}
          truncate={true}
        />
        
        {data !== undefined && (
          <div className="pt-4 border-t border-border-subtle">
            {formatResult()}
          </div>
        )}
      </div>
    </InfoCard>
  );
}
