"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Wallet,
  MessageSquare,
  Search,
  Code,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Connect Your Wallet",
    description: "Connect your Freighter wallet to access all Stellar smart contract features",
    icon: Wallet,
    details: [
      "Freighter Wallet (Recommended)",
      "Testnet and Mainnet support",
      "Secure transaction signing",
      "Multiple account management"
    ]
  },
  {
    number: "02",
    title: "Explore the Interface",
    description: "Familiarize yourself with the AI-powered chat interface for Stellar smart contracts",
    icon: MessageSquare,
    details: [
      "Natural language queries",
      "Real-time blockchain data",
      "Smart contract deployment",
      "9 plugin categories with 80+ tools"
    ]
  },
  {
    number: "03",
    title: "Start Building",
    description: "Begin deploying Stellar smart contracts with simple questions",
    icon: Search,
    details: [
      "Deploy tokens with custom parameters",
      "Create NFT collections",
      "Set up governance contracts",
      "Query contract states"
    ]
  }
];

const features = [
  {
    title: "Stellar Analytics",
    description: "Get real-time insights into Stellar transactions, blocks, and 5-second finality"
  },
  {
    title: "Comprehensive Toolset",
    description: "Access 80+ tools across 9 categories: Factory, Token, NFT, Governance, Registry, Token Contract, NFT Contract, Governance Contract, and Utilities"
  },
  {
    title: "AI-Powered Deployment",
    description: "Deploy complex smart contracts using natural language - no Soroban coding required"
  },
  {
    title: "Smart Contract Factory",
    description: "Deploy tokens, NFTs, and governance contracts with customizable parameters all in one interface"
  }
];

export default function GettingStartedPage() {
  return (
    <div className="py-12 px-6 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <Badge variant="outline" className="mb-4">
          <span className="text-muted-foreground">Getting Started</span>
        </Badge>

        <h1 className="text-4xl font-bold mb-4">Welcome to Stellar Studio</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Stellar Studio is your AI-powered co-pilot for deploying Stellar smart contracts.
          This guide will help you get started in just a few minutes.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Quick Start Guide</h2>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
              >
                <div className="shrink-0">
                  <div className="size-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="size-6 text-cyan-500" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="size-4 text-green-500 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ArrowRight className="size-5 text-cyan-500" />
            Ready to start?
          </h4>
          <p className="text-muted-foreground mb-4">
            Launch Stellar Studio and connect your Freighter wallet to begin deploying smart contracts.
          </p>
          <Button asChild>
            <Link href="/chat">
              Launch Stellar Studio
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Example Queries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Example Queries</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Here are some example questions you can ask Stellar Studio:
        </p>

        <div className="space-y-4">
          {[
            "Deploy a new token called MyToken with symbol MTK",
            "Create an NFT collection with royalties enabled",
            "Set up a multisig governance contract with 3 owners",
            "Show me all deployed tokens on testnet",
            "What's the current state of my token contract?"
          ].map((query, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="p-4 border rounded-lg bg-card/30 backdrop-blur-sm font-mono text-sm"
            >
              <Code className="size-4 text-cyan-500 inline mr-2" />
              {query}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Now that you know the basics, explore these advanced topics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/docs/architecture" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <Code className="size-5 text-cyan-500" />
            <div>
              <div className="font-medium">Architecture</div>
              <div className="text-sm text-muted-foreground">Learn about the system design and MCP integration</div>
            </div>
            <ArrowRight className="size-4 ml-auto" />
          </Link>

          <Link href="/docs/mcp-server" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <ExternalLink className="size-5 text-cyan-500" />
            <div>
              <div className="font-medium">MCP Server</div>
              <div className="text-sm text-muted-foreground">Advanced MCP server integrations</div>
            </div>
            <ArrowRight className="size-4 ml-auto" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
