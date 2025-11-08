#!/usr/bin/env python3
"""
Fixes all remaining Stellar tool handlers in message.tsx
Replaces old component references with StellarTransactionWrapper or proper display components
"""

# WRITE tools that need StellarTransactionWrapper (return transaction data)
WRITE_TOOLS = {
    # Token operations
    'tokenTransfer': ('Transfer Token', 'amber'),
    'tokenTransferFrom': ('Transfer Token From', 'amber'),
    'tokenApprove': ('Approve Token Spending', 'amber'),
    'tokenMint': ('Mint Tokens', 'amber'),
    'tokenBurn': ('Burn Tokens', 'amber'),
    'tokenBurnFrom': ('Burn Tokens From', 'amber'),
    'tokenPause': ('Pause Token', 'amber'),
    'tokenUnpause': ('Unpause Token', 'amber'),

    # NFT operations
    'nftMint': ('Mint NFT', 'blue'),
    'nftTransfer': ('Transfer NFT', 'blue'),
    'nftTransferFrom': ('Transfer NFT From', 'blue'),
    'nftApprove': ('Approve NFT', 'blue'),
    'nftApproveForAll': ('Approve All NFTs', 'blue'),
    'nftBurn': ('Burn NFT', 'blue'),
    'nftBurnFrom': ('Burn NFT From', 'blue'),

    # Governance
    'governanceVote': ('Cast Vote', 'green'),
}

# READ tools that just display data
READ_TOOLS = [
    'tokenBalance', 'tokenTotalSupply', 'tokenAllowance', 'tokenDecimals',
    'tokenName', 'tokenSymbol', 'tokenPaused',
    'nftBalance', 'nftOwnerOf', 'nftGetApproved', 'nftIsApprovedForAll',
    'nftTokenUri', 'nftName', 'nftSymbol', 'nftTotalSupply',
    'nftGetOwnerTokenId', 'nftGetTokenId',
    'governanceHasVoted', 'governanceGetVoteResults',
    'getBalance', 'getContractInfo',
]

# Factory query tools
FACTORY_TOOLS = [
    'getDeployedTokens', 'getTokensByType', 'getTokensByAdmin', 'getTokenCount',
    'getDeployedNFTs', 'getNFTsByType', 'getNFTsByOwner', 'getNFTCount',
    'getDeployedGovernance', 'getGovernanceByType', 'getGovernanceByAdmin', 'getGovernanceCount',
]

# Registry tools
REGISTRY_TOOLS = ['registryListPublished']  # Others were deleted

# Utility tools
UTILITY_TOOLS = [
    'utilitiesBuildAllowlistConfig', 'utilitiesBuildCappedConfig', 'utilitiesBuildGovernanceConfig',
    'utilitiesBuildMerkleTree', 'utilitiesBuildNftConfig', 'utilitiesBuildPausableConfig',
    'utilitiesBuildTokenConfig', 'utilitiesCreateMerkleRoot', 'utilitiesFormatAmountFromContract',
    'utilitiesFormatAmountToContract', 'utilitiesFormatWithDecimals', 'utilitiesGenerateMultipleSalts',
    'utilitiesGenerateSalt', 'utilitiesParseAmount', 'utilitiesValidateAddress',
    'utilitiesValidateGovernanceConfig', 'utilitiesValidateTokenConfig',
]

def generate_write_handler(tool_name, title, color):
    """Generate handler for WRITE tools (return transaction data)"""
    return f'''              if (type === "tool-{tool_name}") {{
                if ("toolCallId" in part && "state" in part) {{
                  const {{ toolCallId, state }} = part;
                  if (state === "input-available") {{
                    return (
                      <div key={{toolCallId}}>
                        <ToolCallLoader loadingMessage="{title}..." />
                      </div>
                    );
                  }}
                  if (state === "output-available" && "output" in part) {{
                    const {{ output }} = part;
                    if (output.success && output.transaction) {{
                      return (
                        <div key={{toolCallId}}>
                          <StellarTransactionWrapper
                            transactionData={{output.transaction}}
                            buttonText="{title}"
                          >
                            <div className="space-y-2 p-4 border border-{color}-500/50 rounded-lg bg-{color}-500/5">
                              <h3 className="text-lg font-semibold">{title}</h3>
                              <p className="text-sm text-gray-400">{{output.message}}</p>
                            </div>
                          </StellarTransactionWrapper>
                        </div>
                      );
                    }}
                    if (!output.success) {{
                      return (
                        <div key={{toolCallId}} className="text-red-500 p-4 border border-red-500/50 rounded-lg bg-red-500/5">
                          <p className="font-semibold">Operation Failed</p>
                          <p className="text-sm">{{output.error || output.message}}</p>
                        </div>
                      );
                    }}
                  }}
                }}
              }}'''

def generate_read_handler(tool_name):
    """Generate handler for READ tools (display data)"""
    return f'''              if (type === "tool-{tool_name}") {{
                if ("toolCallId" in part && "state" in part) {{
                  const {{ toolCallId, state }} = part;
                  if (state === "input-available") {{
                    return (
                      <div key={{toolCallId}}>
                        <ToolCallLoader loadingMessage="Fetching data..." />
                      </div>
                    );
                  }}
                  if (state === "output-available" && "output" in part) {{
                    const {{ output }} = part;
                    return (
                      <div key={{toolCallId}}>
                        <ContractInfoDisplay
                          title="{{output.message || 'Query Result'}}"
                          data={{output.data}}
                          success={{output.success}}
                          error={{output.error}}
                        />
                      </div>
                    );
                  }}
                }}
              }}'''

def generate_factory_handler(tool_name):
    """Generate handler for factory query tools"""
    return f'''              if (type === "tool-{tool_name}") {{
                if ("toolCallId" in part && "state" in part) {{
                  const {{ toolCallId, state }} = part;
                  if (state === "input-available") {{
                    return (
                      <div key={{toolCallId}}>
                        <ToolCallLoader loadingMessage="Querying factory..." />
                      </div>
                    );
                  }}
                  if (state === "output-available" && "output" in part) {{
                    const {{ output }} = part;
                    return (
                      <div key={{toolCallId}}>
                        <FactoryQueryResults
                          data={{output.data}}
                          message={{output.message}}
                          success={{output.success}}
                          error={{output.error}}
                        />
                      </div>
                    );
                  }}
                }}
              }}'''

def generate_utility_handler(tool_name):
    """Generate handler for utility tools"""
    return f'''              if (type === "tool-{tool_name}") {{
                if ("toolCallId" in part && "state" in part) {{
                  const {{ toolCallId, state }} = part;
                  if (state === "input-available") {{
                    return (
                      <div key={{toolCallId}}>
                        <ToolCallLoader loadingMessage="Processing..." />
                      </div>
                    );
                  }}
                  if (state === "output-available" && "output" in part) {{
                    const {{ output }} = part;
                    return (
                      <div key={{toolCallId}}>
                        <UtilityResults
                          data={{output.data}}
                          message={{output.message}}
                          success={{output.success}}
                          error={{output.error}}
                        />
                      </div>
                    );
                  }}
                }}
              }}'''

print("Python script created - ready to generate handlers")
print(f"WRITE tools: {len(WRITE_TOOLS)}")
print(f"READ tools: {len(READ_TOOLS)}")
print(f"Factory tools: {len(FACTORY_TOOLS)}")
print(f"Utility tools: {len(UTILITY_TOOLS)}")
print(f"Total: {len(WRITE_TOOLS) + len(READ_TOOLS) + len(FACTORY_TOOLS) + len(UTILITY_TOOLS)}")
