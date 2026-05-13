import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import "./nprogress.css";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Providers } from "@/components/providers";
import { ProgressBar } from "@/components/progress-bar";
import { ConnectionStatus } from "@/components/connection-status";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bid The Bezel Admin Panel",
  description: "Admin panel for managing the Bid The Bezel application",
  robots: "noindex, nofollow",
  icons: {
    icon: "images/fav-icon.png",
    shortcut: "images/fav-icon.png",
    apple: "images/fav-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <Toaster
            position="bottom-left"
            toastOptions={{
              style: {
                background: "#0d1b2a",
                color: "#ffffff",
                border: "none",
              },
            }}
          />
          <ProgressBar />
          <ConnectionStatus />
          <Providers>
            <SidebarConfigProvider>{children}</SidebarConfigProvider>
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
