import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/src/app/app-provider";
import { cookies } from "next/headers";
import SlideSession from "@/components/slide-session";
import accountApiRequest from "@/src/apiRequests/account";
import { AccountResType } from "@/src/schemaValidations/account.schema";

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log("RootLayout", cookieStore.get("sessionToken"));

  let user: AccountResType["data"] | null = null;
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken.value);
    user = data.payload.data;
  }
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
          <AppProvider initialSessionToken={sessionToken?.value} user={user}>
            <Header user={user} />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
