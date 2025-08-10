import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/next"
import { type Metadata } from "next";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "GitSummary",
  description: "Your AI-powered GitHub assistant",
  icons: [{ rel: "icon", url: "/fav.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <Analytics />
    </html>
  </ClerkProvider>
  );
}
