import { useRef, useState } from 'react';

import { toast } from 'sonner';
import { calculateSavingsPercent, compressImageFile, formatFileSize } from '~/lib/image-compressor';

import { Button } from '@/components/ui/button';

import type { FormPhotoItem } from '@/types/aspiration';

import { Camera, Image as ImageIcon, Loader2, Trash2, UploadCloud } from 'lucide-react';

export interface PhotoDropzoneProps {
  photos: FormPhotoItem[];
  onChange: (photos: FormPhotoItem[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
}

export function PhotoDropzone({
  photos,
  onChange,
  maxFiles = 3,
  disabled = false,
  error,
  label = 'Foto Dokumentasi Lokasi / Bukti',
  helperText = 'Format: JPG, PNG, atau WebP. Maksimal 3 foto (kompresi otomatis).',
}: PhotoDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const remainingSlots = Math.max(0, maxFiles - photos.length);

  const processFiles = async (fileList: FileList | File[]) => {
    if (disabled || remainingSlots <= 0) return;

    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));

    if (files.length === 0) {
      toast.error('File Tidak Didukung', {
        description: 'Silakan pilih file gambar berekstensi JPG, PNG, atau WebP.',
      });
      return;
    }

    if (files.length > remainingSlots) {
      toast.warning('Batas Maksimal Foto', {
        description: `Anda hanya dapat menambahkan ${remainingSlots} foto lagi (maksimal ${maxFiles} foto).`,
      });
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setIsCompressing(true);

    try {
      const newItems: FormPhotoItem[] = [];

      for (const file of filesToProcess) {
        // Enforce pre-compression safety limit of 15MB
        if (file.size > 15 * 1024 * 1024) {
          toast.error('Ukuran Terlalu Besar', {
            description: `File ${file.name} melebihi 15MB. Silakan pilih foto dengan resolusi lebih wajar.`,
          });
          continue;
        }

        const compressed = await compressImageFile(file, {
          maxDimension: 1600,
          quality: 0.82,
          mimeType: 'image/webp',
        });

        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`;

        newItems.push({
          id,
          file: compressed.file,
          fileName: compressed.file.name,
          previewUrl: compressed.previewUrl,
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
        });
      }

      if (newItems.length > 0) {
        onChange([...photos, ...newItems]);
      }
    } catch (err) {
      console.error('Failed to process image files:', err);
      toast.error('Gagal Memproses Gambar', {
        description: 'Terjadi kesalahan saat mengompresi gambar. Silakan coba kembali.',
      });
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && remainingSlots > 0) {
      setIsDragging(true);
    }
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
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemovePhoto = (id: string) => {
    const target = photos.find((p) => p.id === id);
    if (target?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Header Label & Counter */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-darknavy-900 block text-xs font-bold sm:text-sm">
            {label} <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <p className="text-2xs text-slate-500">{helperText}</p>
        </div>
        <span className="text-2xs rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-600">
          {photos.length} / {maxFiles} Foto
        </span>
      </div>

      {/* Hidden Multi-file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled || isCompressing || remainingSlots === 0}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Unggah foto dokumentasi bukti"
      />

      {/* Dropzone Card (when slots available) */}
      {remainingSlots > 0 ? (
        <div
          role="button"
          tabIndex={0}
          aria-disabled={disabled || isCompressing}
          onClick={() => {
            if (!disabled && !isCompressing) {
              fileInputRef.current?.click();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled && !isCompressing) {
                fileInputRef.current?.click();
              }
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`focus:ring-accent-500/40 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all focus:ring-2 focus:outline-none ${
            isDragging
              ? 'border-accent-500 bg-accent-50/50 scale-95'
              : 'border-warm-300 hover:border-accent-500/80 bg-warm-50/50 hover:bg-accent-50/20'
          } ${disabled || isCompressing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-accent-500 h-8 w-8 animate-spin" aria-hidden="true" />
              <p className="text-darknavy-900 text-xs font-bold">Mengompresi Foto...</p>
              <p className="text-2xs text-slate-500">
                Mengoptimalkan ukuran resolusi foto sebelum dikirim
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-xs">
                {isDragging ? (
                  <UploadCloud className="text-accent-500 h-6 w-6" aria-hidden="true" />
                ) : (
                  <Camera className="h-6 w-6 text-slate-400" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="text-darknavy-900 text-xs font-extrabold">
                  Tarik &amp; Lepas Foto ke Sini, atau{' '}
                  <span className="text-accent-500 decoration-accent-500/40 underline underline-offset-2">
                    Jelajahi File
                  </span>
                </p>
                <p className="text-2xs mt-0.5 text-slate-500">
                  Dapat memilih hingga {remainingSlots} foto sekaligus.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Uploaded Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {photos.map((item, index) => {
            const savings = calculateSavingsPercent(item.originalSize, item.compressedSize);
            return (
              <div
                key={item.id}
                className="group border-warm-200 relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-2xs transition-all hover:shadow-xs"
              >
                {/* Thumbnail Aspect Ratio Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={`Dokumentasi Bukti ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}

                  {/* Slot Number Badge */}
                  <span className="bg-darknavy-900/80 text-2xs absolute top-2 left-2 rounded-lg px-2 py-0.5 font-mono font-bold text-white backdrop-blur-xs">
                    Foto #{index + 1}
                  </span>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus foto dokumentasi ${index + 1}`}
                    onClick={() => handleRemovePhoto(item.id)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-white/90 text-rose-500 shadow-sm backdrop-blur-xs hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>

                {/* Footer Metrics */}
                <div className="p-2.5">
                  <p className="text-2xs truncate font-mono font-semibold text-slate-700">
                    {item.fileName}
                  </p>
                  <div className="text-2xs mt-1 flex items-center justify-between text-slate-500">
                    <span>{formatFileSize(item.compressedSize)}</span>
                    {savings > 0 ? (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700">
                        -{savings}% hemat
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Field Level Error */}
      {error ? (
        <p className="text-2xs font-semibold text-rose-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
