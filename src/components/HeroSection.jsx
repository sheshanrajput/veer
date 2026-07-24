"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Star, Play, CheckCircle, Shield, Clock, 
  Sparkles, Home, Search, Globe, Plane, Truck 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const isVideoUrl = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
};

// --- Data & Config ---
const STATS = [
  { icon: CheckCircle, text: "220+ Countries Served", color: "text-secondary" },
  { icon: Shield, text: "99.8% On-Time Delivery", color: "text-secondary" },
];

const SHIPPING_MODES = [
  {
    name: "Air Express",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop&q=80",
    desc: "Next flight out priority service. Deliveries in 3-5 business days."
  },
  {
    name: "Door Pickup",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=100&h=100&fit=crop&q=80",
    desc: "Free doorstep pickup in Ahmedabad. Secure weighing & bagging."
  },
  {
    name: "Sea Cargo",
    img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=100&h=100&fit=crop&q=80",
    desc: "Affordable global ocean container shipping for commercial freight."
  }
];

// Image slider data for Logistics
const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop",
    title: "Priority Air Cargo",
    location: "Ahmedabad Airport Cargo Hub",
    stats: { value: "3-5 Days", label: "Worldwide Transit" },
    feature: "Express Custom Clearance"
  },
  {
    url: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2000&auto=format&fit=crop",
    title: "Global Supply Chain",
    location: "Commercial Sea Freights",
    stats: { value: "220+", label: "Countries Connected" },
    feature: "Door-to-Door Logistics"
  },
  {
    url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2000&auto=format&fit=crop",
    title: "Secure Last-Mile Delivery",
    location: "Express Logistics Network",
    stats: { value: "99.8%", label: "Delivery Success Rate" },
    feature: "FDA & Document Clearing"
  },
  {
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop",
    title: "Reliable Air Express",
    location: "Scheduled Cargo Flights",
    stats: { value: "24/7", label: "Hotline Support" },
    feature: "Transit Insurance Cover"
  }
];

// --- Sub-Components ---



function HeroHeading() {
  return (
    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-dark leading-[1.1] mb-4 md:mb-5 tracking-tight font-heading">
      Fast. Secure. <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Worldwide Delivery.
      </span>
    </h1>
  );
}

