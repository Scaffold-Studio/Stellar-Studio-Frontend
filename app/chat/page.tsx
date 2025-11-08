"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { StellarConnectButton } from "@/components/StellarConnectButton";
import { motion } from "motion/react";
import { Sparkles, Terminal, Zap } from "lucide-react";

export default function Page() {
  const [id] = useState(() => generateUUID());
  const [chatModel, setChatModel] = useState(DEFAULT_CHAT_MODEL);
  const { isConnected, isConnecting } = useStellarWallet();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const chatModelCookie = cookies.find(cookie => 
      cookie.trim().startsWith('chat-model=')
    );
    
    if (chatModelCookie) {
      const modelValue = chatModelCookie.split('=')[1];
      setChatModel(modelValue);
    }
  }, []);

  // Loading state with new design
  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="size-20 relative">
            <div className="absolute inset-0 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mt-6"
        >
          <p className="text-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Stellar Studio
          </p>
          <p className="text-sm text-text-tertiary mt-2">Connecting to wallet...</p>
        </motion.div>
      </div>
    );
  }

  // Connect wallet prompt with new design
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary relative overflow-hidden p-4">
        {/* Subtle background effects */}
        <div className="absolute inset-0 mesh-background opacity-30" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        
        <motion.div
          className="absolute top-1/4 left-1/4 size-96 bg-accent-cyan/5 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 size-96 bg-accent-purple/5 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg relative z-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="size-24 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow-cyan">
              <Terminal className="size-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              Connect Your Wallet
            </span>
          </h1>
          
          <p className="text-lg text-text-secondary mb-3">
            Access our factory deployment system through AI
          </p>
          
          <p className="text-sm text-text-tertiary mb-8">
            Connect with Freighter to deploy from our contract factories
          </p>

          {/* Connect Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <StellarConnectButton />
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12 text-center">
            {[
              { icon: Sparkles, label: "52 AI Tools" },
              { icon: Zap, label: "5s Deploy" },
              { icon: Terminal, label: "No Code" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="size-10 rounded-lg bg-bg-secondary border border-border-subtle flex items-center justify-center">
                  <item.icon className="size-5 text-accent-cyan" />
                </div>
                <span className="text-xs text-text-tertiary">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      initialChatModel={chatModel}
      initialVisibilityType="private"
      isReadonly={false}
      autoResume={false}
    />
  );
}
