"use client";

import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to format file sizes
const formatBytes = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Client-side image compressor using canvas
const compressImage = (file, quality = 0.75, maxWidth = 1920) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down dimensions if exceeding max width/height
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve({
                file: compressedFile,
                preview: URL.createObjectURL(compressedFile),
              });
            } else {
              reject(new Error('Canvas compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function GalleryForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  // Compressor stats state
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [shouldCompress, setShouldCompress] = useState(true);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const isVid = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
    
    // Set validation size (limit original image up to 15MB since we will compress it down)
    const maxSize = isVid ? 50 * 1024 * 1024 : 15 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(isVid ? 'Video size must be under 50MB' : 'Image size must be under 15MB');
      return;
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    const isImg = allowedImageTypes.includes(file.type);
    const isVidType = allowedVideoTypes.includes(file.type) || isVid;

    if (!isImg && !isVidType) {
      toast.error('Only JPG, JPEG, PNG, WEBP images and MP4, WEBM, OGG, MOV videos are supported');
      return;
    }

    setOriginalSize(file.size);
    setIsVideo(isVidType);

    if (isImg && shouldCompress) {
      setCompressing(true);
      try {
        const result = await compressImage(file, 0.75, 1920);
        setImageFile(result.file);
        setImagePreview(result.preview);
        setCompressedSize(result.file.size);
        toast.success(`Image compressed: saved ${Math.round((1 - result.file.size / file.size) * 100)}%!`);
      } catch (err) {
        console.error('Image compression failed, using original', err);
        toast.error('Compression failed, using original file');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setCompressedSize(file.size);
      } finally {
        setCompressing(false);
      }
    } else {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCompressedSize(file.size);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !imageFile) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', imageFile);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Media item uploaded successfully!');
        onSubmit(data.image);
      } else {
        toast.error(data.error || 'Failed to upload media item');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">Upload Gallery Item</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="title">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ahmedabad Branch Office"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Category Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="category">
            Category <span className="text-red-400">*</span>
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Offices, Logistics, Team, Videos"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Compression Option Switch (only affects images) */}
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
          <input
            id="shouldCompress"
            type="checkbox"
            checked={shouldCompress}
            onChange={(e) => setShouldCompress(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 text-primary bg-transparent focus:ring-primary focus:ring-opacity-25"
          />
          <label htmlFor="shouldCompress" className="text-xs text-white/80 cursor-pointer select-none">
            Auto-compress images before upload (Saves loading time & storage)
          </label>
        </div>

        {/* Media File */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
            Media File <span className="text-red-400">*</span>
          </span>
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-primary/50 transition-colors bg-white/5">
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative aspect-video max-h-48 mx-auto rounded-xl overflow-hidden bg-dark border border-white/5">
                  {isVideo ? (
                    <video
                      src={imagePreview}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setIsVideo(false);
                      setOriginalSize(0);
                      setCompressedSize(0);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                {/* File Details & Compression Saving Info */}
                <div className="flex flex-col gap-1 text-xs text-white/40 mt-3 px-1 text-left bg-dark/20 p-2.5 rounded-xl border border-white/5">
                  <span className="font-semibold text-white/70 truncate">{imageFile.name}</span>
                  {!isVideo && originalSize > 0 && (
                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <span>Original: {formatBytes(originalSize)}</span>
                      {compressing ? (
                        <span className="text-secondary animate-pulse">Compressing...</span>
                      ) : (
                        <span className="text-green-400 font-bold">
                          Compressed to {formatBytes(compressedSize)} ({Math.round((1 - compressedSize / originalSize) * 100)}% saved)
                        </span>
                      )}
                    </div>
                  )}
                  {isVideo && (
                    <div className="text-[11px] text-white/60 mt-0.5">
                      Video Size: {formatBytes(originalSize)} (Will upload without compression)
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <label className="cursor-pointer py-8 flex flex-col items-center justify-center gap-2">
                <div className="p-3 rounded-full bg-white/5 text-white/40">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white hover:text-primary transition-colors">
                    Upload image or video file
                  </span>
                  <span className="text-[10px] text-white/40 block mt-1">
                    Images up to 15MB, Videos up to 50MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
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
          disabled={loading || compressing}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || compressing || !imageFile}
          className="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>Upload Item</span>
        </button>
      </div>
    </form>
  );
}
