"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <header className="h-16 border-b border-white/5 bg-dark-light px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Toggle Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb / Title */}
      <div className="hidden sm:block">
        <h2 className="text-sm font-semibold text-white/80">Management Console</h2>
      </div>

      {/* Admin Menu Dropdown */}
      <div className="relative ml-auto">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-sm font-medium text-white/80 hover:text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white shadow-md shadow-primary/20">
            A
          </div>
          <span className="hidden sm:block">Administrator</span>
          <ChevronDown size={16} className={`text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <>
            {/* Click Outside Overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-dark-lighter border border-white/5 shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 text-xs text-white/40 border-b border-white/5 font-semibold uppercase tracking-wider">
                Admin Settings
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  toast('Profile editing features can be accessed directly via files or database schema.', { icon: '👤' });
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <User size={16} className="text-white/40" />
                <span>My Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
