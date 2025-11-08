"use client";

import { useRouter } from "next/navigation";
import { useStellarWallet } from "@/hooks/useStellarWallet";

import { SidebarHistory } from "@/components/sidebar-history";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Plus } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { publicKey, isConnected } = useStellarWallet();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-2 items-center group"
            >
              <Image
                src="/images/stellar-studio-logo.jpeg"
                alt="Stellar Studio"
                width={32}
                height={32}
                className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              />
              <h1 className="text-lg font-bold">
                <span className="text-text-primary">Stellar</span>{" "}
                <span className="text-accent-cyan">Studio</span>
              </h1>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/chat");
                  router.refresh();
                }}
              >
                <Plus className="size-4" />
              </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Chat History */}
        <SidebarHistory
          user={isConnected && publicKey ? { address: publicKey } : undefined}
          status={
            isConnected && publicKey
              ? "authenticated"
              : "unauthenticated"
          }
        />

        {/* Activity Feed */}
        <div className="border-t border-zinc-800 mt-4">
          <ActivityFeed />
        </div>
      </SidebarContent>
      {/* <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter> */}
    </Sidebar>
  );
}
