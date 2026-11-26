import { z } from 'zod';

export const TICKET_STATUS_VALUES = [
  'menunggu_verifikasi',
  'terverifikasi',
  'sedang_diproses',
  'selesai',
  'ditolak',
] as const;

export const updateTicketStatusSchema = z.object({
  ticketNumber: z.string().trim().min(1, 'Nomor tiket wajib diisi.'),
  status: z.enum(TICKET_STATUS_VALUES, {
    message: 'Status penanganan tiket tidak valid.',
  }),
  adminNotes: z
    .string()
    .trim()
    .max(2000, 'Catatan tindak lanjut maksimal 2000 karakter.')
    .optional()
    .default(''),
});

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
