"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Loader2, ChevronLeft, ChevronRight, AlertTriangle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import TestimonialForm from '@/components/admin/TestimonialForm';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
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

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/testimonials?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=8`);
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        toast.error(data.error || 'Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Fetch testimonials error:', error);
      toast.error('An error occurred while fetching testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [debouncedSearch, page]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Testimonial deleted successfully');
        setDeleteId(null);
        fetchTestimonials();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Delete testimonial error:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleting(false);
    }
  };

  // Open Add Modal
  const handleAddClick = () => {
    setEditingTestimonial(null);
    setFormOpen(true);
  };

  // Open Edit Modal
  const handleEditClick = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Testimonials</h1>
          <p className="text-white/40 text-sm mt-1">Manage client and shipper quotes displayed on the website.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-secondary/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Testimonial</span>
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
            placeholder="Search by name, role, quote..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Testimonials List */}
      {loading && testimonials.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
          <Loader2 size={32} className="animate-spin text-secondary" />
          <span className="text-sm font-medium">Loading testimonials...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-20 text-center text-white/30 text-sm bg-dark-light border border-white/5 rounded-card flex flex-col items-center justify-center gap-2">
          <p>No testimonials found.</p>
          {debouncedSearch && <p className="text-xs text-white/20">Try clearing or changing your search term.</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="group relative bg-dark-light border border-white/5 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    {/* Stars */}
                    <div className="flex gap-0.5 text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < item.rating ? 'fill-accent text-accent' : 'text-white/10'}
                        />
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all border border-white/5"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/5"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <p className="text-white/80 text-sm leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={item.image || '/images/user-avatar.svg'}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 bg-dark"
                    onError={(e) => { e.target.src = '/images/user-avatar.svg'; }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-white/40 text-xs">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
              <p className="text-xs text-white/40">
                Showing <span className="font-semibold text-white">{testimonials.length}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> testimonials
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
          <div className="w-full max-w-xl bg-dark-light border border-white/5 rounded-card p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <TestimonialForm
              testimonial={editingTestimonial}
              onCancel={() => setFormOpen(false)}
              onSubmit={() => {
                setFormOpen(false);
                fetchTestimonials();
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
              <h3 className="text-lg font-bold text-white">Delete Testimonial?</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Are you sure you want to permanently delete this testimonial? This action will remove it from the home page slider and cannot be undone.
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
