"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Mocking an API call for now until real auth is wired
			await new Promise(resolve => setTimeout(resolve, 1000));
			toast.success("Login successful!");
		} catch (err: any) {
			toast.error("Invalid credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden">
			{/* Full Screen Background Image */}
			<Image
				src="/hero-mockup.png"
				alt="Background"
				fill
				sizes="100vw"
				className="object-cover z-0 opacity-40 mix-blend-luminosity"
				priority
			/>
			
			{/* Overlay to darken and tint the background */}
			<div className="absolute inset-0 bg-[#061818]/80 backdrop-blur-md z-0" />

			{/* Form Container */}
			<div className="relative z-10 w-full max-w-md p-8 md:p-10 backdrop-blur-xl bg-teal-950/40 border border-teal-500/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
				{/* Header / Brand Logo */}
				<div className="flex justify-center mb-8">
					<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<Image
							src="/enhanced-chat-ease-logo.png"
							alt="Chat-Ease Logo"
							width={0}
							height={0}
							sizes="100vw"
							className="w-auto h-16 object-contain"
						/>
						<span className="text-3xl font-bold tracking-tight text-white">
							Chat-Ease
						</span>
					</Link>
				</div>

				<h1 className="text-2xl font-bold mb-2 text-white text-center tracking-tight">
					Welcome back
				</h1>
				<p className="text-teal-100/60 font-light mb-8 text-center text-sm">
					Sign in to continue your conversations.
				</p>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-teal-100/80 mb-2">
							Email Address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="you@example.com"
							className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<label className="block text-sm font-medium text-teal-100/80">
								Password
							</label>
							<Link
								href="#"
								className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
							>
								Forgot password?
							</Link>
						</div>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="••••••••"
							className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 mt-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-teal-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-teal-100/50">
					Don't have an account?{" "}
					<Link
						href="/register"
						className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
					>
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
}
