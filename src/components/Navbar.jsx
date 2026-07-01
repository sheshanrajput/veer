"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Phone, Search } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { NAV_LINKS, CONTACT_INFO } from '@/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollPosition(20);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-premium'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/veer-international-logo.png" 
              alt="VEER International Logo" 
              className="h-12 w-auto object-contain hover:scale-102 transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                    isActive ? 'text-secondary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/tracking"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 text-sm font-semibold transition-all duration-300"
            >
              <Search className="w-4 h-4 text-secondary" />
              Track Shipment
            </Link>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark pt-28 px-6 pb-8 flex flex-col justify-between lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl font-heading font-semibold uppercase tracking-wider ${
                      isActive ? 'text-secondary' : 'text-white/70'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 mt-12">
              <Link
                href="/tracking"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-center hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4 text-secondary" />
                Track Shipment
              </Link>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-white font-semibold text-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <div className="text-center text-white/40 text-xs mt-6">
                © {new Date().getFullYear()} VEER Express Cargo. All Rights Reserved.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
