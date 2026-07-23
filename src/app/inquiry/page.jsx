"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiryRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/contact');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-dark/40 font-sans">
      Redirecting to Contact...
    </div>
  );
}
