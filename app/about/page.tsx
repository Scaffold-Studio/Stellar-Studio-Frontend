"use client";

import { motion } from "motion/react";
import { Brain, Shield, Zap, Users, Globe2, ArrowRight, Code2, Lock, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHeader />
      
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-b from-bg-secondary/50 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 border-border-primary bg-[#0085FF]/10">
              <span className="text-text-tertiary">About Stellar Studio</span>
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text-primary">
              Manage Stellar Smart Contracts <br />
              <span className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">
                Through Conversation
              </span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              No Soroban coding required. Stellar Studio is an AI-powered platform with 80+ tools to deploy,
              transfer, query, and manage tokens, NFTs, and governance contracts using natural language — powered by the Model Context Protocol.
            </p>

            <Button size="lg" asChild className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] hover:opacity-90 text-white border-0 text-lg px-8 py-6 shadow-glow-blue">
              <Link href="/chat">
                Try Stellar Studio
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">What is Stellar Studio?</h2>
            <p className="text-xl text-text-muted leading-relaxed">
              Stellar Studio is a Model Context Protocol (MCP) server and web interface that enables AI assistants
              like Claude to deploy and interact with Stellar smart contracts. With 80+ blockchain operation tools,
              you can deploy contracts, transfer tokens, check balances, mint NFTs, approve transactions, vote on proposals,
              and manage all blockchain operations through natural language — no Soroban coding required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-xl bg-card text-center hover:border-primary/30 transition-all"
            >
              <Brain className="size-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-text-primary">MCP-Powered</h3>
              <p className="text-text-muted">
                Built on the Model Context Protocol, enabling AI assistants to execute 80+ blockchain
                operations through natural language commands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-xl bg-card text-center hover:border-primary/30 transition-all"
            >
              <Lock className="size-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Factory Pattern</h3>
              <p className="text-text-muted">
                Utilizes factory contracts to deploy standardized, audited tokens, NFTs, and governance
                systems with customizable parameters.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-xl bg-card text-center hover:border-primary/30 transition-all"
            >
              <Globe2 className="size-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Multi-Client Support</h3>
              <p className="text-text-muted">
                Works seamlessly with Claude Desktop, Cursor IDE, and VS Code. Deploy contracts
                directly from your favorite development environment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-bg-secondary/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">How It Works</h2>
            <p className="text-xl text-text-muted">
              A three-layer architecture connecting AI to blockchain
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Shield className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">1. AI Interface</h3>
                  <p className="text-text-muted">
                    You describe your blockchain operations in natural language through Claude Desktop,
                    Cursor, or the web interface — deploy contracts, transfer assets, check balances, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">2. MCP Server</h3>
                  <p className="text-text-muted">
                    The MCP server translates your intent into one of 80+ blockchain operation tools,
                    validating parameters and building transactions.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <Code2 className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">3. Stellar Network</h3>
                  <p className="text-text-muted">
                    Transactions are simulated, signed, and submitted to Stellar's Soroban smart contract
                    platform with 5-second finality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">4. Execution & Results</h3>
                  <p className="text-text-muted">
                    Contracts are deployed via factory patterns, tokens are transferred, NFTs are minted,
                    balances are queried — all operations return immediate results for your use.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stellar's Mission */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">Technology Stack</h2>
            <p className="text-xl text-text-muted leading-relaxed">
              Built with modern tools and protocols for reliable, type-safe smart contract operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-card to-bg-secondary border border-border rounded-2xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 size-64 bg-stellar-blue/10 rounded-full blur-3xl" />
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">Core Technologies</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  Stellar Studio combines MCP, Stellar SDK, and Soroban smart contracts to provide
                  a seamless development experience. TypeScript throughout ensures type safety from
                  frontend to blockchain.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Model Context Protocol (MCP) 1.0
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Stellar JavaScript SDK v14.1.1
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Soroban Smart Contracts v22
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Next.js 15 + React 19
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="size-48 bg-gradient-stellar opacity-20 rounded-2xl flex items-center justify-center">
                    <Rocket className="size-24 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 size-8 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 size-6 bg-stellar-blue rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-bg-secondary/50 to-bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Ready to Try Stellar Studio?
            </h2>
            <p className="text-xl text-text-muted mb-8">
              Deploy contracts, transfer tokens, mint NFTs, and manage all blockchain operations through natural language.
              No Soroban coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-stellar hover:opacity-90 text-white border-0 text-lg px-8 py-6">
                <Link href="/chat">
                  Start Building Now
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-border hover:bg-card text-lg px-8 py-6">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
