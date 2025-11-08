"use client";

import { motion } from "motion/react";
import { CheckCircle2, Circle, ArrowRight, Rocket, Zap, Globe2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function RoadmapPage() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Foundation",
      status: "Complete",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      items: [
        { title: "MCP server architecture", completed: true },
        { title: "80+ blockchain operation tools", completed: true },
        { title: "Factory contracts (Token, NFT, Governance)", completed: true },
        { title: "Registry system", completed: true },
        { title: "Testnet deployment", completed: true },
        { title: "Web interface", completed: true },
        { title: "Complete documentation", completed: true },
      ],
    },
    {
      phase: "Phase 2",
      title: "Enhancement",
      status: "In Progress",
      icon: Zap,
      color: "text-[#AB78FF]",
      bgColor: "bg-[#AB78FF]/10",
      items: [
        { title: "Mainnet deployment", completed: false },
        { title: "Additional token types (Bonding curves, Reflection)", completed: false },
        { title: "Advanced governance (Timelock, Multisig)", completed: false },
        { title: "Contract templates marketplace", completed: false },
        { title: "Mobile app interface", completed: false },
      ],
    },
    {
      phase: "Phase 3",
      title: "Expansion",
      status: "Planned",
      icon: Globe2,
      color: "text-[#0085FF]",
      bgColor: "bg-[#0085FF]/10",
      items: [
        { title: "Cross-chain bridge integration", completed: false },
        { title: "DeFi protocol templates (AMM, Lending)", completed: false },
        { title: "Analytics dashboard", completed: false },
        { title: "Contract verification service", completed: false },
        { title: "Developer API", completed: false },
      ],
    },
  ];

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
              <span className="text-text-tertiary">Product Roadmap</span>
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text-primary">
              Building the Future of <br />
              <span className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">
                Stellar Development
              </span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Our roadmap outlines the journey from a powerful MCP server to a comprehensive
              platform for AI-powered smart contract deployment on Stellar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Phases */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {phases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Phase Header */}
                <div className="flex items-start gap-6 mb-6">
                  <div className={`${phase.bgColor} p-4 rounded-2xl`}>
                    <phase.icon className={`size-8 ${phase.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-text-primary">{phase.title}</h2>
                      <Badge
                        variant={phase.status === "Complete" ? "default" : "outline"}
                        className={
                          phase.status === "Complete"
                            ? "bg-success/10 text-success border-success/30"
                            : phase.status === "In Progress"
                            ? "bg-[#AB78FF]/10 text-[#AB78FF] border-[#AB78FF]/30"
                            : "bg-[#0085FF]/10 text-[#0085FF] border-[#0085FF]/30"
                        }
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="text-text-tertiary">{phase.phase}</p>
                  </div>
                </div>

                {/* Phase Items */}
                <div className="ml-20 border-l-2 border-border pl-8 space-y-4">
                  {phase.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: phaseIndex * 0.1 + itemIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 group"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="size-5 text-success mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="size-5 text-text-tertiary mt-0.5 shrink-0" />
                      )}
                      <p className={`text-lg ${item.completed ? "text-text-secondary" : "text-text-muted"} group-hover:text-text-primary transition-colors`}>
                        {item.title}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Connecting Line (except for last phase) */}
                {phaseIndex < phases.length - 1 && (
                  <div className="ml-[2.75rem] h-12 border-l-2 border-dashed border-border mt-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-bg-secondary/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-text-primary">
              Current Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-success/30 transition-all">
                <div className="size-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="size-8 text-success" />
                </div>
                <h3 className="text-4xl font-bold text-text-primary mb-2">7/7</h3>
                <p className="text-text-muted">Phase 1 Complete</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-[#AB78FF]/30 transition-all">
                <div className="size-16 bg-[#AB78FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="size-8 text-[#AB78FF]" />
                </div>
                <h3 className="text-4xl font-bold text-text-primary mb-2">0/5</h3>
                <p className="text-text-muted">Phase 2 In Progress</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-[#0085FF]/30 transition-all">
                <div className="size-16 bg-[#0085FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe2 className="size-8 text-[#0085FF]" />
                </div>
                <h3 className="text-4xl font-bold text-text-primary mb-2">0/5</h3>
                <p className="text-text-muted">Phase 3 Planned</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-text-muted mb-8">
              Try Stellar Studio today and help shape the future of smart contract deployment.
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
