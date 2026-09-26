import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

import AppProviders from "@/providers/AppProviders";
import Header from "@/components/shared/Header";
import BottomNavigation from "@/components/shared/BottomNavigation";
import CategoriesProvider from '@/providers/client/CategoriesProvider';
import { categoryRepo } from '@/di/adapters';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amazing Ekb",
  description: "Путешествие по Екатеринбургу",
};

export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await categoryRepo.getAllCategories();
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} pb-content flex min-h-screen flex-col antialiased`}
      >
        <AppProviders>
          <CategoriesProvider categories={categories.success ? categories.data : []}>
          <Header />
          {children}
          <BottomNavigation />
          </CategoriesProvider>
        </AppProviders>
      </body>
    </html>
  );
}
