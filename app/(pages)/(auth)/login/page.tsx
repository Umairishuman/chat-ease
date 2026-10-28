"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/app/(pages)/lib/errors";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
		if (!credentialResponse.credential) return;
		setLoading(true);
		try {
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ credential: credentialResponse.credential }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Google login failed");

			toast.success("Login successful!");
			router.push("/chat");
		} catch (err) {
			toast.error(getErrorMessage(err, "Failed to authenticate with Google"));
		} finally {
			setLoading(false);
		}
	};

	// useGoogleOneTapLogin({
	// 	onSuccess: handleGoogleSuccess,
	// 	onError: () => toast.error('Google One-Tap failed'),
	// });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, rememberMe }),
			});
			
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to login");

			toast.success("Login successful!");
			router.push("/chat");
		} catch (err) {
			toast.error(getErrorMessage(err, "Invalid credentials."));
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
			<div className="absolute inset-0 bg-background backdrop-blur-md z-0" />

			{/* Form Container */}
			<div className="relative z-10 w-full max-w-md p-8 md:p-10 backdrop-blur-xl bg-surface border border-primary-500/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
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
						<span className="text-3xl font-bold tracking-tight text-foreground">
							Chat-Ease
						</span>
					</Link>
				</div>

				<h1 className="text-2xl font-bold mb-2 text-foreground text-center tracking-tight">
					Welcome back
				</h1>
				<p className="text-muted font-light mb-8 text-center text-sm">
					Sign in to continue your conversations.
				</p>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-2">
							Email Address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="you@example.com"
							className="w-full px-5 py-3.5 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="••••••••"
							className="w-full px-5 py-3.5 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
						
						<div className="flex items-center justify-between mt-4">
							<label className="flex items-center gap-2 cursor-pointer group">
								<div className="relative flex items-center justify-center w-5 h-5 rounded border border-border bg-surface group-hover:border-primary-400 transition-colors overflow-hidden">
									<input 
										type="checkbox" 
										className="peer sr-only" 
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
									/>
									<div className="absolute inset-0 bg-primary-500 opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
										<svg className="w-3.5 h-3.5 text-primary-950 transform scale-50 peer-checked:scale-100 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									</div>
								</div>
								<span className="text-sm text-muted group-hover:text-primary-900 transition-colors">
									Remember me
								</span>
							</label>

							<Link
								href="/forgot-password"
								className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
							>
								Forgot password?
							</Link>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 mt-6 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 text-primary-950 font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 text-muted relative z-10 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-xl before:bg-background before:rounded-lg">
								Or continue with
							</span>
						</div>
					</div>

					<div className="flex justify-center w-full [&>div]:w-full">
						<GoogleLogin
							onSuccess={handleGoogleSuccess}
							onError={() => toast.error("Google Login failed")}
							theme="filled_black"
							shape="pill"
							size="large"
							text="continue_with"
						/>
					</div>
				</form>

				<div className="mt-8 text-center text-sm text-muted">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
					>
						Create an account
					</Link>
				</div>
			</div>
		</div>
	);
}
