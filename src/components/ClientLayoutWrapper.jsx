"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LenisProvider from '@/components/LenisProvider';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/veeradmin');

  if (isAdmin) {
    return <main className="min-h-screen bg-dark text-white">{children}</main>;
  }

  return (
    <LenisProvider>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </LenisProvider>
  );
}
