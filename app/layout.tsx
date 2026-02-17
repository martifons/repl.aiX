import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import { ToastContainer } from '@/components/Toast';
import ParticleBackground from '@/components/ParticleBackground';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'repl.aiX',
  description: 'Repl.aiX - Grow your X presence with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ParticleBackground />
        <div className="relative z-10">
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
