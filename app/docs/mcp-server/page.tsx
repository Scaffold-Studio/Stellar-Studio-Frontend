"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Brain,
  Code,
  Shield,
  Zap,
  Globe,
  Download,
  Settings,
  Check,
  ArrowRight,
  ExternalLink,
  Copy,
  Cpu,
  Database,
  Network,
  Lock,
  BookOpen,
  PlayCircle,
  GitBranch
} from "lucide-react";
import Link from "next/link";

const supportedAIs = [
  {
    name: "Claude Desktop",
    description: "Native integration with Anthropic's Claude Desktop application",
    icon: Brain,
    configPath: "~/Library/Application Support/Claude/claude_desktop_config.json",
    setupCommand: "pnpm setup:claude"
  },
  {
    name: "Cursor Editor",
    description: "AI-powered code editor with Stellar smart contract capabilities",
    icon: Code,
    configPath: "~/.cursor/mcp.json",
    setupCommand: "pnpm setup:cursor"
  },
  {
    name: "VS Code",
    description: "Microsoft Visual Studio Code with MCP integration",
    icon: Terminal,
    configPath: "~/Library/Application Support/Code/User/mcp.json",
    setupCommand: "pnpm setup:code"
  }
];

const pluginCategories = [
  {
    name: "Factory Operations",
    description: "Master factory deployment and management",
    icon: Zap,
    tools: 1,
    examples: ["Get all deployed factories", "Query factory addresses", "View factory metadata"]
  },
  {
    name: "Token Management",
    description: "Token factory and deployment operations",
    icon: Globe,
    tools: 5,
    examples: ["Deploy pausable token", "Deploy capped token", "Query deployed tokens"]
  },
  {
    name: "NFT Operations",
    description: "NFT factory and collection management",
    icon: Shield,
    tools: 5,
    examples: ["Deploy NFT collection", "Create royalties NFT", "Query NFT contracts"]
  },
  {
    name: "Governance",
    description: "Governance factory and voting systems",
    icon: GitBranch,
    tools: 5,
    examples: ["Deploy merkle voting", "Query governance contracts", "Filter by admin"]
  },
  {
    name: "Registry",
    description: "Contract registry and WASM management",
    icon: Database,
    tools: 6,
    examples: ["Publish contracts", "Deploy from registry", "List published contracts"]
  },
  {
    name: "Token Contracts",
    description: "Direct token contract interactions",
    icon: Network,
    tools: 15,
    examples: ["Transfer tokens", "Mint tokens", "Check balances"]
  },
  {
    name: "NFT Contracts",
    description: "Direct NFT contract interactions",
    icon: Lock,
    tools: 17,
    examples: ["Mint NFT", "Transfer NFT", "Get owner"]
  },
  {
    name: "Governance Contracts",
    description: "Direct governance contract interactions",
    icon: Cpu,
    tools: 3,
    examples: ["Cast vote", "Check vote status", "Get results"]
  },
  {
    name: "Utilities",
    description: "Helper tools and validators",
    icon: Settings,
    tools: 15,
    examples: ["Generate salt", "Create merkle tree", "Validate addresses"]
  }
];

