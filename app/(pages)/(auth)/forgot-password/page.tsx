"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [step, setStep] = useState<1 | 2>(1);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRequestCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to request code");

			toast.success("If that email is registered, a reset code was sent.");
			setStep(2);
		} catch (err: any) {
			toast.error(err.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code, newPassword }),
			});
			
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to reset password");

			toast.success("Password successfully reset!");
			router.push("/login");
		} catch (err: any) {
			toast.error(err.message || "Invalid or expired code");
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
					Reset Password
				</h1>
				<p className="text-teal-100/60 font-light mb-8 text-center text-sm">
					{step === 1 ? "Enter your email to receive a reset code." : "Enter the code sent to your email and a new password."}
				</p>

				{step === 1 ? (
					<form onSubmit={handleRequestCode} className="space-y-5">
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

						<button
							type="submit"
							disabled={loading || !email}
							className="w-full py-4 mt-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-teal-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
						>
							{loading ? "Sending Code..." : "Send Reset Code"}
						</button>
					</form>
				) : (
					<form onSubmit={handleResetPassword} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-teal-100/80 mb-2">
								Email Address
							</label>
							<input
								type="email"
								value={email}
								disabled
								className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white opacity-50 cursor-not-allowed"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-teal-100/80 mb-2">
								6-Digit Code
							</label>
							<input
								type="text"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								required
								maxLength={6}
								placeholder="123456"
								className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all tracking-[0.5em] text-center font-mono text-xl"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-teal-100/80 mb-2">
								New Password
							</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								placeholder="••••••••"
								className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-teal-100/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white/10 transition-all"
							/>
						</div>

						<button
							type="submit"
							disabled={loading || !code || !newPassword}
							className="w-full py-4 mt-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-teal-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
						>
							{loading ? "Resetting..." : "Reset Password"}
						</button>
					</form>
				)}

				<div className="mt-8 text-center text-sm text-teal-100/50">
					Remembered your password?{" "}
					<Link
						href="/login"
						className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
					>
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
