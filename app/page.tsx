"use client";

import { ArrowRight, Sparkles, Shield, Zap, Terminal, MessageSquare, Code2, Coins, Image as ImageIcon, Vote, CheckCircle2, Rocket, Globe, Lock, Menu, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Core capabilities with new design
const capabilities = [
  {
    icon: Coins,
    title: "Token Operations",
    description: "Deploy, transfer, mint, burn, approve - full ERC20 compatibility",
    gradient: "from-accent-cyan to-accent-purple",
  },
  {
    icon: ImageIcon,
    title: "NFT Management",
    description: "Deploy collections, mint, transfer, query ownership and metadata",
    gradient: "from-accent-purple to-accent-orange",
  },
  {
    icon: Vote,
    title: "Governance",
    description: "Deploy voting contracts, cast votes, query results with merkle proofs",
    gradient: "from-accent-orange to-accent-cyan",
  },
  {
    icon: Code2,
    title: "Blockchain Queries",
    description: "Check balances, get token info, query NFT ownership, and more",
    gradient: "from-accent-success to-accent-cyan",
  },
];

// Factory deployment benefits
const features = [
  {
    icon: Zap,
    title: "Gas Efficient",
    description: "Factory pattern deploys WASM once, unlimited instances at minimal cost",
  },
  {
    icon: Shield,
    title: "Audited Templates",
    description: "Deploy from OpenZeppelin-based contract templates",
  },
  {
    icon: MessageSquare,
    title: "AI Interface",
    description: "Configure deployments through conversational AI",
  },
  {
    icon: Terminal,
    title: "80+ AI Tools",
    description: "Complete toolkit for deployment, transfers, queries, and management",
  },
];

// Magnetic Button Component with refined styling
function MagneticButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.2, y: y * 0.2 }); // Reduced from 0.3 for subtlety
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <Button
        ref={buttonRef as any}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

