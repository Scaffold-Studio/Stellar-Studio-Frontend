"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Database,
  Globe,
  Shield,
  Zap,
  Code,
  Layers,
  Server,
  Lock,
  ArrowRight,
  Check,
  Cpu,
  Network,
  Workflow,
  Factory
} from "lucide-react";

const architecturePhases = [
  {
    layer: "Presentation Layer",
    description: "Next.js 15 App Router with React 19 providing modern SSR for Stellar dApp development",
    icon: Globe,
    color: "bg-[#0085FF]/10 text-[#0085FF] border-[#0085FF]/20",
    components: [
      "Next.js App Router",
      "React Server Components",
      "Tailwind CSS",
      "Framer Motion",
      "Dark/Light Theme"
    ]
  },
  {
    layer: "AI Integration Layer",
    description: "MCP server with 80+ Stellar Soroban operation tools across 9 plugins",
    icon: Brain,
    color: "bg-[#AB78FF]/10 text-[#AB78FF] border-[#AB78FF]/20",
    components: [
      "Model Context Protocol",
      "Claude AI Integration",
      "Tool Registry (80+ tools)",
      "Streaming Responses",
      "Context-Aware Processing"
    ]
  },
  {
    layer: "Blockchain Layer",
    description: "Stellar SDK integration with Freighter wallet and Soroban smart contracts",
    icon: Shield,
    color: "bg-stellar-blue/10 text-stellar-blue border-stellar-blue/20",
    components: [
      "Freighter Wallet Connect",
      "Stellar SDK",
      "Soroban Contract Calls",
      "5-Second Finality",
      "Testnet/Mainnet Support"
    ]
  },
  {
    layer: "Smart Contract Layer",
    description: "Factory contracts for deploying tokens, NFTs, and governance on Stellar",
    icon: Factory,
    color: "bg-success/10 text-success border-success/20",
    components: [
      "Token Factory",
      "NFT Factory",
      "Governance Factory",
      "Contract Registry",
      "TypeScript Clients"
    ]
  },
  {
    layer: "Data & Storage Layer",
    description: "Database architecture with user sessions and chat history",
    icon: Database,
    color: "bg-warning/10 text-warning border-warning/20",
    components: [
      "Drizzle ORM",
      "PostgreSQL/SQLite",
      "User Authentication",
      "Chat History",
      "Transaction Records"
    ]
  }
];

const toolCategories = [
  {
    category: "Factory Operations",
    count: 1,
    description: "Get deployed factory contracts",
    tools: ["Factory Tracking"]
  },
  {
    category: "Token Deployment",
    count: 5,
    description: "Deploy and query tokens via TokenFactory",
    tools: ["Deploy Token", "List Tokens", "Filter by Type", "Filter by Admin", "Token Count"]
  },
  {
    category: "NFT Deployment",
    count: 5,
    description: "Deploy and query NFT collections via NFTFactory",
    tools: ["Deploy NFT", "List NFTs", "Filter by Type", "Filter by Owner", "NFT Count"]
  },
  {
    category: "Governance",
    count: 5,
    description: "Deploy and query governance contracts",
    tools: ["Deploy Governance", "List Governance", "Filter by Type", "Filter by Admin", "Governance Count"]
  },
  {
    category: "Registry",
    count: 6,
    description: "Publish and deploy contracts via Stellar Registry",
    tools: ["Publish Contract", "Deploy Contract", "Create Alias", "List Published", "Get Versions", "Contract Info"]
  },
  {
    category: "Token Operations",
    count: 15,
    description: "Token contract operations",
    tools: ["Transfer", "Mint", "Burn", "Approve", "Balance", "Total Supply", "Pause/Unpause"]
  },
  {
    category: "NFT Operations",
    count: 17,
    description: "NFT contract operations",
    tools: ["Mint", "Transfer", "Burn", "Approve", "Owner Of", "Token URI", "Total Supply"]
  },
  {
    category: "Governance Voting",
    count: 3,
    description: "MerkleVoting operations",
    tools: ["Cast Vote", "Check Voted", "Get Results"]
  },
  {
    category: "Utilities",
    count: 15,
    description: "Helper functions and builders",
    tools: ["Merkle Trees", "Validation", "Config Builders", "Amount Formatting", "Salt Generation"]
  }
];

