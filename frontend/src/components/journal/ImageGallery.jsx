import React, { useState } from 'react';
import { Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
import Modal from '../common/Modal';

export default function ImageGallery({
  images = [],
  onUpload,
  onRemove,
  isUploading = false,
  readOnly = false,
  multiple = true,
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      onUpload?.(files);
    } else {
      onUpload?.(files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Upload button area */}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Uploading...' : multiple ? 'Upload Photos' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          <span className="text-[11px] text-stone-400">
            JPG, PNG, WebP up to 5MB
          </span>
        </div>
      )}

      {/* Grid of uploaded images */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id || img.url}
              className="group relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-xs"
            >
              <img
                src={img.url}
                alt={img.caption || img.original_name || 'Journal photo'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />

              {/* Hover overlay with preview & remove actions */}
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="p-1.5 rounded-full bg-white/90 text-stone-900 hover:bg-white shadow-xs transition-colors"
                  title="View large"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {!readOnly && onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(img.id);
                    }}
                    className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 shadow-xs transition-colors"
                    title="Delete image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : readOnly ? null : (
        <div className="p-6 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-1.5">
          <ImageIcon className="w-6 h-6 stroke-1 text-stone-400" />
          <span>No photos attached yet.</span>
        </div>
      )}

      {/* Image Zoom Modal */}
      <Modal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.original_name || 'Photo Preview'}
        maxWidth="max-w-3xl"
      >
        {selectedImage && (
          <div className="space-y-3">
            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-stone-950 flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || 'Enlarged photo'}
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>
            {selectedImage.caption && (
              <p className="text-xs text-stone-600 dark:text-stone-300 text-center italic">
                {selectedImage.caption}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

