"use client";
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20VEER%20Logistics%2C%20I%20would%20like%20to%20inquire%20about%20your%20international%20shipping%20services.`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform duration-300 group"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />
      
      {/* Custom WhatsApp Icon SVG or lucide variant */}
      <svg
        className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.331 1.981 13.86 1.95 11.233 1.95c-5.437 0-9.862 4.371-9.866 9.8c-.001 1.761.472 3.478 1.371 5.011L1.758 20.89l4.889-1.282zM16.897 14c-.268-.134-1.589-.784-1.835-.873-.246-.089-.426-.134-.606.134-.18.269-.696.873-.853 1.052-.157.179-.314.202-.582.067-.268-.134-1.132-.418-2.156-1.332-.796-.71-1.334-1.588-1.49-1.857-.157-.269-.017-.414.118-.548.121-.121.268-.314.402-.471.134-.157.179-.269.269-.448.09-.179.045-.336-.022-.471-.067-.134-.606-1.458-.83-1.996-.219-.527-.46-.454-.63-.463-.162-.009-.348-.01-.534-.01s-.488.07-.743.348c-.256.278-.978.955-.978 2.329s1.002 2.701 1.142 2.891c.14.19 1.974 3.014 4.783 4.226.668.288 1.19.46 1.597.59.672.213 1.28.183 1.761.11.537-.081 1.589-.65 1.813-1.277.224-.627.224-1.164.157-1.277-.067-.113-.246-.179-.514-.313z" />
      </svg>
    </motion.a>
  );
}
