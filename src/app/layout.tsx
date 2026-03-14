import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "LinguaCam Live",
        template: "%s | LinguaCam Live",
    },
    description: "Bilibili-style live streaming with wave danmu bullets, real-time translated captions, and multilingual support powered by Lingo.dev",
    keywords: ["live stream", "danmu", "bullet chat", "multilingual", "lingo.dev", "hackathon"],
    openGraph: {
        title: "LinguaCam Live",
        description: "Experience floating wave danmu and live translated captions in your webcam streams",
        url: "https://lingua-cam-live.vercel.app",
        siteName: "LinguaCam Live",
        images: [
            {
                url: "/og-image.jpg", // add this image to public/ later
                width: 1200,
                height: 630,
                alt: "LinguaCam Live – Bilibili-style streaming",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "LinguaCam Live",
        description: "Wave danmu + real-time translated captions – built for Lingo.dev Hackathon",
        images: ["/og-image.jpg"],
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}
            >
                {children}
            </body>
        </html>
    );
}