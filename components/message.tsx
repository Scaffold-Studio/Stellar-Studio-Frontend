"use client";
import cx from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useState } from "react";
import { Pencil, InfoIcon, Vote } from "lucide-react";
import Image from "next/image";
import { MessageActions } from "./message-actions";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";

// UI Components
import ToolCallLoader from "@/components/tool-call-loader";
import { SuggestionAwareMarkdown } from "@/components/SuggestionAwareMarkdown";
import { InfoCard } from "@/components/shared/InfoCard";

// Stellar Studio Components - Using new subdirectory structure with barrel exports
import { TokenContractInfo, TokenOperations, BalanceDisplay } from "@/components/stellar/tokens";
import { NFTContractInfo, NFTOperations } from "@/components/stellar/nfts";
import { GovernanceOperations, VoteDisplay } from "@/components/stellar/governance";
import { FactoryQueryResults, TokenFactoryDeploy, NFTFactoryDeploy, GovernanceFactoryDeploy } from "@/components/stellar/factories";
import { ContractInfoDisplay } from "@/components/stellar/utilities";
import { TransactionExecutor } from "@/components/stellar/TransactionExecutor";

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

/**
 * Helper to safely extract data from tool output
 * Handles both direct data format and transaction intent format
 */
function extractToolData(output: any): any {
  if (!output) return {};

  // If we have direct data, use it
  if (output.data) return output.data;

  // If we have a transaction object, merge contract address and params
  if (output.transaction) {
    return {
      contractAddress: output.transaction.contractAddress,
      ...output.transaction.params,
      network: output.transaction.network,
    };
  }

  return {};
}

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  sendMessage,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];

  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

  useDataStream();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message min-w-0"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full min-w-0 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center justify-center shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/images/stellar-studio-logo.jpeg"
                alt="Stellar Studio"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
          )}
          {message.role === "system" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <InfoIcon size={20} color="white" />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-4 w-full min-w-0 overflow-hidden break-words",
              {
                "min-h-96":
                  message.role === "assistant" && requiresScrollPadding,
              }
            )}
          >
            {attachmentsFromMessage.length > 0 && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2 flex-wrap"
              >
                {attachmentsFromMessage.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={{
                      name: attachment.filename ?? "file",
                      contentType: attachment.mediaType,
                      url: attachment.url,
                    }}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              // Debug logging for tool calls
              if (type.startsWith("tool-")) {
                console.log("🔧 Tool call detected:", {
                  type,
                  state: "state" in part ? part.state : "unknown",
                  hasOutput: "output" in part,
                  part
                });
              }

              if (type === "reasoning" && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.text}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start min-w-0">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100 shrink-0"
                              onClick={() => {
                                setMode("edit");
                              }}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4 min-w-0 max-w-full overflow-hidden", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <SuggestionAwareMarkdown
                          text={sanitizeText(part.text)}
                          sendMessage={sendMessage}
                        />
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              if (type === "tool-getUserWalletInfo") {
                const { toolCallId, state } = part;
                if (state === "input-available") {
                  return (
                    <div key={toolCallId}>
                      <ToolCallLoader loadingMessage="Getting your wallet info..." />
                    </div>
                  );
                }
              }

              // ========================= STELLAR STUDIO TOOLS =========================

              // ===========================
              // DEPLOYMENT TOOLS (3)
              // ===========================

              if (type === "tool-deployToken") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token deployment..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    if (output.success && output.data && output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <TransactionExecutor transaction={output.transaction}>
                            <TokenFactoryDeploy
                              tokenType={output.data.tokenType}
                              admin={output.data.admin}
                              manager={output.data.manager}
                              name={output.data.name}
                              symbol={output.data.symbol}
                              decimals={output.data.decimals}
                              initialSupply={output.data.initialSupply}
                              network={output.data.network}
                              cap={output.data.cap}
                              asset={output.data.asset}
                            />
                          </TransactionExecutor>
                        </div>
                      );
                    }
                    if (!output.success) {
                      return (
                        <div key={toolCallId} className="text-red-500 p-4 border border-red-500/50 rounded-lg bg-red-500/5">
                          <p className="font-semibold">Deployment Failed</p>
                          <p className="text-sm">{output.error || output.message}</p>
                        </div>
                      );
                    }
                  }
                }
              }

              if (type === "tool-deployNFT") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing NFT deployment..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    if (output.success && output.data && output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <TransactionExecutor transaction={output.transaction}>
                            <NFTFactoryDeploy
                              nftType={output.data.nftType}
                              owner={output.data.owner}
                              admin={output.data.admin}
                              manager={output.data.manager}
                              network={output.data.network}
                            />
                          </TransactionExecutor>
                        </div>
                      );
                    }
                    if (!output.success) {
                      return (
                        <div key={toolCallId} className="text-red-500 p-4 border border-red-500/50 rounded-lg bg-red-500/5">
                          <p className="font-semibold">Deployment Failed</p>
                          <p className="text-sm">{output.error || output.message}</p>
                        </div>
                      );
                    }
                  }
                }
              }

              if (type === "tool-deployGovernance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing governance deployment..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    if (output.success && output.data && output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <TransactionExecutor transaction={output.transaction}>
                            <GovernanceFactoryDeploy
                              governanceType={output.data.governanceType}
                              admin={output.data.admin}
                              owners={output.data.owners}
                              threshold={output.data.threshold}
                              rootHash={output.data.rootHash}
                              network={output.data.network}
                            />
                          </TransactionExecutor>
                        </div>
                      );
                    }
                    if (!output.success) {
                      return (
                        <div key={toolCallId} className="text-red-500 p-4 border border-red-500/50 rounded-lg bg-red-500/5">
                          <p className="font-semibold">Deployment Failed</p>
                          <p className="text-sm">{output.error || output.message}</p>
                        </div>
                      );
                    }
                  }
                }
              }

              // ===========================
              // UTILITY TOOLS (2)
              // ===========================

              if (type === "tool-getBalance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching wallet balance..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <BalanceDisplay address={output.data.address} />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getContractInfo") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching contract information..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <ContractInfoDisplay contractType={output.data.contractType} />
                      </div>
                    );
                  }
                }
              }

              // ===========================
              // FACTORY QUERY TOOLS (12)
              // ===========================

              // Token Factory Queries (4)
              if (type === "tool-getDeployedTokens") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching deployed tokens..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults 
                          factoryType="token" 
                          queryType="all" 
                          data={output.data?.tokens || []}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getTokensByType") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching tokens by type..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="token"
                          queryType="by-type"
                          filters={{ type: output.data.tokenType }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getTokensByAdmin") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching tokens by admin..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="token"
                          queryType="by-admin"
                          filters={{ admin: output.data.admin }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getTokenCount") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Counting deployed tokens..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults factoryType="token" queryType="count" />
                      </div>
                    );
                  }
                }
              }

              // NFT Factory Queries (4)
              if (type === "tool-getDeployedNFTs") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching deployed NFTs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults 
                          factoryType="nft" 
                          queryType="all"
                          data={output.data?.nfts || []}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getNFTsByType") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching NFTs by type..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="nft"
                          queryType="by-type"
                          filters={{ type: output.data.nftType }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getNFTsByOwner") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching NFTs by owner..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="nft"
                          queryType="by-owner"
                          filters={{ owner: output.data.owner }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getNFTCount") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Counting deployed NFTs..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults factoryType="nft" queryType="count" />
                      </div>
                    );
                  }
                }
              }

              // Governance Factory Queries (4)
              if (type === "tool-getDeployedGovernance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching deployed governance contracts..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults 
                          factoryType="governance" 
                          queryType="all"
                          data={output.data?.governance || []}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getGovernanceByType") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching governance by type..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="governance"
                          queryType="by-type"
                          filters={{ type: output.data.governanceType }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getGovernanceByAdmin") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching governance by admin..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults
                          factoryType="governance"
                          queryType="by-admin"
                          filters={{ admin: output.data.admin }}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-getGovernanceCount") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Counting deployed governance contracts..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    return (
                      <div key={toolCallId}>
                        <FactoryQueryResults factoryType="governance" queryType="count" />
                      </div>
                    );
                  }
                }
              }

              // ===========================
              // TOKEN CONTRACT TOOLS (15)
              // ===========================

              // Token Queries (7)
              if (type === "tool-tokenBalance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching token balance..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="balance"
                          contractAddress={data.contractAddress}
                          account={data.account}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenTotalSupply") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching total supply..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="total-supply"
                          contractAddress={data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenAllowance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching token allowance..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="allowance"
                          contractAddress={data.contractAddress}
                          owner={data.owner}
                          spender={data.spender}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenDecimals") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching token decimals..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="decimals"
                          contractAddress={data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenName") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching token name..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="name"
                          contractAddress={data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenSymbol") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Fetching token symbol..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="symbol"
                          contractAddress={data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenPaused") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Checking token pause status..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (
                      <div key={toolCallId}>
                        <TokenContractInfo
                          queryType="paused"
                          contractAddress={data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              // Token Transactions (8)
              if (type === "tool-tokenTransfer") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token transfer..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="transfer"
                          contractAddress={output.data.contractAddress}
                          to={output.data.to}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenTransferFrom") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing transfer from..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="transfer-from"
                          contractAddress={output.data.contractAddress}
                          from={output.data.from}
                          to={output.data.to}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenApprove") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing approval..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="approve"
                          contractAddress={output.data.contractAddress}
                          spender={output.data.spender}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenMint") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token mint..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="mint"
                          contractAddress={output.data.contractAddress}
                          to={output.data.to}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenBurn") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token burn..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="burn"
                          contractAddress={output.data.contractAddress}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenBurnFrom") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing burn from..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="burn-from"
                          contractAddress={output.data.contractAddress}
                          from={output.data.from}
                          amount={output.data.amount}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenPause") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing to pause token..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="pause"
                          contractAddress={output.data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              if (type === "tool-tokenUnpause") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing to unpause token..." />
                      </div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (
                      <div key={toolCallId}>
                        <TokenOperations
                          operationType="unpause"
                          contractAddress={output.data.contractAddress}
                        />
                      </div>
                    );
                  }
                }
              }

              // ===========================
              // NFT CONTRACT TOOLS (17)
              // ===========================

              // NFT Queries (10)
              if (type === "tool-nftBalance") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching NFT balance..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="balance" contractAddress={data.contractAddress} account={data.account} /></div>);
                  }
                }
              }

              if (type === "tool-nftOwnerOf") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching NFT owner..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="owner-of" contractAddress={data.contractAddress} tokenId={data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftGetApproved") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching approved address..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="get-approved" contractAddress={data.contractAddress} tokenId={data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftIsApprovedForAll") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Checking operator approval..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="is-approved-for-all" contractAddress={data.contractAddress} owner={data.owner} operator={data.operator} /></div>);
                  }
                }
              }

              if (type === "tool-nftTokenUri") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching token URI..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="token-uri" contractAddress={data.contractAddress} tokenId={data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftName") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching collection name..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="name" contractAddress={data.contractAddress} /></div>);
                  }
                }
              }

              if (type === "tool-nftSymbol") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching collection symbol..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="symbol" contractAddress={data.contractAddress} /></div>);
                  }
                }
              }

              if (type === "tool-nftTotalSupply") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching total supply..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="total-supply" contractAddress={data.contractAddress} /></div>);
                  }
                }
              }

              if (type === "tool-nftGetOwnerTokenId") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching owner token IDs..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="get-owner-token-id" contractAddress={data.contractAddress} account={data.account} /></div>);
                  }
                }
              }

              if (type === "tool-nftGetTokenId") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching token ID..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    const data = extractToolData(output);
                    return (<div key={toolCallId}><NFTContractInfo queryType="get-token-id" contractAddress={data.contractAddress} /></div>);
                  }
                }
              }

              // NFT Transactions (7)
              if (type === "tool-nftMint") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing NFT mint..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="mint" contractAddress={output.data.contractAddress} to={output.data.to} tokenUri={output.data.tokenUri} /></div>);
                  }
                }
              }

              if (type === "tool-nftTransfer") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing NFT transfer..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="transfer" contractAddress={output.data.contractAddress} to={output.data.to} tokenId={output.data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftTransferFrom") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing transfer from..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="transfer-from" contractAddress={output.data.contractAddress} from={output.data.from} to={output.data.to} tokenId={output.data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftApprove") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing NFT approval..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="approve" contractAddress={output.data.contractAddress} to={output.data.to} tokenId={output.data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftApproveForAll") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing approval for all..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="approve-for-all" contractAddress={output.data.contractAddress} operator={output.data.operator} approved={output.data.approved} /></div>);
                  }
                }
              }

              if (type === "tool-nftBurn") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing NFT burn..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="burn" contractAddress={output.data.contractAddress} tokenId={output.data.tokenId} /></div>);
                  }
                }
              }

              if (type === "tool-nftBurnFrom") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing burn from..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><NFTOperations operationType="burn-from" contractAddress={output.data.contractAddress} from={output.data.from} tokenId={output.data.tokenId} /></div>);
                  }
                }
              }

              // ===========================
              // GOVERNANCE CONTRACT TOOLS (3)
              // ===========================

              if (type === "tool-governanceVote") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Preparing vote..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };
                    return (<div key={toolCallId}><GovernanceOperations operationType="vote" contractAddress={output.data.contractAddress} voteData={{ index: output.data.index, account: output.data.account, votingPower: output.data.votingPower }} proof={output.data.proof} approve={output.data.approve} /></div>);
                  }
                }
              }

              if (type === "tool-governanceHasVoted") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Checking vote status..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };

                    // Handle both direct data and transaction object structures
                    const data = output.data || {};
                    const tx = output.transaction || {};

                    const contractAddress = data.contractAddress || tx.contractAddress;
                    const index = data.index ?? tx.params?.index;

                    if (contractAddress !== undefined && index !== undefined) {
                      return (
                        <div key={toolCallId}>
                          <GovernanceOperations
                            operationType="has-voted"
                            contractAddress={contractAddress}
                            index={index}
                          />
                        </div>
                      );
                    }

                    // If transaction returned but not executed, show query message
                    if (output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <InfoCard
                            title="Vote Status Query"
                            description={output.message || "Checking if voter has voted..."}
                            icon={Vote}
                            gradient="from-blue-500/10 via-indigo-500/10 to-purple-500/10"
                          >
                            <div className="text-sm text-zinc-400">
                              Contract: <code className="text-xs">{output.transaction.contractAddress}</code>
                            </div>
                            <div className="text-sm text-zinc-400">
                              Voter Index: <code className="text-xs">{output.transaction.params?.index}</code>
                            </div>
                          </InfoCard>
                        </div>
                      );
                    }
                  }
                }
              }

              if (type === "tool-governanceGetVoteResults") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") return (<div key={toolCallId}><ToolCallLoader loadingMessage="Fetching vote results..." /></div>);
                  if (state === "output-available" && "output" in part) {
                    const { output } = part as { output: any };

                    // Handle both direct data and transaction object structures
                    const data = output.data || output.transaction || {};

                    // Only render if we have the required data
                    if (data.contractAddress && (data.votesFor !== undefined || data.votesAgainst !== undefined)) {
                      return (
                        <div key={toolCallId}>
                          <VoteDisplay
                            contractAddress={data.contractAddress}
                            votesFor={data.votesFor}
                            votesAgainst={data.votesAgainst}
                            network={data.network}
                            status={data.status}
                          />
                        </div>
                      );
                    }

                    // If transaction returned but not executed, show query message
                    if (output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <InfoCard
                            title="Vote Results Query"
                            description={output.message || "Preparing to query vote results..."}
                            icon={Vote}
                            gradient="from-blue-500/10 via-indigo-500/10 to-purple-500/10"
                          >
                            <div className="text-sm text-zinc-400">
                              Contract: <code className="text-xs">{output.transaction.contractAddress}</code>
                            </div>
                          </InfoCard>
                        </div>
                      );
                    }
                  }
                }
              }


            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return false;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96 min-w-0"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full min-w-0 group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center justify-center shrink-0 rounded-lg overflow-hidden">
          <Image
            src="/images/stellar-studio-logo.jpeg"
            alt="Stellar Studio"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-2 w-full min-w-0">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
