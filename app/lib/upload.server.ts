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
      dir: 'ktp',
    },
    photo: {
      maxSize: 5 * 1024 * 1024,
      allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
      dir: 'photos',
    },
    document: {
      maxSize: 10 * 1024 * 1024,
      allowedExts: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'],
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
