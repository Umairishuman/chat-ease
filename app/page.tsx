import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-teal-950 text-teal-50 selection:bg-teal-500 selection:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-teal-950/50 border-b border-teal-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-teal-400">
            Chat-Ease
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium hover:text-teal-300 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/50 border border-teal-700/50 text-teal-300 text-sm font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Real-time messaging evolved
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Instantly</span> With Anyone.
            </h1>
            <p className="text-lg text-teal-200/80 max-w-lg leading-relaxed">
              Experience seamless, lightning-fast communication. Search handles, start chats, and never miss a message with our beautiful modern interface.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-teal-500/20"
              >
                Start Chatting Free
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-4 text-teal-200 hover:text-white font-medium transition-colors"
              >
                Learn More →
              </Link>
            </div>
          </div>
          
          <div className="relative relative w-full aspect-square md:aspect-video lg:aspect-square flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/40 to-transparent rounded-3xl -rotate-6 scale-105 blur-sm" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-teal-700/50 shadow-2xl shadow-teal-900/50 backdrop-blur-sm bg-teal-950/40">
              <Image 
                src="/hero-mockup.png" 
                alt="Chat-Ease Application Mockup" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/20 border-y border-teal-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why choose <span className="text-teal-400">Chat-Ease</span>?</h2>
            <p className="text-teal-200/70 max-w-2xl mx-auto">Everything you need to keep conversations flowing smoothly, beautifully designed for the best experience.</p>
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
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-teal-700 border-t border-teal-900/30 mt-auto">
        <p>© {new Date().getFullYear()} Chat-Ease. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-teal-900/10 border border-teal-800/30 hover:bg-teal-900/20 hover:border-teal-700/50 transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-800/50 text-2xl mb-6 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-teal-100">{title}</h3>
      <p className="text-teal-200/70 leading-relaxed">{description}</p>
    </div>
  );
}
