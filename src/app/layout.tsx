import "./globals.css";
import { ThemeProvider } from "next-themes";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {
  title: "NexusAI - Enterprise Mesh & Inference Orchestrator",
  description: "Production-grade AI SaaS Admin Dashboard",
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