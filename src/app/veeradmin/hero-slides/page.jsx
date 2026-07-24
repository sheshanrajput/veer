"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Loader2, ChevronLeft, ChevronRight, AlertTriangle, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import HeroSlideForm from '@/components/admin/HeroSlideForm';

export default function HeroSlidesAdminPage() {
  const [slides, setSlides] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Hero Slides
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hero-slides?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=6`);
      const data = await res.json();
      if (res.ok) {
        setSlides(data.slides || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        toast.error(data.error || 'Failed to fetch hero slides');
      }
    } catch (error) {
      console.error('Fetch slides error:', error);
      toast.error('An error occurred while fetching slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [debouncedSearch, page]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/hero-slides/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Hero slide deleted successfully');
        setDeleteId(null);
        fetchSlides();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete hero slide');
      }
    } catch (error) {
      console.error('Delete slide error:', error);
      toast.error('Failed to delete hero slide');
    } finally {
      setDeleting(false);
    }
  };

  // Open Add Modal
  const handleAddClick = () => {
    setEditingSlide(null);
    setFormOpen(true);
  };

  // Open Edit Modal
  const handleEditClick = (slide) => {
    setEditingSlide(slide);
    setFormOpen(true);
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Hero Image/Video Slider</h1>
          <p className="text-white/40 text-sm mt-1">Manage slides, auto-playing background videos, stats, and text badges on your homepage hero section.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-secondary/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4 bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/30">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slides by title or subtext..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Slides List (Grid View) */}
      {loading && slides.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
          <Loader2 size={32} className="animate-spin text-secondary" />
          <span className="text-sm font-medium">Loading slides...</span>
        </div>
      ) : slides.length === 0 ? (
        <div className="py-20 text-center text-white/30 text-sm bg-dark-light border border-white/5 rounded-card flex flex-col items-center justify-center gap-2">
          <p>No slides found.</p>
          {debouncedSearch && <p className="text-xs text-white/20">Try clearing or changing your search term.</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="group relative bg-dark-light border border-white/5 rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col"
              >
                {/* Media Container */}
                <div className="relative w-full h-[180px] bg-black overflow-hidden flex items-center justify-center">
                  {isVideoUrl(slide.url) ? (
                    <video 
                      src={slide.url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img 
                      src={slide.url} 
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEditClick(slide)}
                      className="p-2 bg-black/60 hover:bg-white text-white hover:text-black rounded-xl transition-all backdrop-blur-xs border border-white/10"
                      title="Edit Slide"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(slide.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all backdrop-blur-xs border border-red-500/10"
                      title="Delete Slide"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Feature tag overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded-full text-white text-[9px] font-bold uppercase tracking-wider">
                    {slide.feature}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1">{slide.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                      <Globe size={12} className="text-secondary" />
                      <span className="line-clamp-1">{slide.location}</span>
                    </div>
                  </div>

                  {/* Stats display */}
                  <div className="bg-white/5 rounded-xl p-2.5 flex items-center gap-3 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-none">{slide.statsValue}</div>
                      <div className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{slide.statsLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
              <p className="text-xs text-white/40">
                Showing <span className="font-semibold text-white">{slides.length}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> slides
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold text-white/80 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-dark-light border border-white/5 rounded-card p-6 md:p-8 max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <HeroSlideForm
              slide={editingSlide}
              onCancel={() => setFormOpen(false)}
              onSubmit={() => {
                setFormOpen(false);
                fetchSlides();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-dark-lighter border border-white/5 rounded-card-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-xl bg-red-500/10">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Slide?</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Are you sure you want to permanently delete this hero slide? This action will remove it from the home page background slider and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
