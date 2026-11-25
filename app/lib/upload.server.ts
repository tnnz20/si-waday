import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function saveAvatarFile(file: File): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { success: false, error: 'Tidak ada file gambar yang dipilih.' };
  }

  // 1. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'Ukuran file melebihi batas maksimal 2 MB. Silakan pilih gambar yang lebih kecil.',
    };
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error:
        'Format file tidak didukung. Harap gunakan file gambar berekstensi JPG, PNG, atau WebP.',
    };
  }

  // 3. Validate file extension
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      success: false,
      error: 'Ekstensi file tidak valid. Harap gunakan ekstensi .jpg, .jpeg, .png, atau .webp.',
    };
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFilename = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(destinationPath, Buffer.from(arrayBuffer));

    const publicUrl = `/uploads/avatars/${safeFilename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Failed to save avatar image on disk:', error);
    return { success: false, error: 'Terjadi kesalahan saat menyimpan file gambar pada server.' };
  }
}

export async function saveAttachmentFile(
  file: File,
  category: 'ktp' | 'photo' | 'document'
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { success: false, error: 'Tidak ada file yang dipilih.' };
  }

  const limits = {
    ktp: {
      maxSize: 5 * 1024 * 1024,
      allowedExts: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      requireMime: true,
      dir: 'ktp',
    },
    photo: {
      maxSize: 5 * 1024 * 1024,
      allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      requireMime: true,
      dir: 'photos',
    },
    document: {
      maxSize: 10 * 1024 * 1024,
      allowedExts: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'],
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/webp',
      ],
      requireMime: false,
      dir: 'documents',
    },
  };

  const config = limits[category];
  if (file.size > config.maxSize) {
    const mb = config.maxSize / (1024 * 1024);
    return {
      success: false,
      error: `Ukuran file melebihi batas maksimal ${mb} MB.`,
    };
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!config.allowedExts.includes(ext)) {
    return {
      success: false,
      error: `Format file tidak didukung (${ext || 'tanpa ekstensi'}).`,
    };
  }

  const isWordDocGenericMime =
    category === 'document' &&
    (ext === '.doc' || ext === '.docx') &&
    (!file.type || file.type === 'application/octet-stream');

  if (!isWordDocGenericMime) {
    if (config.requireMime && !file.type) {
      return {
        success: false,
        error: 'Tipe MIME file tidak valid atau tidak terdeteksi.',
      };
    }
    if (file.type && !config.allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: `Tipe MIME file tidak didukung (${file.type}).`,
      };
    }
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', config.dir);
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFilename = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(destinationPath, Buffer.from(arrayBuffer));

    const publicUrl = `/uploads/${config.dir}/${safeFilename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error(`Failed to save attachment file (${category}):`, error);
    return { success: false, error: 'Terjadi kesalahan saat menyimpan file pada server.' };
  }
}

export interface ExtractedAttachments {
  idCardUrl: string | null;
  documentUrl: string | null;
  photos: string[];
  errors: string[];
}

function isPersistentUploadUrl(value?: string | null): value is string {
  if (!value) return false;
  return value.startsWith('/uploads/') || /^https?:\/\//.test(value);
}

async function cleanupSavedFiles(urls: string[]): Promise<void> {
  for (const relativeUrl of urls) {
    if (!relativeUrl.startsWith('/uploads/')) continue;
    try {
      const fullPath = path.join(process.cwd(), 'public', relativeUrl.replace(/^\//, ''));
      await fs.unlink(fullPath);
    } catch {
      // Ignore unlink cleanup errors
    }
  }
}

/**
 * Extracts and saves citizen file attachments (KTP, proposal/doc, photos) from FormData.
 * Rejects failed physical uploads with explicit error messages instead of persisting client blob: URLs.
 */
export async function extractTicketAttachments(
  formData: FormData,
  fallbacks: {
    idCardUrl?: string | null;
    documentUrl?: string | null;
    photoUrls?: (string | undefined | null)[];
  }
): Promise<ExtractedAttachments> {
  const errors: string[] = [];
  const savedDiskUrls: string[] = [];

  // 1. KTP
  let idCardUrl = isPersistentUploadUrl(fallbacks.idCardUrl) ? fallbacks.idCardUrl : null;
  const idCardFile = formData.get('idCardFile');
  if (idCardFile instanceof File && idCardFile.size > 0) {
    const uploadRes = await saveAttachmentFile(idCardFile, 'ktp');
    if (uploadRes.success && uploadRes.url) {
      idCardUrl = uploadRes.url;
      savedDiskUrls.push(uploadRes.url);
    } else {
      errors.push(`Lampiran KTP: ${uploadRes.error || 'gagal mengunggah file.'}`);
    }
  }

  // 2. Proposal / Complaint Document
  let documentUrl = isPersistentUploadUrl(fallbacks.documentUrl) ? fallbacks.documentUrl : null;
  const docFile = formData.get('proposalFile') || formData.get('documentFile');
  if (docFile instanceof File && docFile.size > 0) {
    const uploadRes = await saveAttachmentFile(docFile, 'document');
    if (uploadRes.success && uploadRes.url) {
      documentUrl = uploadRes.url;
      savedDiskUrls.push(uploadRes.url);
    } else {
      errors.push(`Dokumen pendukung: ${uploadRes.error || 'gagal mengunggah file.'}`);
    }
  }

  // 3. Evidence Photos (multi-entry 'photos')
  const uploadedPhotos: string[] = [];
  const multiPhotos = formData.getAll('photos');
  const candidateFiles = multiPhotos.filter(
    (item): item is File => item instanceof File && item.size > 0
  );

  for (const photoFile of candidateFiles.slice(0, 3)) {
    const uploadRes = await saveAttachmentFile(photoFile, 'photo');
    if (uploadRes.success && uploadRes.url) {
      uploadedPhotos.push(uploadRes.url);
      savedDiskUrls.push(uploadRes.url);
    } else {
      errors.push(`Foto dokumentasi (${photoFile.name}): ${uploadRes.error || 'gagal diunggah.'}`);
    }
  }

  if (errors.length > 0) {
    await cleanupSavedFiles(savedDiskUrls);
    return { idCardUrl: null, documentUrl: null, photos: [], errors };
  }

  const photos =
    uploadedPhotos.length > 0
      ? uploadedPhotos
      : (fallbacks.photoUrls || []).filter((url): url is string => isPersistentUploadUrl(url));

  return { idCardUrl, documentUrl, photos, errors: [] };
}
