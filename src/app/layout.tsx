import "./globals.css";
import { ThemeProvider } from "next-themes";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {
title: 'TechknowPointAI - AI Infrastructure & Gateway Telemetry Dashboard',
description: 'Next.js AI Gateway and Token Telemetry Dashboard Template',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}