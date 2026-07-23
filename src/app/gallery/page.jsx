"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight, Play, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const isVideoFile = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
};

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  const [columnCount, setColumnCount] = useState(4);

  // Manage responsive column count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setColumnCount(2);
      } else if (window.innerWidth < 768) {
        setColumnCount(3);
      } else if (window.innerWidth < 1024) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = (colsCount) => {
    const activeCols = Math.min(colsCount, images.length || 1);
    const cols = Array.from({ length: activeCols }, () => []);
    images.forEach((item, index) => {
      cols[index % activeCols].push(item);
    });
    return cols;
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch gallery items
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const categoryParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await fetch(`/api/gallery?search=${encodeURIComponent(debouncedSearch)}${categoryParam}&page=${page}&limit=12`);
        const data = await res.json();
        if (res.ok) {
          setImages(data.images || []);
          setCategories(data.categories || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error('Fetch gallery error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [debouncedSearch, selectedCategory, page]);

  return (
    <div className="bg-background min-h-screen pb-24 font-sans">
      {/* Hero Header */}
      <section className="relative overflow-hidden mb-12 py-16 px-6 md:px-8 bg-dark border-b border-white/5">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-4 pt-14">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
            Showcase
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Our Media Gallery
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed">
            Browse through our official warehouse networks, cargo dispatches, team events, and achievement updates.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
        {/* Search & Category filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-black/[0.04] p-4 sm:p-5 shadow-premium">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dark/30">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-dark placeholder-dark/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCategory === ''
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-slate-50 text-dark/60 border-transparent hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-slate-50 text-dark/60 border-transparent hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {loading && images.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-dark/40">
            <Loader2 size={36} className="animate-spin text-primary" />
            <span className="text-sm font-semibold">Loading media assets...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="py-24 text-center text-dark/40 text-sm bg-white rounded-3xl border border-black/[0.04] flex flex-col items-center justify-center gap-2 shadow-sm">
            <p className="font-semibold text-dark/80">No gallery items found</p>
            {debouncedSearch && <p className="text-xs text-dark/40">Try clearing or changing your search criteria.</p>}
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const cols = getColumns(columnCount);
              return (
                <div className={`grid gap-4 justify-center mx-auto ${
                  cols.length === 1 ? 'grid-cols-1 max-w-sm' : 
                  cols.length === 2 ? 'grid-cols-2 max-w-2xl' : 
                  cols.length === 3 ? 'grid-cols-3 max-w-4xl' : 
                  cols.length === 4 ? 'grid-cols-4 max-w-6xl' : 
                  'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full'
                }`}>
                  {cols.map((columnItems, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-4">
                  {columnItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group relative bg-white border border-black/[0.04] rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 cursor-pointer w-full"
                      onClick={() => setPreviewItem(item)}
                    >
                      {isVideoFile(item.image) ? (
                        <div className="w-full relative">
                          <video
                            src={item.image}
                            className="w-full h-auto object-cover max-h-[260px] sm:max-h-[320px]"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                          />
                          {/* Play overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                              <Play size={16} className="fill-current text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-auto object-cover max-h-[260px] sm:max-h-[320px] transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                              <Eye size={18} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Text Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-xs font-bold text-white leading-snug truncate max-w-full">
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-black/[0.04] p-4 rounded-3xl shadow-sm">
                <p className="text-xs text-dark/40 font-medium">
                  Showing <span className="font-semibold text-dark">{images.length}</span> items
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-dark/60 hover:text-primary hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-dark/70 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-dark/60 hover:text-primary hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Media Viewer */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setPreviewItem(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-black/60 border border-white/15 hover:bg-black/80 text-white transition-all duration-300 z-50 active:scale-95 shadow-xl"
              aria-label="Close viewer"
            >
              <X size={24} />
            </button>

            <div
              className="w-full max-w-5xl max-h-[75vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideoFile(previewItem.image) ? (
                <video
                  src={previewItem.image}
                  controls
                  autoPlay
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                />
              ) : (
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                />
              )}
            </div>

            <div className="mt-6 text-center space-y-2 pointer-events-none" onClick={(e) => e.stopPropagation()}>
              <span className="px-3.5 py-1.5 bg-white/5 rounded-full text-xs font-bold text-secondary uppercase tracking-widest border border-white/5 inline-block">
                {previewItem.category}
              </span>
              <h3 className="text-xl font-bold text-white max-w-xl px-4">{previewItem.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
