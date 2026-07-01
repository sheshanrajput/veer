"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Phone, Search } from 'lucide-react';
import { NAV_LINKS, CONTACT_INFO } from '@/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isDocked, setIsDocked] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsDocked(false);
      } else if (currentScrollY > lastScrollY) {
        setIsDocked(true);
      } else {
        setIsDocked(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  return (
    <>
      <header
        className={`fixed top-4 left-0 w-full z-50 px-4 sm:px-6 transition-all duration-500 ease-in-out ${
          isDocked && !isOpen ? '-translate-y-4' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto bg-black border border-white/10 rounded-full px-6 py-2.5 shadow-2xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/veer-international-logo.png" 
              alt="VEER International Logo" 
              className="h-9 w-auto object-contain hover:scale-102 transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-xs font-bold tracking-wide uppercase px-4 py-2 rounded-full transition-colors duration-300 ${
                    isActive ? 'text-black z-10' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-secondary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/tracking"
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs font-bold transition-all duration-300"
            >
              <Search className="w-3.5 h-3.5 text-secondary" />
              Track Shipment
            </Link>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white hover:bg-primary-dark text-xs font-bold transition-all duration-300 shadow-md shadow-primary/20"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-full text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

            <div className="flex flex-col gap-3 mt-8">
              <Link
                href="/tracking"
                onClick={() => setIsOpen(false)}
                className="btn-outline-white w-full flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4 text-secondary" />
                Track Shipment
              </Link>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
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
