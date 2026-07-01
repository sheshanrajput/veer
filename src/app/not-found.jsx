"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Home, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Radar lines */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
        
        {/* Animated Compass Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary mb-4 shadow-2xl relative"
        >
          <Compass className="w-10 h-10" />
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/40 tracking-wider">N</span>
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/40 tracking-wider">S</span>
        </motion.div>

        <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full">
          Route Out of Scope
        </span>
        
        <h1 className="font-heading font-black text-7xl md:text-8xl text-white tracking-tighter">
          404
        </h1>

        <h2 className="font-heading font-bold text-2xl text-white/90">
          Shipment Coordinates Lost
        </h2>

        <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
          The routing path you entered doesn't correspond to any active page. Let us guide you back to our main freight routes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link
            href="/"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            Home Console
          </Link>
          
          <Link
            href="/tracking"
            className="btn-outline-white flex items-center gap-2 text-sm"
          >
            <Search className="w-4 h-4 text-secondary" />
            Track Shipment
          </Link>
        </div>

      </div>
    </div>
  );
}
