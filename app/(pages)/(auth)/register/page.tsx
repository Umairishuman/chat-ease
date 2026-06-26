"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/api/auth";

export default function Register() {
	const [formData, setFormData] = useState({
		name: "",
		handle: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// In a real app we'd handle the success response (e.g., redirecting or logging in)
			await registerUser(formData);
			alert("Registration successful!");
		} catch (err: any) {
			setError(err.message || "Something went wrong. Please try again.");
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
				className="object-cover z-0 opacity-40 mix-blend-luminosity"
				priority
			/>
			
			{/* Overlay to darken and tint the background */}
			<div className="absolute inset-0 bg-[#061818]/80 backdrop-blur-md z-0" />

			{/* Form Container */}
			<div className="relative z-10 w-full max-w-md p-8 md:p-10 backdrop-blur-xl bg-teal-950/40 border border-teal-500/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
				{/* Header / Brand Logo */}
				<div className="flex justify-center mb-6">
					<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<Image
							src="/enhanced-chat-ease-logo.png"
							alt="Chat-Ease Logo"
							width={80}
							height={80}
							className="object-contain"
						/>
						<span className="text-3xl font-bold tracking-tight text-white">
							Chat-Ease
						</span>
					</Link>
				</div>

				<h1 className="text-2xl font-bold mb-2 text-white text-center tracking-tight">
					Create an account
				</h1>
				<p className="text-teal-100/60 font-light mb-8 text-center text-sm">
					Join us and start connecting instantly.
				</p>

				{error && (
					<div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-teal-100/80 mb-1.5">
							Full Name
						</label>
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
						<label className="block text-sm font-medium text-teal-100/80 mb-1.5">
							Unique Handle
						</label>
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
						<label className="block text-sm font-medium text-teal-100/80 mb-1.5">
							Email Address
						</label>
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
						<label className="block text-sm font-medium text-teal-100/80 mb-1.5">
							Password
						</label>
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
						{loading ? "Registering..." : "Sign Up"}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-teal-100/50">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
					>
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
