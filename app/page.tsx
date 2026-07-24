import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary-500 selection:text-white font-sans overflow-hidden">
      {/* Global Ambient Background Removed */}

      {/* Main content wrapped in global glass pane */}
      <div className="relative z-10 min-h-screen backdrop-blur-[80px]">
        
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-surface border border-border text-primary-800 text-sm font-medium w-fit shadow-lg shadow-black/10">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                Real-time messaging evolved
              </div>
              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Connect <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-200 via-primary-400 to-emerald-300 drop-shadow-sm">Instantly</span> With Anyone.
              </h1>
              <p className="text-xl text-primary-900/80 max-w-lg leading-relaxed font-light">
                Experience seamless, lightning-fast communication. Search handles, start chats, and never miss a message with our beautiful modern interface.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-primary-950 font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(20,184,166,0.4)]"
                >
                  Start Chatting Free
                </Link>
                <Link 
                  href="#features" 
                  className="px-8 py-4 backdrop-blur-md bg-surface border border-border hover:bg-surface-hover text-foreground font-medium rounded-full transition-all hover:scale-105"
                >
                  Learn More →
                </Link>
              </div>
            </div>
            
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] flex justify-center items-center perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/30 to-emerald-400/10 rounded-3xl -rotate-6 scale-105 blur-2xl" />
              {/* Glassy Image Container */}
              <div className="relative w-full h-full max-h-[600px] rounded-3xl overflow-hidden backdrop-blur-xl bg-surface border border-border shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform transition-transform duration-700 hover:rotate-2 hover:scale-[1.02]">
                <Image 
                  src="/hero-mockup.png" 
                  alt="Chat-Ease Application Mockup" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-700"
                  priority
                />
                {/* Extra Glass Highlight overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section id="features" className="py-32 relative">
          <div className="absolute inset-0 bg-surface backdrop-blur-3xl border-y border-border" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Why choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500">Chat-Ease</span>?</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto font-light">Everything you need to keep conversations flowing smoothly, beautifully wrapped in a premium glass design.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon="⚡"
                title="Lightning Fast"
                description="Built on websockets, your messages are delivered instantly without refreshing."
              />
              <FeatureCard 
                icon="🔍"
                title="Unique Handles"
                description="Find friends easily using unique handles instead of sharing phone numbers."
              />
              <FeatureCard 
                icon="🔔"
                title="Stay Updated"
                description="Unread message counts ensure you never miss an important conversation."
              />
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="py-12 relative text-center text-muted font-light border-t border-border">
          <p>© {new Date().getFullYear()} Chat-Ease. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl backdrop-blur-xl bg-surface border border-border hover:bg-surface-hover hover:border-primary-400/50 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.2)] hover:-translate-y-2">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl backdrop-blur-md bg-surface border border-border text-2xl mb-8 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:border-primary-400/30 transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-muted leading-relaxed font-light">{description}</p>
    </div>
  );
}
