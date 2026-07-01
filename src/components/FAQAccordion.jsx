"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { FAQS } from '@/constants';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'bg-white border-primary/20 shadow-premium'
                : 'bg-white/40 border-black/[0.04] hover:bg-white/60'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-bold text-base md:text-lg text-dark">
                {faq.question}
              </span>
              <span
                className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 shrink-0 ${
                  isOpen ? 'border-primary bg-primary text-white' : 'border-dark/10 text-dark/70'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 md:p-6 pt-0 border-t border-black/[0.04] text-sm md:text-base text-dark/70 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
