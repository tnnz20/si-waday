export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

export interface CompressedImageResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  width: number;
  height: number;
}

/**
 * Calculates proportionally scaled dimensions bounded by maxDimension.
 */
export function calculateTargetDimensions(
  origWidth: number,
  origHeight: number,
  maxDimension: number = 1600
): { width: number; height: number } {
  if (origWidth <= maxDimension && origHeight <= maxDimension) {
    return { width: origWidth, height: origHeight };
  }

  if (origWidth >= origHeight) {
    const scale = maxDimension / origWidth;
    return {
      width: maxDimension,
      height: Math.round(origHeight * scale),
    };
  }

  const scale = maxDimension / origHeight;
  return {
    width: Math.round(origWidth * scale),
    height: maxDimension,
  };
}

/**
 * Human-readable format for file sizes (e.g. 500 B, 450 KB, 4.2 MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Computes percentage saved by compression.
 */
export function calculateSavingsPercent(originalSize: number, compressedSize: number): number {
  if (originalSize <= 0 || compressedSize >= originalSize) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Checks if browser canvas supports WebP export.
 */
function isWebPSupported(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Compresses an image file on the client using HTML5 Canvas 2D.
 * Downscales dimensions if exceeding maxDimension and compresses to WebP/JPEG.
 */
export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImageResult> {
  const maxDimension = options.maxDimension ?? 1600;
  const quality = options.quality ?? 0.82;
  const preferredMime = options.mimeType ?? 'image/webp';

  // Fallback for SSR or non-browser environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      file,
      previewUrl: '',
      originalSize: file.size,
      compressedSize: file.size,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  }

  // Skip SVG or already very small images (< 150 KB)
  if (file.type === 'image/svg+xml' || file.size < 150 * 1024) {
    const previewUrl = URL.createObjectURL(file);
    return {
      file,
      previewUrl,
      originalSize: file.size,
      compressedSize: file.size,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  }

  // Determine output MIME type
  const targetMime =
    preferredMime === 'image/webp' && isWebPSupported() ? 'image/webp' : 'image/jpeg';
  const targetExt = targetMime === 'image/webp' ? '.webp' : '.jpg';

  try {
    // 1. Load image bitmap or element
    let imageWidth = 0;
    let imageHeight = 0;
    let imageSource: ImageBitmap | HTMLImageElement;

    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      imageWidth = bitmap.width;
      imageHeight = bitmap.height;
      imageSource = bitmap;
    } else {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Gagal memuat gambar untuk dikompresi.'));
        };
        img.src = objectUrl;
      });
      imageWidth = img.naturalWidth || img.width;
      imageHeight = img.naturalHeight || img.height;
      imageSource = img;
    }

    // 2. Compute proportional dimensions
    const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
      imageWidth,
      imageHeight,
      maxDimension
    );

    // 3. Render onto Canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context tidak tersedia.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);

    // Close bitmap if applicable
    if ('close' in imageSource && typeof imageSource.close === 'function') {
      imageSource.close();
    }

    // 4. Export compressed Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), targetMime, quality);
    });

    if (!blob || blob.size === 0) {
      throw new Error('Ekspor kompresi kanvas menghasilkan file kosong.');
    }

    // 5. If compression produced a larger file, keep original
    if (blob.size >= file.size) {
      const previewUrl = URL.createObjectURL(file);
      return {
        file,
        previewUrl,
        originalSize: file.size,
        compressedSize: file.size,
        savingsPercent: 0,
        width: imageWidth,
        height: imageHeight,
      };
    }

    // 6. Wrap into new File object with appropriate extension
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${baseName}${targetExt}`;
    const compressedFile = new File([blob], newFileName, {
      type: targetMime,
      lastModified: Date.now(),
    });

    const previewUrl = URL.createObjectURL(compressedFile);
    const savingsPercent = calculateSavingsPercent(file.size, compressedFile.size);

    return {
      file: compressedFile,
      previewUrl,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      savingsPercent,
      width: targetWidth,
      height: targetHeight,
    };
  } catch (error) {
    console.warn('Client image compression failed, falling back to original file:', error);
    const previewUrl = URL.createObjectURL(file);
    return {
      file,
      previewUrl,
      originalSize: file.size,
      compressedSize: file.size,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  }
}