// 3D Tilt Card with new styling
function TiltCard({ children, className, index }: { children: React.ReactNode; className?: string; index?: number }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -8; // Reduced from -10
    const rotateYValue = ((x - centerX) / centerX) * 8; // Reduced from 10
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index || 0) * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 inset-x-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border-subtle backdrop-blur-xl bg-bg-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <Image
                src="/images/stellar-studio-logo.jpeg"
                  alt="Stellar Studio"
                width={32}
                height={32}
                className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-bold text-text-primary">
                Stellar <span className="text-accent-cyan">Studio</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/docs" className="text-sm text-text-secondary hover:text-accent-cyan transition-colors">
                Documentation
              </Link>
              <Link href="/about" className="text-sm text-text-secondary hover:text-accent-cyan transition-colors">
                About
              </Link>
              <a
                href="https://github.com/Scaffold-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-accent-cyan transition-colors flex items-center gap-1"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Button asChild size="sm" className="hidden sm:flex bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white border-0 shadow-glow-cyan">
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-bg-secondary border-border-subtle">
                  <nav className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src="/images/stellar-studio-logo.jpeg"
                        alt="Stellar Studio"
                        width={32}
                        height={32}
                        className="rounded-lg"
                      />
                      <span className="text-xl font-bold text-text-primary">
                        Stellar <span className="text-accent-cyan">Studio</span>
                      </span>
                    </div>
                    <Link href="/chat" className="text-lg text-text-primary hover:text-accent-cyan transition-colors">
                      AI Terminal
                    </Link>
                    <Link href="/docs" className="text-lg text-text-secondary hover:text-accent-cyan transition-colors">
                      Documentation
                    </Link>
                    <Link href="/about" className="text-lg text-text-secondary hover:text-accent-cyan transition-colors">
                      About
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean & Professional */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 mesh-background opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Floating orbs - subtle and purposeful */}
        <motion.div
          className="absolute top-1/4 -left-48 size-96 bg-accent-cyan/5 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 size-96 bg-accent-purple/5 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <Badge variant="outline" className="px-4 py-2 text-sm border-border-emphasis bg-bg-secondary/50 backdrop-blur-sm">
              <Sparkles className="size-4 mr-2 text-accent-purple" />
              AI-Powered Blockchain Development
            </Badge>
          </motion.div>

          {/* Main Headline - Clear Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-5xl mx-auto mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
              <span className="text-text-primary block mb-2">
                Manage Stellar Contracts
              </span>
              <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent block">
                Through Conversation
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-6">
              Deploy, query, transfer, and manage blockchain operations via AI
            </p>

            <p className="text-lg text-text-tertiary max-w-2xl mx-auto mb-12">
              80+ tools for tokens, NFTs, and governance - deploy contracts, check balances, transfer assets, mint NFTs, vote on proposals, and more
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton
                asChild
                size="lg"
                className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white border-0 text-base px-8 py-6 shadow-glow-cyan group"
              >
                <Link href="/chat">
                  <Terminal className="size-5 mr-2" />
                  Launch Terminal
                  <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton
                asChild
                variant="outline"
                size="lg"
                className="border-border-emphasis bg-bg-secondary hover:bg-bg-tertiary hover:border-accent-cyan/50 text-base px-8 py-6"
              >
                <Link href="/docs">
                  <Code2 className="size-5 mr-2" />
                  View Documentation
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-text-tertiary"
            >
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-accent-success" />
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-accent-success" />
                <span>Open source</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-accent-success" />
                <span>5s finality</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Complete Blockchain Operations
            </h2>
            <p className="text-lg text-text-tertiary max-w-2xl mx-auto">
              80+ AI tools for comprehensive smart contract deployment and management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <TiltCard
                key={capability.title}
                index={index}
                className="group relative bg-bg-secondary border border-border-subtle rounded-xl p-6 hover:border-accent-cyan/50 transition-all duration-300"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/0 to-accent-purple/0 group-hover:from-accent-cyan/5 group-hover:to-accent-purple/5 rounded-xl transition-all duration-300" />
                
                <div className="relative">
                  <motion.div
                    className={`size-12 rounded-lg bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <capability.icon className="size-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{capability.title}</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed">{capability.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-bg-secondary/30 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-text-tertiary max-w-2xl mx-auto">
              Three simple steps to deploy your smart contract
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Describe", desc: "Tell us what you want to build" },
              { step: "2", title: "Review", desc: "AI generates your contract" },
              { step: "3", title: "Deploy", desc: "Approve and deploy instantly" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mb-6 flex justify-center">
                  <motion.div
                    className="size-20 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center text-3xl font-bold text-white shadow-glow-cyan"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.step}
                  </motion.div>
                </div>
                
                {/* Connection line */}
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-[60%] w-3/4 h-0.5 bg-gradient-to-r from-accent-cyan/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                    style={{ originX: 0 }}
                  />
                )}
                
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-tertiary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Factory-Powered Deployment
            </h2>
            <p className="text-lg text-text-tertiary max-w-2xl mx-auto">
              Gas-efficient deployment using the factory pattern
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <TiltCard
                key={feature.title}
                index={index}
                className="bg-bg-secondary border border-border-subtle rounded-xl p-6 hover:border-accent-cyan/30 transition-all duration-300"
              >
                <div className="size-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-accent-cyan" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{feature.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-bg-secondary/30 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Subtle background effects */}
              <div className="absolute top-0 right-0 size-64 bg-accent-cyan/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 size-64 bg-accent-purple/5 rounded-full blur-3xl" />

              <div className="relative text-center">
                <div className="flex justify-center mb-6">
                  <div className="size-16 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
                    <Rocket className="size-8 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                  What is Stellar Studio?
                </h2>

                <p className="text-xl text-text-secondary leading-relaxed mb-4">
                  A <span className="text-accent-cyan font-semibold">complete blockchain operations platform</span> for Stellar smart contracts
                  </p>

                <p className="text-lg text-text-tertiary leading-relaxed max-w-2xl mx-auto">
                  We've built 4 factory contracts on Stellar that enable gas-efficient deployment of tokens, NFTs, and governance systems. The AI interface provides 80+ tools — deploy contracts, transfer tokens, check balances, mint NFTs, vote on proposals, and manage all blockchain operations through conversation.
                  </p>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {["Factory pattern", "OpenZeppelin templates", "AI deployment"].map((text) => (
                    <div key={text} className="flex items-center gap-2 text-accent-success">
                      <CheckCircle2 className="size-5" />
                      <span className="text-sm font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-12 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 to-accent-purple/5 rounded-2xl" />

              <div className="relative">
                <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
                  Ready to Deploy?
              </h2>
              <p className="text-lg text-text-tertiary mb-8 max-w-2xl mx-auto">
                  Deploy contracts, manage tokens, transfer NFTs, and more through conversation
              </p>

              <MagneticButton
                asChild
                size="lg"
                  className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white border-0 text-lg px-12 py-6 shadow-glow-cyan"
              >
                <Link href="/chat">
                  Launch Terminal
                  <ArrowRight className="size-5 ml-2" />
                </Link>
              </MagneticButton>

              <p className="mt-6 text-sm text-text-tertiary">
                  No credit card • Non-custodial • Open source
              </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-secondary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Image
                  src="/images/stellar-studio-logo.jpeg"
                    alt="Stellar Studio"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                <span className="text-lg font-bold text-text-primary">
                  Stellar <span className="text-accent-cyan">Studio</span>
                </span>
                </div>
                <p className="text-sm text-text-tertiary max-w-sm mb-4">
                Complete blockchain operations for Stellar. Deploy, transfer, query, and manage tokens, NFTs, and governance through AI.
              </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-4">Product</h3>
                <ul className="space-y-2">
                <li><Link href="/chat" className="text-sm text-text-tertiary hover:text-accent-cyan transition-colors">AI Terminal</Link></li>
                <li><Link href="/docs" className="text-sm text-text-tertiary hover:text-accent-cyan transition-colors">Documentation</Link></li>
                </ul>
              </div>

              <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Resources</h3>
                <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-text-tertiary hover:text-accent-cyan transition-colors">About</Link></li>
                <li><a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-sm text-text-tertiary hover:text-accent-cyan transition-colors">Stellar Network</a></li>
                <li><a href="https://github.com/Scaffold-Studio" target="_blank" rel="noopener noreferrer" className="text-sm text-text-tertiary hover:text-accent-cyan transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>

          <div className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-text-tertiary">
                © 2025 Stellar Studio. Built for the Stellar ecosystem.
              </p>
            <p className="text-xs text-text-quaternary">
                Non-custodial • Open Source • Community Driven
              </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
