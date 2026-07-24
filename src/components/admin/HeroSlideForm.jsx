"use client";

import { useState, useEffect } from 'react';
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

export default function HeroSlideForm({ slide, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [statsValue, setStatsValue] = useState('');
  const [statsLabel, setStatsLabel] = useState('');
  const [feature, setFeature] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  // Compressor stats state
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [shouldCompress, setShouldCompress] = useState(true);

  // If editing, load current data
  useEffect(() => {
    if (slide) {
      setTitle(slide.title || '');
      setLocation(slide.location || '');
      setStatsValue(slide.statsValue || '');
      setStatsLabel(slide.statsLabel || '');
      setFeature(slide.feature || '');
      setMediaPreview(slide.url || '');
      
      const ext = (slide.url || '').split('.').pop().toLowerCase();
      setIsVideo(['mp4', 'webm', 'ogg', 'mov'].includes(ext));
    }
  }, [slide]);

  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const isVid = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
    
    // Set validation size (limit original image up to 15MB, video up to 50MB)
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
        setMediaFile(result.file);
        setMediaPreview(result.preview);
        setCompressedSize(result.file.size);
        toast.success(`Image compressed: saved ${Math.round((1 - result.file.size / file.size) * 100)}%!`);
      } catch (err) {
        console.error('Image compression failed, using original', err);
        toast.error('Compression failed, using original file');
        setMediaFile(file);
        setMediaPreview(URL.createObjectURL(file));
        setCompressedSize(file.size);
      } finally {
        setCompressing(false);
      }
    } else {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setCompressedSize(file.size);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slide && !mediaFile) {
      toast.error('Please upload a media file (image or video)');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('statsValue', statsValue);
    formData.append('statsLabel', statsLabel);
    formData.append('feature', feature);
    
    if (mediaFile) {
      formData.append('image', mediaFile);
    } else if (slide) {
      formData.append('image', slide.url);
    }

    try {
      const url = slide ? `/api/hero-slides/${slide.id}` : '/api/hero-slides';
      const method = slide ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(slide ? 'Hero slide updated successfully!' : 'Hero slide created successfully!');
        onSubmit(data.slide);
      } else {
        toast.error(data.error || 'Failed to save hero slide');
      }
    } catch (error) {
      console.error('Hero slide save error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">
          {slide ? 'Edit Hero Slide' : 'Add Hero Slide'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="title">
              Slide Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Priority Air Cargo"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            />
          </div>

          {/* Location Subtext */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="location">
              Subtext / Location (Globe icon tag)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ahmedabad Airport Cargo Hub"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            />
          </div>

          {/* Stats Group (Value & Label) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="statsValue">
                Stat Value
              </label>
              <input
                id="statsValue"
                type="text"
                value={statsValue}
                onChange={(e) => setStatsValue(e.target.value)}
                placeholder="e.g. 3-5 Days or 99.8%"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="statsLabel">
                Stat Label
              </label>
              <input
                id="statsLabel"
                type="text"
                value={statsLabel}
                onChange={(e) => setStatsLabel(e.target.value)}
                placeholder="e.g. Worldwide Transit"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Floating Feature Badge */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block" htmlFor="feature">
              Floating Feature Badge
            </label>
            <input
              id="feature"
              type="text"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              placeholder="e.g. FDA & Document Clearing"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Media Upload Side */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">
            Media File (Image or Video) <span className="text-red-400">*</span>
          </label>
          
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px] bg-white/5 hover:bg-white/[0.07] transition-colors group">
            {mediaPreview ? (
              <div className="relative w-full h-full min-h-[190px] flex items-center justify-center overflow-hidden rounded-xl bg-black">
                {isVideo ? (
                  <video 
                    src={mediaPreview} 
                    className="w-full max-h-[180px] object-contain"
                    controls 
                    muted 
                    loop 
                    autoPlay
                  />
                ) : (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full max-h-[180px] object-contain"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview('');
                    setIsVideo(false);
                    setOriginalSize(0);
                    setCompressedSize(0);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-6">
                <Upload className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors mb-2" />
                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Choose media file
                </span>
                <span className="text-xs text-white/40 mt-1">
                  JPG, PNG, WEBP, MP4, WEBM (Max 50MB)
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  disabled={compressing}
                />
              </label>
            )}
            {compressing && (
              <div className="absolute inset-0 bg-dark/80 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl">
                <Loader2 className="w-8 h-8 text-secondary animate-spin mb-2" />
                <span className="text-sm text-white/80 font-medium">Compressing Image...</span>
              </div>
            )}
          </div>

          {/* Compression & Auto-Compression toggle */}
          {!isVideo && originalSize > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Auto-compression:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shouldCompress}
                    onChange={(e) => setShouldCompress(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              {compressedSize > 0 && (
                <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2 mt-2 text-white/60">
                  <div>Original Size: <strong className="text-white font-mono">{formatBytes(originalSize)}</strong></div>
                  <div>Compressed: <strong className="text-white font-mono">{formatBytes(compressedSize)}</strong></div>
                  <div className="col-span-2 text-success font-semibold text-right">
                    Saved {Math.round((1 - compressedSize / originalSize) * 100)}% of space
                  </div>
                </div>
              )}
            </div>
          )}
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
          disabled={loading || compressing}
          className="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>{slide ? 'Update Slide' : 'Add Slide'}</span>
        </button>
      </div>
    </form>
  );
}
