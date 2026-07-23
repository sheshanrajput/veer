"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Loader2, ChevronLeft, ChevronRight, AlertTriangle, Eye, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import GalleryForm from '@/components/admin/GalleryForm';

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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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

  // Fetch Gallery Images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      const res = await fetch(`/api/gallery?search=${encodeURIComponent(debouncedSearch)}${categoryParam}&page=${page}&limit=12`);
      const data = await res.json();
      if (res.ok) {
        setImages(data.images || []);
        setCategories(data.categories || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        toast.error(data.error || 'Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Fetch gallery error:', error);
      toast.error('An error occurred while fetching gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [debouncedSearch, selectedCategory, page]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Image deleted successfully');
        setDeleteId(null);
        fetchImages();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete gallery error:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gallery</h1>
          <p className="text-white/40 text-sm mt-1">Upload and manage image or video assets for your site.</p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-secondary/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Upload Item</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/30">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory('');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedCategory === ''
                ? 'bg-primary/10 text-white border-primary/20'
                : 'bg-white/5 text-white/55 border-transparent hover:bg-white/10'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-primary/10 text-white border-primary/20'
                  : 'bg-white/5 text-white/55 border-transparent hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      {loading && images.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
          <Loader2 size={32} className="animate-spin text-secondary" />
          <span className="text-sm font-medium">Loading gallery...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center text-white/30 text-sm bg-dark-light border border-white/5 rounded-card flex flex-col items-center justify-center gap-2">
          <p>No gallery images found.</p>
          {debouncedSearch && <p className="text-xs text-white/20">Try clearing or changing your search term.</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {images.map((item) => (
              <div
                key={item.id}
                className="group relative bg-dark-light border border-white/5 rounded-2xl overflow-hidden shadow-premium aspect-square hover:shadow-premium-hover transition-all duration-300"
              >
                {isVideoFile(item.image) ? (
                  <div className="w-full h-full relative">
                    <video
                      src={item.image}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-colors pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                        <Play size={18} className="fill-current text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Overlays / Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-full mb-3" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewImage(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/5"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/10"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
              <p className="text-xs text-white/40">
                Showing <span className="font-semibold text-white">{images.length}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> images
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

      {/* Upload Form Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-dark-light border border-white/5 rounded-card p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <GalleryForm
              onCancel={() => setUploadOpen(false)}
              onSubmit={() => {
                setUploadOpen(false);
                fetchImages();
              }}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[80vh] flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoFile(previewImage.image) ? (
              <video
                src={previewImage.image}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/5"
              />
            ) : (
              <img
                src={previewImage.image}
                alt={previewImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/5"
              />
            )}
          </div>
          <div className="mt-4 text-center space-y-1" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">{previewImage.title}</h3>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-secondary uppercase tracking-widest border border-white/5 inline-block">
              {previewImage.category}
            </span>
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
              <h3 className="text-lg font-bold text-white">Delete Image?</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Are you sure you want to permanently delete this image from the gallery? This action is irreversible and will remove it from the website.
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
