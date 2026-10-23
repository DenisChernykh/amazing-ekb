import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import CategoriesProvider from "@/providers/client/CategoriesProvider";
import AuthInitClient from "@/components/features/auth/AuthInitClient";
import { categoryRepo } from "@/di/adapters";

const didact = localFont({
  src: "./fonts/DidactGothic-Regular.ttf",
  variable: "--font-didact",
  weight: "400",
  display: "swap",
});
const apfel = localFont({
  src: "./fonts/ApfelGrotezk-Regular.woff2",
  variable: "--font-apfel",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amazing EKB — открой город, найди своё",
    template: "%s · Amazing EKB",
  },
  description:
    "Места, подборки и обзоры проекта «Стрельчук в Екатеринбурге». Идеи для завтрака, встречи, отдыха и маленького путешествия.",
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await categoryRepo.getAllCategories();
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body
        className={`${didact.variable} ${apfel.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <AppProviders>
          <CategoriesProvider
            categories={categories.success ? categories.data : []}
          >
            <AuthInitClient />
            <Header />
            <main id="main" className="grow">
              {children}
            </main>
            <Footer />
          </CategoriesProvider>
        </AppProviders>
      </body>
    </html>
  );
}
