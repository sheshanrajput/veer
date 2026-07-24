"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Image as ImageIcon, LogOut, X, Package, MessageSquare, HelpCircle, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/veeradmin/dashboard', icon: LayoutDashboard },
    { name: 'Hero Slider', path: '/veeradmin/hero-slides', icon: Sliders },
    { name: 'Services', path: '/veeradmin/services', icon: FileText },
    { name: 'Gallery', path: '/veeradmin/gallery', icon: ImageIcon },
    { name: 'Orders', path: '/veeradmin/orders', icon: Package },
    { name: 'Testimonials', path: '/veeradmin/testimonials', icon: MessageSquare },
    { name: 'FAQs', path: '/veeradmin/faqs', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/veeradmin');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-light border-r border-white/5 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/veeradmin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VEER Panel
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/25 text-white shadow-lg shadow-primary/5'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-white/40'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
