import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/src/app/app-provider";
import SlideSession from "@/components/slide-session";
import { baseOpenGraph } from "@/src/app/shared-metadata";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/header"), { ssr: false });
const myFont = localFont({
  src: [
    {
      path: "./Roboto-Thin.ttf",
      weight: "100",
    },
    {
      path: "./Roboto-Regular.ttf",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--font-roboto",
});
// import { Roboto } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: { template: "%s | Productic", default: "Productic" },
  description: "Được tạo bởi Chi Hà",
  openGraph: { ...baseOpenGraph },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <Header />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
