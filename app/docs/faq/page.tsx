"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Wallet,
  Coins,
  Shield,
  Code,
  ArrowRightLeft,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is Stellar Studio?",
    answer: "Stellar Studio is an AI-powered Stellar smart contract deployment platform that allows you to deploy tokens, NFTs, and governance contracts using natural language. Instead of writing Soroban code, you simply tell the AI what you want to deploy - like 'deploy a new token called MyToken' or 'create an NFT collection with royalties' - and it handles the technical complexity for you."
  },
  {
    category: "getting-started",
    question: "How do I get started with Stellar Studio?",
    answer: "Getting started is simple: 1) Connect your Freighter wallet, 2) Start typing what you want to deploy in natural language, 3) The AI will guide you through each step and handle the smart contract deployment. No Soroban coding knowledge required!"
  },
  {
    category: "getting-started",
    question: "What wallets are supported?",
    answer: "Stellar Studio supports Freighter wallet, the most popular Stellar wallet with full support for Soroban smart contracts. Make sure your wallet is connected to the correct network (mainnet or testnet)."
  },
  {
    category: "getting-started",
    question: "Is Stellar Studio free to use?",
    answer: "Yes, Stellar Studio is free to use. You only pay standard Stellar network fees (in XLM) for contract deployments you choose to execute. The AI interface and all 80+ tools are provided at no additional cost."
  },

  // Wallet & Transactions
  {
    category: "wallet",
    question: "How do I check my XLM balance?",
    answer: "Simply ask: 'What's my XLM balance?' or 'Show my wallet balance'. The AI will instantly fetch and display your current XLM balance from the connected Freighter wallet."
  },
  {
    category: "wallet",
    question: "Can I deploy contracts to testnet?",
    answer: "Yes! Stellar Studio supports both testnet and mainnet deployments. Simply ensure your Freighter wallet is connected to the correct network. The AI will automatically use the appropriate network for deployments."
  },
  {
    category: "wallet",
    question: "What about custom token deployments?",
    answer: "Stellar Studio supports deploying various token types: Pausable, Capped, Allowlist, Blocklist, and Vault tokens. Try: 'Deploy a capped token with max supply 1000000' or 'Create a pausable token'. The AI automatically handles all parameters."
  },
  {
    category: "wallet",
    question: "How do transaction fees work on Stellar?",
    answer: "Stellar transactions use XLM for network fees. The AI automatically estimates and includes appropriate fees for your contract deployments. Stellar offers fast 5-second finality and low transaction costs."
  },

  // Smart Contract Deployment
  {
    category: "defi",
    question: "How do I deploy a token?",
    answer: "Just say 'Deploy a new token called MyToken with symbol MTK' or 'Create a capped token with 1 million max supply'. The AI will set up all the parameters, including decimals, admin address, and initial supply, then deploy the token contract for you."
  },
  {
    category: "defi",
    question: "Can I deploy multiple contract types?",
    answer: "Absolutely! Stellar Studio supports deploying tokens (5 types), NFTs (3 types), and governance contracts (2 types). Ask 'Deploy a pausable token' or 'Create an NFT collection with royalties' and the AI handles the deployment."
  },
  {
    category: "defi",
    question: "How do I interact with deployed contracts?",
    answer: "Say 'Transfer 100 MTK to [address]' or 'Mint 10 NFTs'. The AI provides 80+ tools for interacting with deployed contracts including transfers, minting, burning, pausing, and querying contract states."
  },
  {
    category: "defi",
    question: "What's the difference between token types?",
    answer: "Pausable tokens can be paused by admin. Capped tokens have max supply limits. Allowlist tokens restrict transfers to approved addresses. Blocklist tokens prevent transfers to blocked addresses. Vault tokens wrap other assets. The AI can help you choose the right type."
  },

  // Governance
  {
    category: "lending",
    question: "How do I deploy a governance contract?",
    answer: "Say 'Deploy a multisig with 3 owners and threshold 2' or 'Create a merkle voting contract with these addresses'. The AI will set up the governance parameters and deploy the contract for you."
  },
  {
    category: "lending",
    question: "Can I customize governance parameters?",
    answer: "Yes! Ask 'Deploy multisig with 5 owners, threshold 3' or 'Create merkle voting for 100 voter addresses'. The AI will configure the contract with your exact specifications including owner lists, thresholds, and voting merkle trees."
  },
  {
    category: "lending",
    question: "How do I interact with governance contracts?",
    answer: "Ask 'Cast vote on governance contract [address]' or 'Check vote results'. The AI provides tools for voting, checking vote status, and retrieving results from deployed governance contracts."
  },
  {
    category: "lending",
    question: "What's the difference between multisig and merkle voting?",
    answer: "Multisig requires M-of-N signatures from predefined owners for transactions. Merkle voting uses cryptographic proofs to verify voters from a large list without storing all addresses on-chain. The AI helps you choose based on your governance needs."
  },

  // NFTs
  {
    category: "bns",
    question: "How do I deploy an NFT collection?",
    answer: "Say 'Deploy an NFT collection' or 'Create enumerable NFT with royalties'. The AI will set up the NFT contract with your specified features like enumeration, royalties, or access control, and deploy it for you."
  },
  {
    category: "bns",
    question: "Can I mint NFTs after deployment?",
    answer: "Yes! Say 'Mint NFT to [address]' or 'Mint 10 NFTs from collection [contract-id]'. The AI will create the mint transaction for you to approve in your wallet."
  },
  {
    category: "bns",
    question: "How do NFT transfers work?",
    answer: "NFT transfers work like any token transfer. Ask 'Transfer NFT #5 to [address]' and the AI will create the transfer transaction. All NFT operations require owner approval through your Freighter wallet."
  },

  // Registry & Advanced
  {
    category: "advanced",
    question: "What is the contract registry?",
    answer: "The contract registry stores published WASM contracts that can be deployed multiple times. It's like a contract template library. Ask 'Publish my contract to registry' or 'Deploy from registry' to use it."
  },
  {
    category: "advanced",
    question: "How do I publish contracts to the registry?",
    answer: "Say 'Publish contract [wasm-path] to registry' and the AI will upload your compiled WASM to the registry with versioning. Once published, you can deploy instances without re-uploading WASM."
  },
  {
    category: "advanced",
    question: "Can I deploy contracts from the registry?",
    answer: "Yes! Try 'Deploy MyContract from registry' or 'Deploy version 1.2.0 of MyContract'. The AI will fetch the WASM from registry and deploy a new instance with optional constructor arguments."
  },

  // Troubleshooting
  {
    category: "troubleshooting",
    question: "Why isn't my wallet connecting?",
    answer: "Common solutions: 1) Ensure Freighter is installed and unlocked, 2) Check you're on the correct network (mainnet/testnet), 3) Refresh the page and try reconnecting, 4) Clear browser cache if issues persist."
  },
  {
    category: "troubleshooting",
    question: "Deployment failed - what went wrong?",
    answer: "Provide the transaction hash and ask 'Why did my deployment fail?'. The AI will analyze the Soroban contract call, check for insufficient balance, parameter errors, or network issues and explain what happened."
  },
  {
    category: "troubleshooting",
    question: "I don't have enough XLM for fees",
    answer: "You need XLM for transaction fees on Stellar. You can: 1) Purchase XLM on an exchange, 2) Use the Stellar testnet faucet for testnet XLM, 3) Ask 'Where can I get XLM?' for current options."
  },
  {
    category: "troubleshooting",
    question: "My contract deployment is taking too long",
    answer: "Stellar has 5-second finality, so deployments should be fast. If it's taking longer: 1) Check network status, 2) Ensure sufficient XLM for fees, 3) Verify your Freighter wallet is unlocked and ready to sign."
  },
  {
    category: "troubleshooting",
    question: "AI doesn't understand my request",
    answer: "Try rephrasing more simply: instead of technical jargon, use plain language like 'deploy token', 'mint NFT', or 'create multisig'. The AI is trained on natural language patterns and Stellar smart contract terminology."
  },

  // MCP & Technical
  {
    category: "technical",
    question: "What is the Model Context Protocol?",
    answer: "MCP is a standard protocol that allows AI assistants like Claude to interact with external tools and services. Stellar Studio MCP Server implements 80+ tools for Stellar smart contract operations that Claude can use to help you."
  },
  {
    category: "technical",
    question: "How do I use Stellar Studio in Claude Desktop?",
    answer: "Install the Stellar Studio MCP Server following the docs, configure your Claude Desktop with the MCP config file, and restart Claude. Then you can chat with Claude about Stellar smart contracts directly in the app."
  },
  {
    category: "technical",
    question: "Are my private keys secure?",
    answer: "Yes! Your private keys never leave your Freighter wallet. Stellar Studio only requests transaction signatures from your wallet - it cannot access your keys or execute deployments without your explicit approval."
  },
  {
    category: "technical",
    question: "How does Stellar consensus work?",
    answer: "Stellar uses the Stellar Consensus Protocol (SCP), a federated Byzantine agreement system. Transactions achieve finality in 5 seconds with low fees and high throughput. Soroban smart contracts inherit this performance."
  },
  {
    category: "technical",
    question: "What's the difference between mainnet and testnet?",
    answer: "Mainnet uses real XLM with value. Testnet uses test XLM for development without risk. Stellar Studio works on both - it automatically detects your network from your Freighter wallet connection."
  }
];

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: HelpCircle,
    description: "Basic questions about Stellar Studio"
  },
  {
    id: "wallet",
    name: "Wallet & Network",
    icon: Wallet,
    description: "Managing XLM and network connections"
  },
  {
    id: "defi",
    name: "Smart Contracts",
    icon: ArrowRightLeft,
    description: "Deploying and interacting with contracts"
  },
  {
    id: "lending",
    name: "Governance",
    icon: Coins,
    description: "Multisig and voting contracts"
  },
  {
    id: "bns",
    name: "NFT Collections",
    icon: Shield,
    description: "NFT deployment and management"
  },
  {
    id: "advanced",
    name: "Registry & Advanced",
    icon: Zap,
    description: "Contract registry and publishing"
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    icon: AlertCircle,
    description: "Common issues and solutions"
  },
  {
    id: "technical",
    name: "MCP & Technical",
    icon: Code,
    description: "MCP server and Stellar consensus"
  }
];

