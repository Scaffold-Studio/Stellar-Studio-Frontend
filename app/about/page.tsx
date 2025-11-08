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
              Making Blockchain <br />
              <span className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">
                Accessible to Everyone
              </span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Blockchain development shouldn't require years of coding experience.
              Stellar Studio brings AI-powered contract deployment to everyone —
              as simple as having a conversation.
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">The Problem We're Solving</h2>
            <p className="text-xl text-text-muted leading-relaxed">
              Stellar is revolutionizing global finance — serving the underbanked, enabling cross-border payments, 
              and powering real-world asset tokenization. But deploying smart contracts on Stellar requires 
              technical expertise that most people don't have. Stellar Studio changes that.
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
              <h3 className="text-xl font-semibold mb-3 text-text-primary">AI-Powered</h3>
              <p className="text-text-muted">
                Natural language understanding powered by advanced AI. Describe what you want to build, 
                and we handle the technical complexity.
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
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Non-Custodial</h3>
              <p className="text-text-muted">
                Your keys, your assets. We never store private keys or have access to your funds. 
                Complete sovereignty over your blockchain assets.
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
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Built on Stellar</h3>
              <p className="text-text-muted">
                Leveraging Stellar's 5-second finality, low fees, and global reach. 
                Deploy contracts that can serve billions of people worldwide.
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">Our Vision</h2>
            <p className="text-xl text-text-muted">
              Democratizing blockchain development for the next billion users
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
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">Accessible Development</h3>
                  <p className="text-text-muted">
                    No coding required. Deploy production-ready smart contracts through conversation. 
                    Making blockchain development accessible to entrepreneurs, creators, and businesses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Zap className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">Lightning Fast</h3>
                  <p className="text-text-muted">
                    Stellar's 5-second finality means your contracts deploy in real-time. 
                    From idea to deployment in minutes, not days.
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
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">Production Ready</h3>
                  <p className="text-text-muted">
                    Deploy tokens, NFTs, and governance systems that are production-ready. 
                    All contracts are tested, secure, and follow Stellar best practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="size-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">For Everyone</h3>
                  <p className="text-text-muted">
                    Whether you're building a token for your community, launching an NFT collection, 
                    or creating a DAO — Stellar Studio makes it possible.
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">Why Stellar?</h2>
            <p className="text-xl text-text-muted leading-relaxed">
              Stellar connects the world's financial infrastructure, enabling instant, low-cost 
              cross-border transactions. With partnerships like UNHCR and MoneyGram, 
              Stellar is bringing financial services to the underbanked worldwide.
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
                <h3 className="text-2xl font-bold mb-4 text-text-primary">Real-World Impact</h3>
                <p className="text-text-muted mb-6 leading-relaxed">
                  Stellar isn't just theory — it's actively serving millions of people. 
                  UNHCR uses Stellar to distribute aid to refugees. MoneyGram enables 
                  instant cash pickup worldwide. Over $3B in Real-World Assets expected by 2025.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Reaching 1.4 billion people globally
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    5-second transaction finality
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <div className="size-2 bg-success rounded-full"></div>
                    Minimal transaction fees
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
              Ready to Build on Stellar?
            </h2>
            <p className="text-xl text-text-muted mb-8">
              Join the future of accessible blockchain development. 
              Deploy your first smart contract in the next 5 minutes.
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