const techStack = [
  {
    category: "Frontend Framework",
    technologies: [
      { name: "Next.js", version: "15.3.0", description: "React framework with App Router" },
      { name: "React", version: "19.0.0", description: "UI library with concurrent features" },
      { name: "TypeScript", version: "5.6.3", description: "Type-safe development" }
    ]
  },
  {
    category: "AI & MCP",
    technologies: [
      { name: "MCP SDK", version: "1.0.0", description: "Model Context Protocol integration" },
      { name: "Claude", version: "Latest", description: "AI models for Soroban context" },
      { name: "Tool Registry", version: "Custom", description: "80+ Stellar tools" }
    ]
  },
  {
    category: "Blockchain",
    technologies: [
      { name: "Stellar SDK", version: "14.1.1", description: "Official Stellar JavaScript SDK" },
      { name: "Freighter", version: "Latest", description: "Stellar wallet integration" },
      { name: "Soroban", version: "22", description: "Stellar smart contract platform" }
    ]
  },
  {
    category: "Database & Storage",
    technologies: [
      { name: "Drizzle ORM", version: "Latest", description: "Type-safe database operations" },
      { name: "PostgreSQL", version: "Latest", description: "Production database" },
      { name: "SQLite", version: "Latest", description: "Development database" }
    ]
  }
];

