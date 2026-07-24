"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Loader2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import FAQForm from '@/components/admin/FAQForm';

export default function FAQsAdminPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
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

  // Fetch FAQs
  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/faqs?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=8`);
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        toast.error(data.error || 'Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Fetch FAQs error:', error);
      toast.error('An error occurred while fetching FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [debouncedSearch, page]);

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/faqs/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('FAQ deleted successfully');
        setDeleteId(null);
        fetchFAQs();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Delete FAQ error:', error);
      toast.error('Failed to delete FAQ');
    } finally {
      setDeleting(false);
    }
  };

  // Open Add Modal
  const handleAddClick = () => {
    setEditingFAQ(null);
    setFormOpen(true);
  };

  // Open Edit Modal
  const handleEditClick = (faq) => {
    setEditingFAQ(faq);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
          <p className="text-white/40 text-sm mt-1">Manage FAQs displayed in the Accordion section of your homepage.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-secondary/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add FAQ</span>
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
            placeholder="Search by question or answer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* FAQs List */}
      {loading && faqs.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
          <Loader2 size={32} className="animate-spin text-secondary" />
          <span className="text-sm font-medium">Loading FAQs...</span>
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-20 text-center text-white/30 text-sm bg-dark-light border border-white/5 rounded-card flex flex-col items-center justify-center gap-2">
          <p>No FAQs found.</p>
          {debouncedSearch && <p className="text-xs text-white/20">Try clearing or changing your search term.</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="group relative bg-dark-light border border-white/5 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-base md:text-lg text-white pr-10">
                    {faq.question}
                  </h3>
                  {/* Actions */}
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(faq)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all border border-white/5"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(faq.id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/5"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Answer */}
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line max-w-4xl">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
              <p className="text-xs text-white/40">
                Showing <span className="font-semibold text-white">{faqs.length}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> FAQs
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
            <FAQForm
              faq={editingFAQ}
              onCancel={() => setFormOpen(false)}
              onSubmit={() => {
                setFormOpen(false);
                fetchFAQs();
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
              <h3 className="text-lg font-bold text-white">Delete FAQ?</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Are you sure you want to permanently delete this FAQ? This action will remove it from the home page FAQ section and cannot be undone.
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
