"use client";

import { motion } from "motion/react";
import { Button } from "./ui/button";
import { memo, useState } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { toast } from "sonner";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import {
  Wallet,
  Coins,
  TrendingUp,
  Blocks,
  FileCode,
  Image,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SuggestedActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
}

interface ToolCategory {
  name: string;
  icon: React.ReactNode;
  accent: string;
  actions: {
    title: string;
    label: string;
    action: string;
  }[];
}

function PureSuggestedActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: SuggestedActionsProps) {
  const { isConnected } = useStellarWallet();
  const [activeCategory, setActiveCategory] = useState(0);

  const categories: ToolCategory[] = [
    {
      name: "Account & Balance",
      icon: <Wallet className="size-4" />,
      accent: "#00E5FF", // Cyan
      actions: [
        {
          title: "Check wallet balance",
          label: "view XLM balance",
          action: "Show me my wallet balance",
        },
        {
          title: "Check token balance",
          label: "view token holdings",
          action: "What is my balance for this token?",
        },
        {
          title: "Get contract info",
          label: "view contract details",
          action: "Show me information about this contract",
        },
      ],
    },
    {
      name: "Token Deployment",
      icon: <Coins className="size-4" />,
      accent: "#6D28D9", // Purple
      actions: [
        {
          title: "Deploy pausable token",
          label: "token with pause control",
          action: "Deploy a pausable token contract",
        },
        {
          title: "Deploy capped token",
          label: "token with max supply",
          action: "Deploy a token with a capped supply",
        },
        {
          title: "Deploy allowlist token",
          label: "whitelist-only token",
          action: "Deploy a token with allowlist functionality",
        },
        {
          title: "Deploy blocklist token",
          label: "token with blocklist",
          action: "Deploy a token with blocklist functionality",
        },
        {
          title: "List my deployed tokens",
          label: "view token contracts",
          action: "Show me all the tokens I've deployed",
        },
        {
          title: "Get token count",
          label: "total deployed tokens",
          action: "How many tokens have been deployed?",
        },
      ],
    },
    {
      name: "Token Operations",
      icon: <TrendingUp className="size-4" />,
      accent: "#54FA9C", // Success green
      actions: [
        {
          title: "Transfer tokens",
          label: "send tokens",
          action: "Transfer tokens to another address",
        },
        {
          title: "Approve spending",
          label: "set allowance",
          action: "Approve an address to spend my tokens",
        },
        {
          title: "Mint tokens",
          label: "create supply",
          action: "Mint additional tokens to an address",
        },
        {
          title: "Burn tokens",
          label: "destroy supply",
          action: "Burn tokens from my balance",
        },
        {
          title: "Pause token",
          label: "halt transfers",
          action: "Pause my pausable token contract",
        },
        {
          title: "Check token info",
          label: "name, symbol, decimals",
          action: "Show me the details of this token",
        },
      ],
    },
    {
      name: "NFT Deployment",
      icon: <Image className="size-4" />,
      accent: "#FF8C42", // Orange
      actions: [
        {
          title: "Deploy enumerable NFT",
          label: "trackable collection",
          action: "Deploy an enumerable NFT contract",
        },
        {
          title: "Deploy access control NFT",
          label: "role-based collection",
          action: "Deploy an NFT with access control features",
        },
        {
          title: "List my NFT collections",
          label: "view NFT contracts",
          action: "Show me all the NFT collections I've deployed",
        },
        {
          title: "Get NFT count",
          label: "total collections",
          action: "How many NFT collections have been deployed?",
        },
      ],
    },
    {
      name: "NFT Operations",
      icon: <Blocks className="size-4" />,
      accent: "#00E5FF", // Cyan
      actions: [
        {
          title: "Mint NFT",
          label: "create NFT",
          action: "Mint a new NFT to an address",
        },
        {
          title: "Transfer NFT",
          label: "send NFT",
          action: "Transfer an NFT to another address",
        },
        {
          title: "Approve NFT",
          label: "approve transfer",
          action: "Approve an address to transfer my NFT",
        },
        {
          title: "Burn NFT",
          label: "destroy NFT",
          action: "Burn an NFT from my collection",
        },
        {
          title: "Check NFT owner",
          label: "verify ownership",
          action: "Who owns this NFT?",
        },
        {
          title: "Get NFT details",
          label: "metadata & info",
          action: "Show me the details of this NFT collection",
        },
      ],
    },
    {
      name: "Governance",
      icon: <FileCode className="size-4" />,
      accent: "#6D28D9", // Purple
      actions: [
        {
          title: "Deploy merkle voting",
          label: "create DAO voting",
          action: "Deploy a merkle voting governance contract with voter addresses",
        },
        {
          title: "Cast vote",
          label: "vote on proposal",
          action: "I want to cast a vote on a governance proposal",
        },
        {
          title: "Check vote results",
          label: "view voting results",
          action: "What are the current vote results?",
        },
        {
          title: "Has voted status",
          label: "check voter status",
          action: "Has this address already voted?",
        },
        {
          title: "List governance contracts",
          label: "view all governance",
          action: "Show me all deployed governance contracts",
        },
      ],
    },
    {
      name: "Factory Queries",
      icon: <Zap className="size-4" />,
      accent: "#54FA9C", // Success green
      actions: [
        {
          title: "View deployed tokens",
          label: "list all tokens",
          action: "Show me all deployed tokens from the factory",
        },
        {
          title: "View deployed NFTs",
          label: "list NFT collections",
          action: "Show me all deployed NFT collections",
        },
        {
          title: "View governance contracts",
          label: "list governance",
          action: "Show me all deployed governance contracts",
        },
        {
          title: "My token deployments",
          label: "filter by admin",
          action: "Show me tokens I've deployed as admin",
        },
        {
          title: "My NFT collections",
          label: "filter by owner",
          action: "Show me NFT collections I own",
        },
        {
          title: "Factory statistics",
          label: "deployment counts",
          action: "How many contracts have been deployed from the factories?",
        },
      ],
    },
  ];

  const handleActionClick = async (action: string) => {
    if (!isConnected) {
      toast.error("Please connect your Stellar wallet to send a message");
      return;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: action }],
    });
  };

  return (
    <div data-testid="suggested-actions" className="w-full max-w-full overflow-hidden space-y-4 px-4 md:px-0">
      {/* Category Pills */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(index);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium whitespace-nowrap transition-all snap-start shrink-0 ${
                activeCategory === index
                  ? "bg-bg-secondary border-accent-cyan shadow-glow-cyan"
                  : "bg-bg-primary border-border-subtle hover:border-accent-cyan/50 hover:bg-bg-secondary"
              }`}
              style={
                activeCategory === index
                  ? { borderColor: category.accent, boxShadow: `0 0 15px ${category.accent}40` }
                  : undefined
              }
            >
              <span style={activeCategory === index ? { color: category.accent } : undefined} className={activeCategory === index ? "" : "text-text-tertiary"}>
                {category.icon}
              </span>
              <span className={activeCategory === index ? "text-text-primary" : "text-text-secondary"}>
                {category.name}
              </span>
              <span className="text-xs text-text-quaternary">({category.actions.length})</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3">
            {categories[activeCategory].actions.map((suggestedAction, index) => (
              <motion.div
                key={`${suggestedAction.title}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="shrink-0 w-[280px] md:w-[320px]"
              >
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleActionClick(suggestedAction.action);
                  }}
                  className="relative text-left border border-border-subtle rounded-lg p-4 size-full bg-bg-secondary hover:bg-bg-tertiary hover:border-accent-cyan/50 transition-all group"
                >
                  {/* Accent bar */}
                  <div
                    className="absolute left-0 inset-y-3 w-0.5 rounded-r bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Content */}
                  <div className="pl-0 group-hover:pl-2 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-text-primary text-sm sm:text-base leading-tight">
                        {suggestedAction.title}
                      </span>
                      <ChevronRight
                        className="size-4 sm:size-5 text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                      />
                    </div>
                    <span className="text-text-tertiary text-xs block">
                      {suggestedAction.label}
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 text-xs text-text-tertiary pt-3 border-t border-border-subtle"
      >
        <Zap className="size-3.5 text-accent-cyan" />
        <span>
          {categories.reduce((sum, cat) => sum + cat.actions.length, 0)}+ AI-powered tools
          across {categories.length} categories
        </span>
      </motion.div>
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    return true;
  }
);
