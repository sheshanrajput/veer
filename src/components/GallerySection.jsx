"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ImageIcon } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    id: 1,
    title: "Air Freight Wing & Transit",
    category: "Air Cargo",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Warehouse Distribution Hub",
    category: "Storage",
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Express Road Logistics",
    category: "Transit Route",
    url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Seaport Container Dock",
    category: "Ocean Freight",
    url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Secure Package Sorting",
    category: "Packaging",
    url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Global Supply Solutions",
    category: "Logistics Desk",
    url: "https://images.unsplash.com/photo-1521791136368-1a8682707636?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Cargo Aircraft Fleet",
    category: "Air Fleet",
    url: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Global Cargo Carrier",
    category: "Ocean Cargo",
    url: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80",
  }
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with the 3rd item as active
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-10 px-6 md:px-8 bg-background border-t border-black/[0.02] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Title Header */}
        <div className="max-w-2xl mx-auto mb-2 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-primary/5 px-3.5 py-1.5 rounded-full">
            Operations Gallery
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
            VEER Logistics in Action
          </h2>
          <p className="text-dark/60 text-sm sm:text-base mt-3 leading-relaxed">
            Take a look at our live shipment dispatches, automated packaging lines, and trans-continental flight transfers.
          </p>
        </div>

        {/* 3D Coverflow Container */}
        <div className="relative h-[360px] sm:h-[480px] w-full flex items-center justify-center">
          {GALLERY_IMAGES.map((item, index) => {
            // Calculate relative offset with looping wrap-around logic
            let offset = index - activeIndex;
            if (offset < -GALLERY_IMAGES.length / 2) {
              offset += GALLERY_IMAGES.length;
            } else if (offset > GALLERY_IMAGES.length / 2) {
              offset -= GALLERY_IMAGES.length;
            }

            const absOffset = Math.abs(offset);
            
            // Hide cards that are out of scope (only show center card + 1 neighbor on mobile, + 2 on desktop)
            const maxVisible = isMobile ? 1 : 2;
            if (absOffset > maxVisible) return null;

            // Positioning calculations to stack and overlap correctly
            const xTranslation = isMobile ? offset * 130 : offset * 240;
            const cardScale = 1 - absOffset * 0.12;
            const cardOpacity = 1 - absOffset * 0.35;
            const cardZIndex = 10 - absOffset;

            return (
              <motion.div
                key={item.id}
                style={{
                  zIndex: cardZIndex,
                  position: 'absolute',
                }}
                animate={{
                  x: xTranslation,
                  scale: cardScale,
                  opacity: cardOpacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => setActiveIndex(index)}
                className={`relative w-[210px] h-[300px] sm:w-[310px] sm:h-[440px] rounded-[32px] overflow-hidden border border-black/[0.04] bg-neutral-100 flex flex-col justify-end cursor-pointer transition-shadow duration-300 ${
                  absOffset === 0 
                    ? 'shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />
                
                {/* Ambient dark gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent transition-opacity duration-300 ${
                  absOffset === 0 ? 'opacity-85' : 'opacity-70'
                }`} />

                {/* Floating Tag (only visible on active card or hovered cards) */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="text-[9px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>

                {/* Info Text (Fades out when not active/center) */}
                <div 
                  className={`absolute bottom-6 left-6 right-6 text-left z-10 transition-all duration-300 ${
                    absOffset === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <h3 className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1.5 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-secondary" />
                    VEER Operations Hub
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Circular Arrow Navigation Controls at bottom center */}
        <div className="flex justify-center items-center gap-4 mt-2 sm:mt-2">
          <button
            onClick={handlePrev}
            className="p-3.5 rounded-full border border-black/10 hover:bg-black/[0.04] active:scale-95 transition-all text-dark shadow-sm bg-white"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="p-3.5 rounded-full border border-black/10 hover:bg-black/[0.04] active:scale-95 transition-all text-dark shadow-sm bg-white"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
