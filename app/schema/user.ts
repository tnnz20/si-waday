import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z
    .string({ message: 'Nama lengkap wajib diisi.' })
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  email: z
    .string({ message: 'Alamat email wajib diisi.' })
    .trim()
    .min(1, 'Alamat email wajib diisi.')
    .email('Format alamat email tidak valid.')
    .max(100, 'Email maksimal 100 karakter.'),
  role: z.enum(['dprd', 'dpr', 'moderator'], {
    message: 'Peran pengguna tidak valid.',
  }),
  dapilName: z
    .string({ message: 'Daerah Pemilihan (Dapil) wajib dipilih.' })
    .trim()
    .min(1, 'Daerah Pemilihan (Dapil) wajib dipilih.'),
  gender: z.enum(['male', 'female'], {
    message: 'Jenis kelamin wajib dipilih.',
  }),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^(\+62|62|0)8[0-9]{7,13}$/.test(val.replace(/[\s-]/g, '')),
      'Format nomor telepon/WhatsApp tidak valid (contoh: 081234567890).'
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  party: z
    .string()
    .trim()
    .max(50, 'Nama partai maksimal 50 karakter.')
    .optional()
    .nullable()
    .or(z.literal('')),
  commission: z
    .string()
    .trim()
    .max(50, 'Nama komisi maksimal 50 karakter.')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const updateUserSchema = z.object({
  userId: z.string().min(1, 'ID Pengguna tidak valid.'),
  fullName: z
    .string({ message: 'Nama lengkap wajib diisi.' })
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  email: z
    .string({ message: 'Alamat email wajib diisi.' })
    .trim()
    .min(1, 'Alamat email wajib diisi.')
    .email('Format alamat email tidak valid.')
    .max(100, 'Email maksimal 100 karakter.'),
  gender: z.enum(['male', 'female'], {
    message: 'Jenis kelamin wajib dipilih.',
  }),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^(\+62|62|0)8[0-9]{7,13}$/.test(val.replace(/[\s-]/g, '')),
      'Format nomor telepon/WhatsApp tidak valid (contoh: 081234567890).'
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  party: z
    .string()
    .trim()
    .max(50, 'Nama partai maksimal 50 karakter.')
    .optional()
    .nullable()
    .or(z.literal('')),
  commission: z
    .string()
    .trim()
    .max(50, 'Nama komisi maksimal 50 karakter.')
    .optional()
    .nullable()
    .or(z.literal('')),
  dapilName: z.string().trim().optional().nullable().or(z.literal('')),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
