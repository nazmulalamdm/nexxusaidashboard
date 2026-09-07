import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import CopilotWidget from '@/components/CopilotWidget';

export const metadata: Metadata = {
  title: 'TechknowPointAI | Telemetry & Inference Gateway',
  description: 'Enterprise AI Telemetry, Token Accounting and Edge Gateway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body
        className="bg-[#020b14] text-white antialiased min-h-screen selection:bg-cyan-500 selection:text-black"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <CopilotWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}