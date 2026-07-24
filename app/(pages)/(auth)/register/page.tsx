"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/api/auth";
import toast from "react-hot-toast";

export default function Register() {
	const [formData, setFormData] = useState({
		name: "",
		handle: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await registerUser(formData);
			toast.success("Registration successful!");
		} catch (err: any) {
			toast.error(err.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
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
				<div className="flex justify-center mb-6">
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
					Create an account
				</h1>
				<p className="text-muted font-light mb-8 text-center text-sm">
					Join us and start connecting instantly.
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-1.5">
							Full Name
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Jane Doe"
							className="w-full px-5 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-1.5">
							Unique Handle
						</label>
						<input
							type="text"
							name="handle"
							value={formData.handle}
							onChange={handleChange}
							required
							placeholder="@janedoe"
							className="w-full px-5 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-1.5">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="you@example.com"
							className="w-full px-5 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary-900/80 mb-1.5">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="••••••••"
							className="w-full px-5 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 mt-6 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 text-primary-950 font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
					>
						{loading ? "Registering..." : "Sign Up"}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-muted">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
