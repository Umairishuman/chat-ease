import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-teal-950 text-teal-50 overflow-hidden font-sans">
      {/* Global Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-teal-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand link to home */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400 hover:opacity-80 transition-opacity">
            Chat-Ease
          </Link>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h1 className="text-2xl font-semibold mb-2 text-white">Welcome back</h1>
          <p className="text-teal-100/70 font-light mb-8">Please enter your details to sign in.</p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-100 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-teal-100/70">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-300 hover:text-teal-200 font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}