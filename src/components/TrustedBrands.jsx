"use client";
import { motion } from 'framer-motion';

const BRANDS = [
  { name: "FedEx", logo: "FedEx" },
  { name: "DHL", logo: "DHL Express" },
  { name: "UPS", logo: "UPS" },
  { name: "Aramex", logo: "aramex" },
  { name: "Blue Dart", logo: "BLUE DART" },
  { name: "India Post", logo: "India Post" }
];

export default function TrustedBrands() {
  // Duplicate list to make infinite scroll smooth
  const doubleBrands = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div className="w-full overflow-hidden py-6 border-y border-black/[0.04] bg-white/20 backdrop-blur-sm relative">
      {/* Left/Right Glass Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-[200%] gap-12 items-center animate-marquee whitespace-nowrap">
        {doubleBrands.map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center min-w-[120px] md:min-w-[180px] select-none"
          >
            <span className="font-heading font-black text-xl md:text-2xl tracking-tighter text-dark/30 hover:text-dark/80 transition-colors duration-300">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
