"use client";

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Wrapper */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
