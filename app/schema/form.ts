import { z } from 'zod';

export const identityStepSchema = z
  .object({
    fullName: z
      .string({ message: 'Nama lengkap wajib diisi.' })
      .trim()
      .min(3, 'Nama lengkap minimal 3 karakter sesuai KTP.')
      .max(100, 'Nama lengkap maksimal 100 karakter.'),
    nik: z
      .string({ message: 'Nomor NIK 16 digit wajib diisi.' })
      .trim()
      .regex(/^\d{16}$/, 'NIK harus tepat 16 digit angka.'),
    phone: z
      .string({ message: 'Nomor WhatsApp / HP wajib diisi.' })
      .trim()
      .min(1, 'Nomor WhatsApp / HP wajib diisi.')
      .refine(
        (val) => /^(\+62|62|0)8[0-9]{7,13}$/.test(val.replace(/[\s-]/g, '')),
        'Format nomor HP/WhatsApp tidak valid (contoh: 081234567890).'
      ),
    email: z
      .string()
      .trim()
      .email('Format alamat email tidak valid.')
      .optional()
      .nullable()
      .or(z.literal('')),
    ktpAddress: z
      .string({ message: 'Alamat domisili KTP wajib diisi.' })
      .trim()
      .min(5, 'Alamat domisili minimal 5 karakter.')
      .max(255, 'Alamat domisili maksimal 255 karakter.'),
    identityType: z
      .string({ message: 'Jenis identitas wajib dipilih.' })
      .min(1, 'Jenis identitas wajib dipilih.'),
    idCardFileName: z.string().optional().default(''),
    idCardPreviewUrl: z.string().optional().default(''),
  })
  .refine((data) => Boolean(data.idCardFileName || data.idCardPreviewUrl), {
    message: 'Foto Kartu Tanda Pengenal (KTP) wajib diunggah untuk verifikasi keabsahan warga.',
    path: ['idCard'],
  });

export const aspirationStepSchema = z
  .object({
    dapilId: z.string().min(1, 'Silakan pilih daerah pemilihan (Dapil).'),
    representativeId: z.string().optional().default(''),
    representativeName: z.string().optional().default(''),
    kamusUsulan: z
      .string({ message: 'Kamus usulan wajib dipilih.' })
      .min(1, 'Kamus usulan wajib dipilih.'),
    permasalahan: z
      .string({ message: 'Deskripsi permasalahan dan rincian usulan wajib diisi.' })
      .trim()
      .min(20, 'Deskripsi permasalahan minimal 20 karakter agar jelas bagi dewan.')
      .max(2000, 'Deskripsi permasalahan maksimal 2000 karakter.'),
    kecamatan: z.string({ message: 'Kecamatan wajib dipilih.' }).min(1, 'Kecamatan wajib dipilih.'),
    kelurahan: z
      .string({ message: 'Kelurahan / Desa wajib dipilih.' })
      .min(1, 'Kelurahan / Desa wajib dipilih.'),
    alamatLokasi: z
      .string({ message: 'Alamat lokasi usulan wajib diisi secara rinci.' })
      .trim()
      .min(5, 'Alamat lokasi minimal 5 karakter.')
      .max(255, 'Alamat lokasi maksimal 255 karakter.'),
    latitude: z.number({ message: 'Titik koordinat peta wajib ditentukan.' }),
    longitude: z.number({ message: 'Titik koordinat peta wajib ditentukan.' }),
  })
  .refine((data) => Boolean(data.dapilId && data.representativeName), {
    message: 'Silakan pilih anggota dewan / perwakilan Dapil tujuan usulan.',
    path: ['dapil'],
  });

export const complaintStepSchema = z.object({
  agency: z
    .string({ message: 'Tujuan komisi / bidang pengawasan DPRD wajib dipilih.' })
    .min(1, 'Tujuan komisi / bidang pengawasan DPRD wajib dipilih.'),
  category: z
    .string({ message: 'Kategori aduan wajib dipilih.' })
    .min(1, 'Kategori aduan wajib dipilih.'),
  title: z
    .string({ message: 'Judul keluhan / aduan wajib diisi.' })
    .trim()
    .min(5, 'Judul aduan minimal 5 karakter.')
    .max(150, 'Judul aduan maksimal 150 karakter.'),
  content: z
    .string({ message: 'Rincian kronologi aduan wajib dijelaskan.' })
    .trim()
    .min(20, 'Rincian aduan minimal 20 karakter agar dapat ditindaklanjuti.')
    .max(2000, 'Rincian aduan maksimal 2000 karakter.'),
  kecamatan: z.string({ message: 'Kecamatan wajib dipilih.' }).min(1, 'Kecamatan wajib dipilih.'),
  kelurahan: z
    .string({ message: 'Kelurahan / Desa wajib dipilih.' })
    .min(1, 'Kelurahan / Desa wajib dipilih.'),
  alamatLokasi: z
    .string({ message: 'Alamat spesifik lokasi kejadian wajib diisi.' })
    .trim()
    .min(5, 'Alamat lokasi minimal 5 karakter.')
    .max(255, 'Alamat lokasi maksimal 255 karakter.'),
  latitude: z.number({ message: 'Titik koordinat peta wajib ditentukan.' }),
  longitude: z.number({ message: 'Titik koordinat peta wajib ditentukan.' }),
});

export type IdentityStepInput = z.infer<typeof identityStepSchema>;
export type AspirationStepInput = z.infer<typeof aspirationStepSchema>;
export type ComplaintStepInput = z.infer<typeof complaintStepSchema>;