function StatsGroup() {
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {STATS.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-gray-100 shadow-sm"
        >
          <item.icon className={`w-3 h-3 ${item.color}`} />
          <span className="text-[9px] md:text-xs font-semibold text-dark/80">{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:gap-3 mb-2 mt-2 w-full sm:w-auto">
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
        <Link href="/contact" className="btn-primary px-4 py-2 w-full sm:w-auto text-center block shadow-lg shadow-secondary/15 text-xs md:text-sm">
          Book Pickup
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
        <Link href="/services" className="btn-outline px-4 py-2 w-full sm:w-auto text-center block text-xs md:text-sm">
          Our Services
        </Link>
      </motion.div>
    </div>
  );
}

function TrackingCard() {
  const [trackNum, setTrackNum] = useState("");
  const [selectedMode, setSelectedMode] = useState(0);
  const router = useRouter();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackNum.trim()) {
      router.push(`/tracking?num=${trackNum.trim()}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 md:p-4.5 shadow-[0_15px_40px_rgba(0,87,255,0.05)] border border-gray-100 max-w-sm relative overflow-hidden group w-full"
    >
      <div className="absolute top-0 right-0 p-2.5 opacity-5 group-hover:opacity-10 transition-opacity">
        <Globe size={32} className="text-secondary" />
      </div>

      <div className="flex justify-between items-center mb-3 relative z-10">
        <div>
          <h3 className="font-heading font-bold text-dark text-xs md:text-sm">Courier Console</h3>
          <p className="text-[9px] text-gray-400 font-medium tracking-wide">Real-time GPS Tracking</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-2 py-1 rounded-full uppercase tracking-tighter">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live Network
        </div>
      </div>

      {/* Mode Selector Thumbnails */}
      <div className="flex gap-2 relative z-10 mb-3 overflow-x-auto pb-1 scrollbar-none">
        {SHIPPING_MODES.map((mode, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedMode(i)}
            className={`w-11 h-11 md:w-13 md:h-13 rounded-xl overflow-hidden relative border-2 shadow-sm transition-all cursor-pointer group/img flex-shrink-0 ${
              selectedMode === i ? "border-secondary scale-105" : "border-transparent hover:border-secondary/40"
            }`}
          >
            <img src={mode.img} alt={mode.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white text-center px-1 leading-none">{mode.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mode description text */}
      <div className="bg-slate-50 rounded-xl p-2.5 text-[9px] md:text-xs text-dark/70 leading-relaxed border border-slate-100 flex items-start gap-2 relative z-10 mb-2">
        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
          {selectedMode === 0 && <Plane size={12} className="text-secondary" />}
          {selectedMode === 1 && <Truck size={12} className="text-secondary" />}
          {selectedMode === 2 && <Globe size={12} className="text-secondary" />}
        </div>
        <p>{SHIPPING_MODES[selectedMode].desc}</p>
      </div>

      {/* Live Track Input Form */}
      <form onSubmit={handleTrackSubmit} className="relative z-10 flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. VR777...)"
            value={trackNum}
            onChange={(e) => setTrackNum(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-3 pr-10 text-xs text-dark placeholder-dark/40 focus:outline-none focus:border-primary focus:bg-white transition-all font-mono"
            required
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white"
            aria-label="Submit tracking search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          type="submit"
          className="w-full h-9 rounded-full text-xs shadow-md hover:shadow-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all flex items-center justify-center gap-1.5"
        >
          Track Shipment
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}



function TrustIndicators() {
  return (
    <div className="flex flex-nowrap items-center gap-2.5 text-[10px] md:text-xs text-gray-500 py-2 border-t border-gray-200/80 whitespace-nowrap overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1 flex-shrink-0">
        <Clock className="w-3 h-3 text-primary" />
        <span>24/7 Support</span>
      </div>
      <div className="w-px h-2.5 bg-gray-300 flex-shrink-0" />
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="w-3 h-3 fill-secondary text-secondary" />
        <span className="font-semibold text-dark">4.9/5</span>
        <span className="text-gray-400">Rating</span>
      </div>
      <div className="w-px h-2.5 bg-gray-300 flex-shrink-0" />
      <span className="flex items-center gap-1 flex-shrink-0">
        <CheckCircle className="w-3 h-3 text-primary" />
        Free Pickup
      </span>
    </div>
  );
}

function ImageSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const onDragEnd = (event, info) => {
    if (slides.length <= 1) return;
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Previous Slide
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Next Slide
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }
  };

  const currentImage = slides[currentIndex] || slides[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative lg:col-span-5 h-full w-full mt-4 lg:mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slider Container */}
      <div 
        className="relative w-full h-[220px] xs:h-[260px] md:h-[360px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-black/[0.03]"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={onDragEnd}
            className="absolute inset-0"
          >
            {currentImage && isVideoUrl(currentImage.url) ? (
              <video 
                src={currentImage.url} 
                className="w-full h-full object-cover pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              currentImage && (
                <img 
                  src={currentImage.url} 
                  alt={currentImage.title}
                  className="w-full h-full object-cover pointer-events-none" // prevent standard image drag
                />
              )
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Image Info */}
            {currentImage && (currentImage.title || currentImage.location) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 left-8 text-white pointer-events-none animate-in fade-in"
              >
                {currentImage.title && <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1">{currentImage.title}</h3>}
                {currentImage.location && (
                  <p className="text-xs sm:text-sm opacity-90 flex items-center gap-2 font-sans font-medium">
                    <Globe className="w-4 h-4 text-secondary" />
                    {currentImage.location}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slider Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full ${
                  currentIndex === index 
                    ? "w-8 h-2 bg-white" 
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Stats Badge */}
          {/* Stats Badge */}
          {currentImage && (currentImage.stats?.value || currentImage.statsValue) && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={`stats-${currentIndex}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg border border-gray-100 pointer-events-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <div className="text-base font-bold font-heading text-dark leading-none">
                      {currentImage?.stats?.value || currentImage?.statsValue}
                    </div>
                    {(currentImage?.stats?.label || currentImage?.statsLabel) && (
                      <div className="text-[8px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                        {currentImage?.stats?.label || currentImage?.statsLabel}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Design Pin */}
          {currentImage && currentImage.feature && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={`pin-${currentIndex}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -10, 0]
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  opacity: { delay: 0.3, duration: 0.4 },
                  scale: { delay: 0.3, type: "spring" },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute top-[25%] left-[12%] flex flex-col items-center pointer-events-auto"
              >
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 md:border-[3px] border-white/30 bg-white/40 backdrop-blur-md flex items-center justify-center relative">
                  <div className="w-1 h-1 md:w-2 md:h-2 bg-white rounded-full shadow-md" />
                  <div className="absolute inset-0 border border-white/50 rounded-full animate-ping" />
                </div>
                <div className="mt-1 h-4 md:h-6 w-px bg-gradient-to-b from-white/70 to-transparent" />
                <div className="bg-dark/85 backdrop-blur-md border border-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-white text-[6px] md:text-[8px] font-bold uppercase tracking-wider mt-0.5 shadow-xl whitespace-nowrap">
                  {currentImage.feature}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export default function HeroSection({ slides = [] }) {
  const activeSlides = slides && slides.length > 0 ? slides : HERO_IMAGES;

  return (
    <section className="relative min-h-screen flex items-center bg-slate-50/50 overflow-hidden pt-24 pb-12 border-b border-black/[0.02]">
      {/* Background Decor Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Background Decor (Subtle Glowing Blobs) */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right - Image Slider (Moved to top on mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 w-full">
            <ImageSlider slides={activeSlides} />
          </div>

          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1 lg:col-span-7 relative z-20"
          >
            <HeroHeading />
            
            <p className="text-xs md:text-sm lg:text-base text-dark/70 mb-4 md:mb-6 max-w-xl leading-relaxed font-sans">
              Your trusted international courier and cargo partner based in Ahmedabad, 
              delivering parcels across the globe with unmatched speed, safety, and absolute reliability.
            </p>

            {/* Mobile Layout */}
            <div className="flex flex-col lg:hidden gap-2">
              <StatsGroup />
              <ActionButtons />
              <div className="scale-95 origin-top-left w-full">
                <TrackingCard />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
              <div className="col-span-6">
                <TrackingCard />
              </div>
              <div className="col-span-6 flex flex-col pt-3">
                <StatsGroup />
                <ActionButtons />
                <TrustIndicators />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
