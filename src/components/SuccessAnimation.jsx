"use client";
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SuccessAnimation({ referenceNumber, onReset }) {
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-2xl mx-auto">
      {/* Animated Checkmark Circle */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center border border-success/30"
        >
          <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <motion.path
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        
        {/* Floating Mini Particles */}
        <motion.span
          animate={{ y: [-10, -20, -10], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          className="absolute -top-2 left-4 text-primary font-heading font-black text-xl"
        >
          ✈
        </motion.span>
        <motion.span
          animate={{ y: [10, -5, 10], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 0.6 }}
          className="absolute bottom-2 -right-2 text-secondary font-heading font-black text-lg"
        >
          📦
        </motion.span>
      </div>

      <motion.h2
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="font-heading font-bold text-3xl text-dark mb-4"
      >
        Inquiry Submitted Successfully!
      </motion.h2>

      <motion.p
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="text-dark/70 text-base mb-8 max-w-md leading-relaxed"
      >
        We have received your shipment coordinates. An international logistics expert will analyze your requirements and call you back in 15 minutes.
      </motion.p>

      {/* Ticket Reference Block */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="w-full bg-white rounded-2xl border border-black/[0.04] p-6 mb-10 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold text-dark/40 tracking-wider">Reference Quote ID</span>
          <p className="font-numbers font-black text-xl text-primary mt-0.5">{referenceNumber}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/tracking?num=${referenceNumber}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 hover:border-primary/50 text-sm font-bold text-primary transition-colors duration-300"
          >
            Track Status
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Secondary CTAs */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark hover:bg-dark-light text-white font-semibold transition-colors duration-300"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-black/10 hover:bg-black/[0.02] text-dark font-semibold transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Submit Another Quote
        </button>
      </motion.div>
    </div>
  );
}
