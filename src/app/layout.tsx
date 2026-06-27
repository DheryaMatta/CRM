import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CRMProvider } from '../context/CRMContext';
import { AppLayout } from '../components/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexus CRM - Enterprise Edition',
  description: 'Minimalist SaaS CRM platform with AI-driven analytics, task prioritized feeds, and pipeline management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-body-md text-on-background bg-background dark:bg-inverse-surface dark:text-inverse-on-surface">
        <ThemeProvider>
          <CRMProvider>
            <AppLayout>{children}</AppLayout>
          </CRMProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
