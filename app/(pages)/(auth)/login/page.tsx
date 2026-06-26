import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  return (
    <div className="flex min-h-screen bg-[#061818] text-teal-50 font-sans">
      
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10">
        {/* Header / Brand */}
        <div className="p-8 lg:p-12">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-teal-400 hover:text-teal-300 transition-colors">
            Chat-Ease
          </Link>
        </div>

        {/* Form Container (No Box) */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">Welcome back</h1>
            <p className="text-teal-100/60 font-light mb-10 text-lg">Sign in to continue your conversations.</p>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-teal-100/80 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-teal-100/80">Password</label>
                  <Link href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 mt-4 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-10 text-center text-sm text-teal-100/50">
              Don't have an account?{' '}
              <Link href="/register" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual/Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-teal-950 items-center justify-center p-12 overflow-hidden border-l border-white/5">
        
        {/* Simplified showcase container */}
        <div className="relative z-10 w-full max-w-lg aspect-square">
          <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/20 shadow-2xl">
            <Image 
              src="/hero-mockup.png" 
              alt="Chat-Ease Interface" 
              fill
              className="object-cover opacity-90"
              priority
            />
            {/* Overlay Text */}
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h2 className="text-2xl font-bold text-white mb-2">Connect effortlessly.</h2>
              <p className="text-teal-200/80 font-light text-sm">Join the network where conversations flow securely and beautifully in real-time.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}