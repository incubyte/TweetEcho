import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TweetEcho | Your Twitter Voice, Amplified by AI",
  description: "TweetEcho learns from your best-performing tweets to create authentic content that sounds like you and engages your audience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>
            {children}
            <Toaster position="bottom-right" />
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
