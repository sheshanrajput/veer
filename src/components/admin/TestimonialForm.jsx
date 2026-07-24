"use client";

import { useState, useEffect } from 'react';
import { Loader2, Upload, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialForm({ testimonial, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  // If editing, load current data
  useEffect(() => {
    if (testimonial) {
      setName(testimonial.name || '');
      setRole(testimonial.role || '');
      setQuote(testimonial.quote || '');
      setRating(testimonial.rating || 5);
      setImagePreview(testimonial.image || '');
    }
  }, [testimonial]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and WEBP images are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !quote) {
      toast.error('Name, role, and testimonial quote are required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('quote', quote);
    formData.append('rating', rating.toString());
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imagePreview) {
      formData.append('image', imagePreview); // keep the old image url
    }

    try {
      const url = testimonial ? `/api/testimonials/${testimonial.id}` : '/api/testimonials';
      const method = testimonial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(testimonial ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
        onSubmit(data.testimonial);
      } else {
        toast.error(data.error || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Testimonial save error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">
          {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="name">
            Author Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rajesh Patel"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Role Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="role">
            Role / Designation <span className="text-red-400">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Founder, Patel Exports Ltd."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Rating Star Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
            Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-white/20 hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-accent fill-accent'
                      : 'text-white/20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quote Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="quote">
            Testimonial / Quote <span className="text-red-400">*</span>
          </label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Write what the customer said about your service..."
            rows={4}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm resize-none"
            required
          />
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
            Author Photo (Optional)
          </span>
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-primary/50 transition-colors bg-white/5">
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-dark border border-white/5">
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
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white/80 hover:text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-xs text-white/40 truncate max-w-xs mx-auto">
                  {imageFile ? imageFile.name : 'Current Image'}
                </div>
              </div>
            ) : (
              <label className="cursor-pointer py-4 flex flex-col items-center justify-center gap-2">
                <div className="p-2 rounded-full bg-white/5 text-white/40">
                  <Upload size={18} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white hover:text-primary transition-colors">
                    Upload photo
                  </span>
                  <span className="text-[10px] text-white/40 block mt-0.5">
                    JPG, PNG, or WEBP up to 5MB (Default avatar used if blank)
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
          className="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>{testimonial ? 'Update' : 'Add Testimonial'}</span>
        </button>
      </div>
    </form>
  );
}
