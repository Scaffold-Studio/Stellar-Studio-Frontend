/**
 * Greeting Component - 2025 Design System
 *
 * Welcome message for new chats
 * Updated with accurate messaging about factory deployment system
 */

import { motion } from "motion/react";
import Image from "next/image";

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-4 sm:px-6 md:px-8 w-full min-w-0 flex flex-col justify-center gap-6"
    >
      {/* Logo + Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 border border-border-subtle">
          <Image
            src="/images/stellar-studio-logo.jpeg"
            alt="Stellar Studio"
            width={64}
            height={64}
            className="rounded-lg"
          />
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          <span className="text-text-primary">Stellar </span>
          <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Studio
          </span>
        </h1>
      </motion.div>

      {/* Main Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center space-y-3"
      >
        <p className="text-lg sm:text-xl text-text-secondary">
          Deploy from our factory system of audited smart contracts
        </p>
        
        <p className="text-base text-text-tertiary max-w-2xl mx-auto">
          Use our 4 factory contracts to deploy tokens, NFTs, and governance systems.
          Talk to AI, configure your contract, deploy instantly.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
      >
        <div className="text-center p-4 bg-bg-secondary border border-border-subtle rounded-lg">
          <p className="text-2xl font-bold text-accent-cyan mb-1">52</p>
          <p className="text-xs text-text-tertiary">AI Tools</p>
        </div>
        <div className="text-center p-4 bg-bg-secondary border border-border-subtle rounded-lg">
          <p className="text-2xl font-bold text-accent-purple mb-1">4</p>
          <p className="text-xs text-text-tertiary">Factory Contracts</p>
        </div>
        <div className="text-center p-4 bg-bg-secondary border border-border-subtle rounded-lg">
          <p className="text-2xl font-bold text-accent-success mb-1">5s</p>
          <p className="text-xs text-text-tertiary">Deploy Time</p>
        </div>
      </motion.div>

      {/* Quick Start Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center text-sm text-text-quaternary mt-2"
      >
        Try: "Deploy a pausable token" or "Create an NFT collection"
      </motion.div>
    </div>
  );
};
