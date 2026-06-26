import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-teal-950/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <Image 
            src="/enhanced-chat-ease-logo.png" 
            alt="Chat-Ease Logo" 
            width={90} 
            height={90} 
            className="object-contain"
          />
          <span className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">
            Chat-Ease
          </span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link 
            href="/login" 
            className="text-base font-semibold text-teal-100 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 text-base font-semibold bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
