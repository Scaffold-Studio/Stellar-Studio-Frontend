"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/80">
      <div className="container mx-auto px-4">
        <Navbar>
          <NavbarLeft>
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl font-bold">
              <Image
                src="/images/stellar-studio.jpeg"
                alt="Stellar Studio"
                width={24}
                height={24}
                className="rounded-lg sm:w-8 sm:h-8"
              />
              <span className="text-text-primary">Stellar <span className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">Studio</span></span>
            </Link>
          </NavbarLeft>
          <NavbarRight>
            {/* Desktop button */}
            <Button asChild size="sm" className="hidden sm:flex bg-gradient-to-r from-[#0085FF] to-[#AB78FF] hover:opacity-90 text-white border-0">
              <Link href="/chat">
                Launch Terminal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {/* Mobile button - compact */}
            <Button asChild size="sm" className="sm:hidden px-2.5 text-xs h-8 bg-gradient-to-r from-[#0085FF] to-[#AB78FF] text-white border-0">
              <Link href="/chat">
                Launch
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-bg-secondary border-border-primary">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <Image
                      src="/images/stellar-logo.svg"
                      alt="Stellar Studio"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span className="text-text-primary">Stellar <span className="bg-gradient-to-r from-[#0085FF] to-[#AB78FF] bg-clip-text text-transparent">Studio</span></span>
                  </Link>
                  <Link href="/chat" className="text-text-tertiary hover:text-[#0085FF] transition-colors">
                    AI Terminal
                  </Link>
                  <Link href="/docs" className="text-text-tertiary hover:text-[#0085FF] transition-colors">
                    Documentation
                  </Link>
                  <Link href="/roadmap" className="text-text-tertiary hover:text-[#0085FF] transition-colors">
                    Roadmap
                  </Link>
                  <Link href="/about" className="text-text-tertiary hover:text-[#0085FF] transition-colors">
                    About
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </Navbar>
      </div>
    </header>
  );
}