function FAQCategory({ category, items }: { category: typeof categories[0], items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <category.icon className="size-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-left bg-muted/50 hover:bg-muted/70 rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="size-4 shrink-0" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0" />
                  )}
                </Button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 bg-background"
                  >
                    <div className="pt-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");

  return (
    <div className="py-12 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <HelpCircle className="mr-2 size-3" />
          <span className="text-muted-foreground">FAQ</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
          Find answers to common questions about Stellar Studio. From basic wallet operations to advanced
          smart contract deployment on Stellar.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-cyan-500">{faqData.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-purple-500">80+</div>
            <div className="text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-500">5s</div>
            <div className="text-sm text-muted-foreground">Finality</div>
          </div>
        </div>
      </motion.div>

      <div className="w-full">
        <div className="bg-muted/50 rounded-lg p-2 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-md h-auto flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <category.icon className="size-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FAQCategory
            category={categories.find(cat => cat.id === selectedCategory)!}
            items={faqData.filter(faq => faq.category === selectedCategory)}
          />
        </motion.div>
      </div>

      {/* Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <CheckCircle className="size-8 text-cyan-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Try asking Stellar Studio directly -
            it's designed to understand and answer questions about Stellar smart contracts in natural language.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Link href="/chat">
                <HelpCircle className="size-4 mr-2" />
                Try Stellar Studio
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/Scaffold-Studio/Stellar-Studio-MCP" target="_blank">
                <Info className="size-4 mr-2" />
                View Documentation
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
