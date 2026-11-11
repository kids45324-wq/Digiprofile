import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';

interface DragDropImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'banner' | 'auto';
  className?: string;
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  value,
  onChange,
  label,
  helperText,
  aspectRatio = 'auto',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getAspectClass = () => {
    if (aspectRatio === 'square') return 'aspect-square max-h-48';
    if (aspectRatio === 'banner') return 'h-36 w-full';
    return 'h-44 w-full';
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            {isUrlMode ? 'Switch to Drag & Drop' : 'Paste Image URL instead'}
          </button>
        </div>
      )}

      {isUrlMode ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
          />
          {value && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-28 bg-slate-900">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-4 flex flex-col items-center justify-center text-center overflow-hidden group ${getAspectClass()} ${
            isDragging
              ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/50 scale-[1.01]'
              : value
              ? 'border-slate-200 dark:border-slate-800 hover:border-purple-400 bg-slate-50 dark:bg-slate-900/60'
              : 'border-slate-300 dark:border-slate-700 hover:border-purple-400 bg-slate-50/60 dark:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="relative w-full h-full group">
              <img
                src={value}
                alt="Uploaded asset"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white p-2">
                <UploadCloud className="w-6 h-6 text-purple-300" />
                <span className="text-xs font-bold">Drag & Drop new image to replace</span>
                <span className="text-[10px] text-slate-300">or click to browse files</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-4 pointer-events-none">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-purple-600 dark:text-purple-400 underline">Click to upload</span> or drag and drop image
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP, GIF (up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