export default function ArchitecturePage() {
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
          <Code className="mr-2 size-3" />
          <span className="text-muted-foreground">System Architecture</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">
          Stellar Studio Architecture
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl">
          Stellar Studio employs a sophisticated multi-layer architecture designed for conversational
          smart contract deployment on Stellar. Our system combines modern web technologies, AI processing
          via MCP, and Soroban contract integration to deliver production-ready dApps at scale.
        </p>
      </motion.div>

      {/* System Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Workflow className="size-8 text-[#0085FF]" />
          System Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Conversational Interface</h3>
                <p className="text-muted-foreground">
                  Natural language processing transforms user intent into Stellar Soroban operations through
                  our MCP-powered tool registry with 80+ specialized functions across 9 plugins.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Lightning Fast Deployment</h3>
                <p className="text-muted-foreground">
                  Streaming AI responses with Stellar's 5-second finality ensure immediate feedback
                  while smart contract deployments complete in real-time.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card/50">
                <h3 className="text-xl font-semibold mb-3">Production Ready</h3>
                <p className="text-muted-foreground">
                  Client-side wallet integration, secure transaction signing, and factory-based
                  deployment ensure production-ready contracts with Stellar best practices.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0085FF]/20 to-transparent rounded-2xl blur-3xl"></div>
            <Card className="relative p-8 bg-card/80 backdrop-blur border-[#0085FF]/20">
              <div className="text-center space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#0085FF]/10 rounded-xl">
                    <Globe className="size-8 text-[#0085FF] mx-auto mb-2" />
                    <div className="text-sm font-medium">Web Frontend</div>
                  </div>
                  <div className="p-4 bg-[#0085FF]/10 rounded-xl">
                    <Brain className="size-8 text-[#0085FF] mx-auto mb-2" />
                    <div className="text-sm font-medium">MCP Server</div>
                  </div>
                  <div className="p-4 bg-[#0085FF]/10 rounded-xl">
                    <Shield className="size-8 text-[#0085FF] mx-auto mb-2" />
                    <div className="text-sm font-medium">Stellar SDK</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="size-6 text-muted-foreground" />
                </div>

                <div className="p-4 bg-gradient-to-r from-[#0085FF]/20 to-[#AB78FF]/10 rounded-xl">
                  <Zap className="size-10 text-[#0085FF] mx-auto mb-2" />
                  <div className="font-semibold">Conversational Soroban Development</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Architecture Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Layers className="size-8 text-[#0085FF]" />
          Architecture Layers
        </h2>

        <div className="space-y-6">
          {architecturePhases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.layer}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 border rounded-xl ${phase.color} bg-card/50 backdrop-blur`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className="size-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{phase.layer}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Layer {index + 1}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {phase.components.map((component, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="size-3 text-green-500 shrink-0" />
                          <span className="text-muted-foreground">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tool Registry */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Cpu className="size-8 text-[#0085FF]" />
          MCP Tool Registry
        </h2>

        <div className="mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our MCP server leverages 80+ specialized tools organized across 9 plugins for Stellar Soroban operations.
            Each tool is designed for specific factory and contract operations with intelligent error handling and validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 border rounded-xl bg-card/50 hover:bg-card/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{category.category}</h3>
                <Badge variant="outline" className="text-xs">
                  {category.count} {category.count === 1 ? 'tool' : 'tools'}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              <div className="space-y-2">
                {category.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="size-1.5 bg-[#0085FF] rounded-full"></div>
                    <span className="text-muted-foreground">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Server className="size-8 text-[#0085FF]" />
          Technology Stack
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">{stack.category}</h3>

              <div className="space-y-3">
                {stack.technologies.map((tech, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{tech.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        v{tech.version}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security & Performance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Lock className="size-8 text-[#0085FF]" />
          Security & Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="size-5 text-green-500" />
              Security Measures
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Client-Side Wallet Integration</div>
                  <div className="text-sm text-muted-foreground">Private keys never leave Freighter wallet</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Stellar Network Security</div>
                  <div className="text-sm text-muted-foreground">5-second finality with consensus protocol</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Soroban Smart Contract Safety</div>
                  <div className="text-sm text-muted-foreground">Rust-based contracts with built-in safety</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Input Validation & Sanitization</div>
                  <div className="text-sm text-muted-foreground">Comprehensive validation pipeline</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="size-5 text-blue-500" />
              Performance Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">5-Second Finality</div>
                  <div className="text-sm text-muted-foreground">Stellar's fast consensus mechanism</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Streaming MCP Responses</div>
                  <div className="text-sm text-muted-foreground">Real-time data processing and display</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Factory Pattern Optimization</div>
                  <div className="text-sm text-muted-foreground">Efficient contract deployment system</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="size-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Progressive Enhancement</div>
                  <div className="text-sm text-muted-foreground">Graceful degradation and error handling</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Data Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Network className="size-8 text-[#0085FF]" />
          Data Flow Architecture
        </h2>

        <Card className="p-8 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-[#0085FF]/10 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="size-8 text-[#0085FF]" />
              </div>
              <h3 className="font-semibold mb-2">User Input</h3>
              <p className="text-sm text-muted-foreground">
                Natural language commands for Stellar contract deployment
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-[#AB78FF]/10 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="size-8 text-[#AB78FF]" />
              </div>
              <h3 className="font-semibold mb-2">MCP Processing</h3>
              <p className="text-sm text-muted-foreground">
                Claude AI analyzes intent and selects appropriate factory tools
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-stellar-blue/10 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="size-8 text-stellar-blue" />
              </div>
              <h3 className="font-semibold mb-2">Blockchain Execution</h3>
              <p className="text-sm text-muted-foreground">
                Stellar SDK deploys contracts with 5-second finality
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-success/10 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                <Factory className="size-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Contract Deployed</h3>
              <p className="text-sm text-muted-foreground">
                Production-ready contracts with transaction receipt
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="size-8 bg-[#0085FF] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {step}
                  </div>
                  {index < 3 && <ArrowRight className="size-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
