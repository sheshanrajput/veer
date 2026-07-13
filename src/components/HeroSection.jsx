"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Star, Play, CheckCircle, Shield, Clock, 
  Sparkles, Home, Search, Globe, Plane, Truck 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <h1 className="text-3xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-dark leading-[1.1] md:leading-[1.1] mb-6 md:mb-8 tracking-tight font-heading">
      Fast. Secure. <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Worldwide Delivery.
      </span>
    </h1>
  );
}

function StatsGroup() {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {STATS.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-full border border-gray-100 shadow-sm"
        >
          <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
          <span className="text-[10px] md:text-xs font-semibold text-dark/80">{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 mb-2 mt-2 w-full sm:w-auto">
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
        <Link href="/inquiry" className="btn-primary w-full sm:w-auto text-center block shadow-lg shadow-secondary/15">
          Book Pickup
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
        <Link href="/services" className="btn-outline w-full sm:w-auto text-center block">
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
      className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 md:p-6 shadow-[0_20px_50px_rgba(0,87,255,0.06)] border border-gray-100 max-w-sm relative overflow-hidden group w-full"
    >
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Globe size={40} className="text-secondary" />
      </div>

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div>
          <h3 className="font-heading font-bold text-dark text-sm md:text-base">Courier Console</h3>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide">Real-time GPS Tracking</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-success bg-success/10 px-3 py-1.5 rounded-full uppercase tracking-tighter">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live Network
        </div>
      </div>

      {/* Mode Selector Thumbnails */}
      <div className="flex gap-2.5 relative z-10 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {SHIPPING_MODES.map((mode, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedMode(i)}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden relative border-2 shadow-sm transition-all cursor-pointer group/img flex-shrink-0 ${
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
      <div className="bg-slate-50 rounded-xl p-3 text-[10px] md:text-xs text-dark/70 leading-relaxed border border-slate-100 flex items-start gap-2.5 relative z-10 mb-2">
        <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
          {selectedMode === 0 && <Plane size={14} className="text-secondary" />}
          {selectedMode === 1 && <Truck size={14} className="text-secondary" />}
          {selectedMode === 2 && <Globe size={14} className="text-secondary" />}
        </div>
        <p>{SHIPPING_MODES[selectedMode].desc}</p>
      </div>

      {/* Live Track Input Form */}
      <form onSubmit={handleTrackSubmit} className="relative z-10 flex flex-col gap-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. VR777...)"
            value={trackNum}
            onChange={(e) => setTrackNum(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-4 pr-12 text-xs md:text-sm text-dark placeholder-dark/40 focus:outline-none focus:border-primary focus:bg-white transition-all font-mono"
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white"
            aria-label="Submit tracking search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-full text-xs md:text-sm shadow-md hover:shadow-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all flex items-center justify-center gap-2"
        >
          Track Shipment
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}

function ReviewCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20, rotate: 5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="absolute top-16 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-100 pointer-events-auto max-w-[220px] hidden lg:block z-30 transform hover:scale-105 transition-transform animate-float-slow"
    >
      <div className="flex gap-1 text-secondary mb-2">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
        <span className="text-dark font-bold text-sm ml-2">4.9</span>
      </div>
      <p className="text-xs text-gray-600 mb-3 font-medium">From 15k+ Happy Shippers</p>
      <div className="flex -space-x-2">
        {[
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        ].map((src, i) => (
          <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-100" alt="Client" />
        ))}
        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold border-2 border-white ring-1 ring-gray-100">+500</div>
      </div>
    </motion.div>
  );
}

function TrustIndicators() {
  return (
    <div className="flex flex-nowrap items-center gap-3 text-xs text-gray-500 py-3 border-t border-gray-200/80 whitespace-nowrap overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span>24/7 Support Desk</span>
      </div>
      <div className="w-px h-3 bg-gray-300 flex-shrink-0" />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
        <span className="font-semibold text-dark">4.9/5</span>
        <span className="text-gray-400">Rating</span>
      </div>
      <div className="w-px h-3 bg-gray-300 flex-shrink-0" />
      <span className="flex items-center gap-1.5 flex-shrink-0">
        <CheckCircle className="w-3.5 h-3.5 text-primary" />
        Free Door Pickup
      </span>
    </div>
  );
}

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [isHovered]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const onDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Previous Slide
      setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Next Slide
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }
  };

  const currentImage = HERO_IMAGES[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative lg:col-span-5 h-full w-full mt-8 lg:mt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slider Container */}
      <div 
        className="relative w-full h-[300px] xs:h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-black/[0.03]"
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
            <img 
              src={currentImage.url} 
              alt={currentImage.title}
              className="w-full h-full object-cover pointer-events-none" // prevent standard image drag
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Image Info */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-8 text-white pointer-events-none"
            >
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1">{currentImage.title}</h3>
              <p className="text-xs sm:text-sm opacity-90 flex items-center gap-2 font-sans font-medium">
                <Globe className="w-4 h-4 text-secondary" />
                {currentImage.location}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Dots */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-20">
          {HERO_IMAGES.map((_, index) => (
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

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Stats Badge */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`stats-${currentIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-100 pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <div className="text-xl font-bold font-heading text-dark leading-none">{currentImage.stats.value}</div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{currentImage.stats.label}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Design Pin */}
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
              className="absolute top-[30%] left-[15%] flex flex-col items-center pointer-events-auto"
            >
              <div className="w-5 h-5 md:w-8 md:h-8 rounded-full border-2 md:border-[3px] border-white/30 bg-white/40 backdrop-blur-md flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white rounded-full shadow-md" />
                <div className="absolute inset-0 border border-white/50 rounded-full animate-ping" />
              </div>
              <div className="mt-1 md:mt-1.5 h-5 md:h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
              <div className="bg-dark/85 backdrop-blur-md border border-white/10 px-2 py-0.5 md:px-3 md:py-1.5 rounded-full text-white text-[7px] md:text-[9px] font-bold uppercase tracking-wider mt-0.5 md:mt-1 shadow-xl whitespace-nowrap">
                {currentImage.feature}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-slate-50/50 overflow-hidden pt-16 pb-8 md:pt-32 md:pb-2 border-b border-black/[0.02]">
      {/* Background Decor Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Background Decor (Subtle Glowing Blobs) */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right - Image Slider (Moved to top on mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 w-full">
            <ImageSlider />
          </div>

          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1 lg:col-span-7 relative z-20"
          >
            <ReviewCard />
            <HeroHeading />
            
            <p className="text-sm md:text-base lg:text-lg text-dark/70 mb-6 md:mb-8 max-w-xl leading-relaxed font-sans">
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