export default function McpServerPage() {
  const configExample = `{
  "mcpServers": {
    "stellar-studio": {
      "command": "node",
      "args": ["/absolute/path/to/stellar-studio-mcp-server/dist/index.js"],
      "env": {
        "STELLAR_SECRET_KEY": "SD...",
        "STELLAR_NETWORK": "testnet"
      }
    }
  }
}`;

  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Badge variant="outline" className="mb-4">
          <Terminal className="mr-2 size-3" />
          <span className="text-muted-foreground">Model Context Protocol</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Stellar Studio MCP Server
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mb-8">
          The Model Context Protocol server that brings Stellar smart contract deployment to Claude Desktop, Cursor, and VS Code.
          Stop navigating complex interfaces - start deploying smart contracts through your favorite AI assistant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="https://github.com/Scaffold-Studio/Stellar-Studio-MCP" target="_blank">
              <Download className="mr-2 size-5" />
              Get MCP Server
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/docs/getting-started">
              <BookOpen className="mr-2 size-5" />
              Quick Start Guide
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* What is MCP Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Brain className="size-8 text-cyan-500" />
          The Future of Stellar Smart Contracts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Stellar Studio MCP Server enables AI assistants to deploy Stellar smart contracts through natural language.
              Instead of writing Soroban code, users simply tell their AI what they want to deploy.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="size-5 text-green-500" />
                <span>80+ smart contract deployment tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-5 text-green-500" />
                <span>Claude Desktop, Cursor, VS Code support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-5 text-green-500" />
                <span>Natural language contract deployment</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-5 text-green-500" />
                <span>9 plugin categories integrated</span>
              </div>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
            <h3 className="text-xl font-semibold mb-4">Example Conversation</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <span className="font-medium text-blue-400">You:</span> "Deploy a new token called MyToken with symbol MTK"
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <span className="font-medium text-green-400">Claude:</span> "I'll help you deploy a new token. Let me set up the parameters..."
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <span className="font-medium text-purple-400">Result:</span> "Token deployed successfully! Contract address: CABS..."
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Supported AI Applications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="size-8 text-cyan-500" />
          Supported AI Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportedAIs.map((ai, index) => {
            const Icon = ai.icon;
            return (
              <motion.div
                key={ai.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="p-3 bg-cyan-500/10 rounded-xl w-fit mb-4">
                  <Icon className="size-6 text-cyan-500" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{ai.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{ai.description}</p>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <strong>Config Path:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs break-all">
                      {ai.configPath}
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Setup Command:</strong>
                    <code className="block bg-muted/50 p-1 rounded mt-1 text-xs">
                      {ai.setupCommand}
                    </code>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Plugin Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GitBranch className="size-8 text-cyan-500" />
          Plugin Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pluginCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Icon className="size-6 text-cyan-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.tools} tools
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Examples</h4>
                  {category.examples.map((example, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      "{example}"
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Installation Guide */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Settings className="size-8 text-cyan-500" />
          Quick Installation
        </h2>

        <div className="space-y-8">
          {/* Automated Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="size-5 text-green-500" />
              Automated Setup (Recommended)
            </h3>
            <div className="space-y-4">
              <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-foreground">
{`git clone https://github.com/Scaffold-Studio/Stellar-Studio-MCP
cd Stellar-Studio-MCP
pnpm install && pnpm build
cp .env.example .env`}
                    <span className="text-cyan-500 font-semibold">
{`
pnpm setup`}
                    </span>
                  </code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                The setup script will automatically configure your preferred AI application with the correct paths and environment variables.
              </p>
            </div>
          </Card>

          {/* Application-Specific Setup */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Terminal className="size-5 text-blue-500" />
              Application-Specific Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-blue-600">Claude Desktop</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:claude</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-purple-600">Cursor Editor</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:cursor</code>
              </div>
              <div className="bg-muted/30 border rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-orange-600">VS Code</div>
                <code className="text-sm bg-background/50 px-2 py-1 rounded">pnpm setup:code</code>
              </div>
            </div>
          </Card>

          {/* Configuration Example */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code className="size-5 text-purple-500" />
                Configuration Example
              </h3>
              <Button variant="outline" size="sm">
                <Copy className="mr-2 size-4" />
                Copy Configuration
              </Button>
            </div>
            <div className="bg-muted/30 border rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <code className="text-foreground whitespace-pre-wrap">
{configExample}
                </code>
              </pre>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Security & Requirements */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="size-8 text-cyan-500" />
          Security & Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="size-5 text-green-500" />
              Security Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Local Environment Variables</div>
                  <div className="text-sm text-muted-foreground">Private keys never leave your machine</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Testnet Support</div>
                  <div className="text-sm text-muted-foreground">Safe testing environment included</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Stellar Security</div>
                  <div className="text-sm text-muted-foreground">All transactions benefit from 5-second finality</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="size-5 text-blue-500" />
              Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Node.js 18+</div>
                  <div className="text-sm text-muted-foreground">Modern JavaScript runtime required</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">pnpm Package Manager</div>
                  <div className="text-sm text-muted-foreground">Fast, efficient dependency management</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Freighter Wallet</div>
                  <div className="text-sm text-muted-foreground">Freighter wallet required for Stellar</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready for Stellar Smart Contracts via AI?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Install Stellar Studio MCP Server and deploy Stellar smart contracts through natural conversation.
            No Soroban coding required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="https://github.com/Scaffold-Studio/Stellar-Studio-MCP" target="_blank">
                <Download className="mr-2 size-5" />
                Download MCP Server
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/docs/getting-started">
                <PlayCircle className="mr-2 size-5" />
                Getting Started Guide
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
