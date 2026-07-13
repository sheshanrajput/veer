"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Maximize2, X } from "lucide-react";

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
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ cardWidth: 340, gap: 28 });
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  // Responsive settings
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ cardWidth: 220, gap: 16 });
      } else {
        setDimensions({ cardWidth: 340, gap: 28 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { cardWidth, gap } = dimensions;
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const totalWidth = GALLERY_IMAGES.length * (cardWidth + gap);

  // Infinite looping listener
  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      if (latest < -totalWidth) {
        x.set(latest + totalWidth);
      } else if (latest > totalWidth) {
        x.set(latest - totalWidth);
      }
    });
    return () => unsubscribe();
  }, [x, totalWidth]);

  // Autoplay marquee (pauses on hover or dragging)
  useEffect(() => {
    if (isHovered || isDragging) return;
    const controls = setInterval(() => {
      x.set(x.get() - 0.5);
    }, 16);
    return () => clearInterval(controls);
  }, [isHovered, isDragging, x]);

  // Manual slide control
  const handlePrev = () => {
    x.set(x.get() + (cardWidth + gap));
  };
  const handleNext = () => {
    x.set(x.get() - (cardWidth + gap));
  };

  const nestedImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <section 
      ref={containerRef}
      className="py-6 md:py-10 bg-background border-t border-black/[0.02] overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 flex flex-col items-center px-6">
        <h2 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl text-dark mt-4">
          VEER Logistics in Action
        </h2>
        <p className="text-dark/60 text-xs sm:text-sm md:text-base mt-3 leading-relaxed max-w-2xl mx-auto">
          Take a look at our live shipment dispatches, automated packaging lines, and trans-continental flight transfers.
        </p>
      </div>

      {/* The 3D Stage */}
      <div 
        className="relative w-full h-[180px] md:h-[420px] flex items-center justify-center overflow-hidden" 
        style={{ perspective: "1200px", perspectiveOrigin: "center 50%" }}
      >
        <motion.div 
          style={{ x: springX, transformStyle: "preserve-3d" }}
          className="flex gap-4 md:gap-7 cursor-grab active:cursor-grabbing items-center"
          drag="x"
          dragConstraints={{ left: -totalWidth, right: totalWidth }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          {nestedImages.map((item, index) => (
            <GalleryCard 
              key={`${item.id}-${index}`} 
              item={item} 
              baseX={springX} 
              index={index}
              totalItems={nestedImages.length}
              cardWidth={cardWidth}
              gap={gap}
              onCardClick={setSelectedImage}
            />
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls & Instruction */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2 px-6">
       
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2.5 md:p-3.5 rounded-full border border-black/10 hover:bg-black/[0.04] active:scale-95 transition-all text-dark shadow-sm bg-white"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="p-2.5 md:p-3.5 rounded-full border border-black/10 hover:bg-black/[0.04] active:scale-95 transition-all text-dark shadow-sm bg-white"
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && renderLightbox(selectedImage, setSelectedImage)}
      </AnimatePresence>
    </section>
  );
}

// 3D Card Component
function GalleryCard({ item, baseX, index, totalItems, cardWidth, gap, onCardClick }) {
  // Center alignment logic
  const initialX = index * (cardWidth + gap);
  const offset = (totalItems * (cardWidth + gap)) / 2;
  const screenX = useTransform(baseX, (val) => val + initialX - offset + (cardWidth / 2));

  // 3D Transforms
  const rotateY = useTransform(screenX, [-800, 0, 800], [35, 0, -35]);
  const translateZ = useTransform(screenX, [-800, 0, 800], [-180, 40, -180]);
  const scale = useTransform(screenX, [-800, 0, 800], [0.8, 1.1, 0.8]);
  const opacity = useTransform(screenX, [-1000, -600, 0, 600, 1000], [0, 0.7, 1, 0.7, 0]);

  return (
    <motion.div
      style={{
        width: cardWidth,
        rotateY,
        translateZ,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
      onClick={() => onCardClick(item)}
      className="flex-shrink-0 flex flex-col items-center group pointer-events-auto cursor-pointer"
    >
      {/* Banner design card */}
      <div className="w-full relative aspect-[15/10] md:aspect-[14/10] rounded-[20px] md:rounded-[28px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.1)] border border-black/[0.04] bg-neutral-900">
        <img 
          src={item.url} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
          loading="lazy"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/45 to-transparent transition-all duration-300" />
        
        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Info details */}
        <div className="absolute bottom-4 left-4 right-4 text-left z-10">
          <h3 className="font-heading font-extrabold text-white text-xs md:text-base leading-tight mb-1 group-hover:text-secondary transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-white/60 text-[9px] md:text-[10px] font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-secondary" />
            VEER Operations Hub
          </p>
        </div>

        {/* Hover Zoom Indicator */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
          >
            <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Fullscreen Lightbox Helper
function renderLightbox(selectedImage, setSelectedImage) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
      onClick={() => setSelectedImage(null)}
    >
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 z-50 active:scale-95"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-5xl w-full h-[60vh] md:h-[75vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={selectedImage.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          src={selectedImage.url}
          alt={selectedImage.title}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            const currentIdx = GALLERY_IMAGES.findIndex(img => img.id === selectedImage.id);
            const prevIdx = currentIdx === 0 ? GALLERY_IMAGES.length - 1 : currentIdx - 1;
            setSelectedImage(GALLERY_IMAGES[prevIdx]);
          }}
          className="absolute left-2 md:-left-16 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const currentIdx = GALLERY_IMAGES.findIndex(img => img.id === selectedImage.id);
            const nextIdx = currentIdx === GALLERY_IMAGES.length - 1 ? 0 : currentIdx + 1;
            setSelectedImage(GALLERY_IMAGES[nextIdx]);
          }}
          className="absolute right-2 md:-right-16 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 active:scale-90"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mt-6 max-w-xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-secondary text-white px-3 py-1 rounded-full">
          {selectedImage.category}
        </span>
        <h3 className="font-heading font-bold text-white text-xl sm:text-2xl mt-3">
          {selectedImage.title}
        </h3>
        <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-semibold flex items-center justify-center gap-1.5">
          <MapPin className="w-4 h-4 text-secondary" />
          VEER Operations Hub
        </p>
      </motion.div>
    </motion.div>
  );
}
