"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User, AtSign } from "lucide-react";

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/login");
                    return;
                }
                const data = await res.json();
                setName(data.user.name || "");
                setHandle(data.user.handle || "");
                setAvatarPreview(data.user.avatar || `https://i.pravatar.cc/150?u=${data.user.email}`);
            } catch (err) {
                console.error("Failed to fetch user", err);
                toast.error("Failed to load profile data");
                router.push("/chat");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            let uploadedAvatarUrl = avatarPreview; // Default to existing

            // Upload to Cloudinary if a new file was selected
            if (avatarFile) {
                toast.loading("Uploading avatar...", { id: "upload-toast" });
                const formData = new FormData();
                formData.append("file", avatarFile);
                formData.append("upload_preset", "chat-ease-profilepics");

                const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dfr57apl2/image/upload", {
                    method: "POST",
                    body: formData,
                });

                const cloudData = await cloudRes.json();
                
                if (!cloudRes.ok) {
                    throw new Error(cloudData.error?.message || "Failed to upload image");
                }
                
                uploadedAvatarUrl = cloudData.secure_url;
                toast.success("Avatar uploaded!", { id: "upload-toast" });
            }

            // Update profile in our database
            const res = await fetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, handle, avatar: uploadedAvatarUrl }),
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update profile");
            
            toast.success("Profile updated successfully!");
            router.push("/chat");
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
            toast.dismiss("upload-toast");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-950 font-sans">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden bg-primary-950">
            {/* Global Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary-400/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />

            <div className="relative z-10 w-full max-w-lg p-8 md:p-10 backdrop-blur-xl bg-primary-950/40 border border-primary-500/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-4">
                
                {/* Header */}
                <div className="flex items-center mb-8 relative">
                    <Link href="/chat" className="absolute left-0 p-2 text-primary-100/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-white text-center tracking-tight w-full">
                        Profile Settings
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload Area */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-500/50 relative shadow-xl shadow-primary-500/20 transition-transform group-hover:scale-105">
                                {avatarPreview ? (
                                    <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                        <User size={40} className="text-primary-100/50" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                    <Camera size={24} className="text-white" />
                                    <span className="text-xs text-white font-medium">Change</span>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                        <p className="text-sm text-primary-100/50 mt-4 text-center">Click the image to upload a new avatar</p>
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-primary-100/80 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-100/40" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your Name"
                                className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-primary-100/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Handle Input */}
                    <div>
                        <label className="block text-sm font-medium text-primary-100/80 mb-2">
                            Username / Handle
                        </label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-100/40" size={18} />
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                required
                                placeholder="yourhandle"
                                className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-primary-100/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !name.trim() || !handle.trim()}
                        className="w-full py-4 mt-8 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 text-primary-950 font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
                    >
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
