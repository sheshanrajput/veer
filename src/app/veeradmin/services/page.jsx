"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ServiceForm from '@/components/admin/ServiceForm';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=8`);
      const data = await res.json();
      if (res.ok) {
        setServices(data.services || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
      } else {
        toast.error(data.error || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Fetch services error:', error);
      toast.error('An error occurred while fetching services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [debouncedSearch, page]);

  // Handle Toggle Status
  const handleToggleStatus = async (id, currentStatus) => {
    const originalServices = [...services];
    // Optimistic UI update
    setServices(services.map(s => s.id === id ? { ...s, status: !currentStatus } : s));

    try {
      const formData = new FormData();
      formData.append('status', (!currentStatus).toString());

      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to update status');
        setServices(originalServices);
      } else {
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update status');
      setServices(originalServices);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Service deleted successfully');
        setDeleteId(null);
        fetchServices();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Delete service error:', error);
      toast.error('Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Services</h1>
          <p className="text-white/40 text-sm mt-1">Manage the services displayed on your website.</p>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-dark-light border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/30">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-dark-light border border-white/5 rounded-card shadow-2xl overflow-hidden">
        {loading && services.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/40">
            <Loader2 size={32} className="animate-spin text-primary" />
            <span className="text-sm font-medium">Loading services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-white/30 text-sm flex flex-col items-center justify-center gap-2">
            <p>No services found.</p>
            {debouncedSearch && <p className="text-xs text-white/20">Try clearing or changing your search term.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4 hidden md:table-cell">Slug</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 relative flex-shrink-0">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <FileText size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{service.title}</h4>
                          <p className="text-xs text-white/40 line-clamp-1 mt-0.5 max-w-[200px] sm:max-w-[320px]">
                            {service.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 hidden md:table-cell text-white/50 font-mono text-xs">
                      {service.slug}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(service.id, service.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          service.status
                            ? 'bg-success/15 text-success border border-success/20 hover:bg-success/25'
                            : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {service.status ? (
                          <>
                            <Eye size={12} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditData(service);
                            setFormOpen(true);
                          }}
                          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <p className="text-xs text-white/40">
              Showing <span className="font-semibold text-white">{services.length}</span> of{' '}
              <span className="font-semibold text-white">{totalItems}</span> services
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-white/80 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Service Form Overlay */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-dark-light border border-white/5 rounded-card p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <ServiceForm
              initialData={editData}
              onCancel={() => setFormOpen(false)}
              onSubmit={() => {
                setFormOpen(false);
                fetchServices();
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
              <h3 className="text-lg font-bold text-white">Delete Service?</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Are you sure you want to permanently delete this service? This action is irreversible and will remove it from the website.
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
