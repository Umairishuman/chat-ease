"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { registerUser } from '@/api/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app we'd handle the success response (e.g., redirecting or logging in)
      await registerUser(formData);
      alert('Registration successful!');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#061818] text-teal-50 font-sans">
      
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10 overflow-y-auto">
        {/* Header / Brand */}
        <div className="p-8 lg:p-12">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-teal-400 hover:text-teal-300 transition-colors">
            Chat-Ease
          </Link>
        </div>

        {/* Form Container (No Box) */}
        <div className="flex-1 flex items-center justify-center p-8 lg:px-12 lg:py-6">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-3 text-white tracking-tight">Create an account</h1>
            <p className="text-teal-100/60 font-light mb-8 text-lg">Join us and start connecting instantly.</p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-teal-100/80 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100/80 mb-2">Unique Handle</label>
                <input 
                  type="text" 
                  name="handle"
                  value={formData.handle}
                  onChange={handleChange}
                  required
                  placeholder="@janedoe"
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-100/80 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-teal-100/80 mb-2">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-teal-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
              >
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-teal-100/50">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual/Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-teal-950 items-center justify-center p-12 overflow-hidden border-l border-white/5">
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
              <h2 className="text-2xl font-bold text-white mb-2">Join the conversation.</h2>
              <p className="text-teal-200/80 font-light text-sm">Create an account today to connect with friends using unique handles and lightning-fast chat.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}