"use client";

import { useState, useEffect } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServiceForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setShortDescription(initialData.shortDescription || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status ?? true);
      setImagePreview(initialData.image || '');
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and WEBP formats are supported');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortDescription || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEdit && !imagePreview) {
      toast.error('Please upload a featured image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('shortDescription', shortDescription);
    formData.append('description', description);
    formData.append('status', status.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = isEdit ? `/api/services/${initialData.id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isEdit ? 'Service updated successfully!' : 'Service created successfully!');
        onSubmit(data.service);
      } else {
        toast.error(data.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Form submit error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="title">
              Service Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. International Express Courier"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="shortDescription">
              Short Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief overview displayed on the services listing page..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="description">
              Full Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the service, inclusions, terms, etc..."
              rows={6}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
              required
            />
          </div>
        </div>

        {/* Right Inputs */}
        <div className="space-y-6">
          {/* Status Checkbox */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
              Visibility Status
            </span>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
              <span className="text-sm font-medium text-white/80">
                {status ? 'Active (Visible)' : 'Draft (Hidden)'}
              </span>
            </label>
          </div>

          {/* Image Uploader */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
              Featured Image {!isEdit && <span className="text-red-400">*</span>}
            </span>
            <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-primary/50 transition-colors bg-white/5">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-dark border border-white/5">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-white/40 block truncate max-w-full">
                    {imageFile ? imageFile.name : 'Current Image'}
                  </span>
                </div>
              ) : (
                <label className="cursor-pointer py-6 flex flex-col items-center justify-center gap-2">
                  <div className="p-3 rounded-full bg-white/5 text-white/40">
                    <Upload size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white hover:text-primary transition-colors">
                      Upload featured image
                    </span>
                    <span className="text-[10px] text-white/40 block mt-1">
                      JPG, PNG or WEBP up to 5MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>{isEdit ? 'Save Changes' : 'Create Service'}</span>
        </button>
      </div>
    </form>
  );
}
