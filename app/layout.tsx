import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Chat-Ease",
    description: "A universal Chatting App",
};

import { Toaster } from "react-hot-toast";
import { Providers } from "./components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <Toaster 
                        position="bottom-right" 
                        toastOptions={{
                            style: {
                                background: '#042f2e', 
                                color: '#ccfbf1', 
                                border: '1px solid rgba(20, 184, 166, 0.2)',
                                backdropFilter: 'blur(10px)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#14b8a6',
                                    secondary: '#042f2e',
                                },
                            },
                        }} 
                    />
                </Providers>
            </body>
        </html>
    );
}
