"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X, MapPin, Maximize2, Loader2, Video } from "lucide-react";
import Link from "next/link";

const DEFAULT_GALLERY = [
  {
    id: "default-1",
    title: "Air Cargo Loading Operations",
    category: "Air Fleet",
    image: "https://assets.mixkit.co/videos/preview/mixkit-cargo-plane-unloading-at-the-airport-40030-large.mp4"
  },
  {
    id: "default-2",
    title: "Seaport Container Logistics",
    category: "Ocean Cargo",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "default-3",
    title: "Automated Package Sorting",
    category: "Packaging",
    image: "https://assets.mixkit.co/videos/preview/mixkit-worker-scanning-boxes-in-a-warehouse-40019-large.mp4"
  },
  {
    id: "default-4",
    title: "Express Road Carrier Fleet",
    category: "Transit Route",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "default-5",
    title: "Global Ocean Freight Carrier",
    category: "Ocean Freight",
    image: "https://assets.mixkit.co/videos/preview/mixkit-large-cargo-container-ship-sailing-in-the-sea-40035-large.mp4"
  },
  {
    id: "default-6",
    title: "Distribution Center Sorting Hub",
    category: "Storage",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "default-7",
    title: "Express Air Freight Flight Cargo",
    category: "Air Fleet",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "default-8",
    title: "Global Supply Chain Operations",
    category: "Operations Desk",
    image: "https://images.unsplash.com/photo-1521791136368-1a8682707636?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "default-9",
    title: "Secure Warehouse Sorting Lines",
    category: "Packaging",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80"
  }
];

const isVideoFile = (url) => {
  if (!url) return false;
  if (url.includes('mixkit.co') || url.includes('video')) return true;
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
};

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery?page=1&limit=9");
        const data = await res.json();
        if (data.success && data.images && data.images.length > 0) {
          let combined = [...data.images];
          if (combined.length < 9) {
            const needed = 9 - combined.length;
            combined = [...combined, ...DEFAULT_GALLERY.slice(0, needed)];
          }
          setItems(combined.slice(0, 9));
        } else {
          setItems(DEFAULT_GALLERY);
        }
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setItems(DEFAULT_GALLERY);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const getColumns = (colsCount) => {
    const cols = Array.from({ length: colsCount }, () => []);
    items.forEach((item, index) => {
      cols[index % colsCount].push({ item, index });
    });
    return cols;
  };

  return (
    <section className="py-20 bg-slate-50/30 border-t border-black/[0.02] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl text-left">
            
            <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl text-dark tracking-tight leading-none">
              VEER Logistics in Action
            </h2>
            <p className="text-dark/60 text-sm md:text-base mt-4 leading-relaxed">
              Explore live snapshots of our logistics operations. Witness our trans-continental air cargo routing, high-capacity container vessels, and automated warehouse sorting centers.
            </p>
          </div>
          
          
        </div>

        {/* Bento Grid / Masonry Collage */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-dark/40">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-sm font-semibold">Loading media collage...</span>
          </div>
        ) : (
          <div className="relative mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {getColumns(columnCount).map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-4">
                  {col.map(({ item, index }) => {
                    const isVideo = isVideoFile(item.image);
                    const isBlurred = index >= 6; // 7th, 8th, 9th elements are blurred
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: colIdx * 0.1 }}
                        onClick={() => {
                          if (!isBlurred) {
                            setSelectedItem(item);
                          }
                        }}
                        className={`group relative overflow-hidden rounded-[20px] border border-black/[0.04] bg-neutral-900 shadow-premium transition-all duration-500 ${
                          isBlurred 
                            ? "opacity-35 blur-[5px] select-none pointer-events-none" 
                            : "hover:shadow-premium-hover cursor-pointer"
                        }`}
                      >
                        {/* Media Content */}
                        {isVideo ? (
                          <div className="w-full aspect-video sm:aspect-square relative overflow-hidden flex items-center justify-center bg-black">
                            {/* Blurred background backup */}
                            <video
                              src={item.image}
                              className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 pointer-events-none"
                              muted
                              loop
                              autoPlay
                              playsInline
                            />
                            {/* Main full video */}
                            <video
                              src={item.image}
                              className="relative z-10 max-w-full max-h-full object-contain"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            />
                            {/* Floating Play Indicator */}
                            {!isBlurred && (
                              <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                                <Play size={12} className="fill-current text-white ml-0.5" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-auto relative overflow-hidden flex items-center justify-center bg-black">
                            {/* Blurred background backup */}
                            <img
                              src={item.image}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 pointer-events-none"
                            />
                            {/* Main full image */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="relative z-10 w-full h-auto max-h-[280px] sm:max-h-[340px] object-contain transition-transform duration-700 ease-out group-hover:scale-102"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Dark Elegant Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent transition-opacity duration-300" />

                        {/* Text Details Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 z-10 text-left transform transition-transform duration-300 group-hover:-translate-y-1">
                          <span className="text-[7px] md:text-[9px] text-secondary uppercase tracking-widest block mb-1">
                            {item.category || "Transit Operations"}
                          </span>
                          <h3 className="font-heading font-extrabold text-white text-xs md:text-sm leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-white/60 text-[9px] md:text-[10px] font-medium items-center gap-1 mt-1.5 hidden sm:flex">
                            <MapPin className="w-2.5 h-2.5 text-secondary" />
                            VEER Operations
                          </p>
                        </div>

                        {/* Hover Magnify Overlay */}
                        {!isBlurred && (
                          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 w-10 h-10">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Blurred Fade-out Bottom Overlay with see more button */}
            <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-10 pointer-events-auto z-20">
              <Link
                href="/gallery"
                className="group btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 text-sm font-bold hover:scale-105 transition-transform"
              >
                Explore Full Gallery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 z-50 active:scale-95 shadow-xl"
              aria-label="Close media viewer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Content Stage */}
            <div
              className="w-full max-w-5xl max-h-[70vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideoFile(selectedItem.image) ? (
                <video
                  src={selectedItem.image}
                  controls
                  autoPlay
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                />
              ) : (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                />
              )}

              {/* Prev / Next buttons inside lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = items.findIndex(img => img.id === selectedItem.id);
                  const prevIdx = currentIdx === 0 ? items.length - 1 : currentIdx - 1;
                  setSelectedItem(items[prevIdx]);
                }}
                className="absolute left-2 md:-left-16 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 active:scale-90"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = items.findIndex(img => img.id === selectedItem.id);
                  const nextIdx = currentIdx === items.length - 1 ? 0 : currentIdx + 1;
                  setSelectedItem(items[nextIdx]);
                }}
                className="absolute right-2 md:-right-16 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 active:scale-90"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Info details under stage */}
            <div 
              className="mt-6 text-center space-y-2 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="px-3.5 py-1.5 bg-white/5 rounded-full text-xs font-bold text-secondary uppercase tracking-widest border border-white/5 inline-block">
                {selectedItem.category || "Transit Operations"}
              </span>
              <h3 className="text-xl font-bold text-white max-w-xl px-4">
                {selectedItem.title}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 font-semibold flex items-center justify-center gap-1.5">
                <MapPin className="w-4 h-4 text-secondary" />
                Ahmedabad Airport Hub
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
