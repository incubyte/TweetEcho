import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { checkDatabaseTables } from "@/lib/supabase/db-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Check if database tables exist during server initialization
if (process.env.NODE_ENV === 'development') {
  checkDatabaseTables().then((result) => {
    if (!result?.tablesExist) {
      console.warn('⚠️ Database tables not found! Please run "npm run setup-db" to set up your database.');
    } else {
      console.log('✅ Database tables ready.');
    }
  }).catch(error => {
    console.error('❌ Error checking database tables:', error);
  });
}

export const metadata: Metadata = {
  title: "App with Google Auth",
  description: "Next.js app with Supabase Google Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
