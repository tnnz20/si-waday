import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string({ message: 'Email atau username wajib diisi.' })
    .trim()
    .min(1, 'Email atau username wajib diisi.')
    .max(100, 'Email atau username tidak boleh melebihi 100 karakter.'),
  password: z
    .string({ message: 'Kata sandi wajib diisi.' })
    .min(1, 'Kata sandi wajib diisi.')
    .max(100, 'Kata sandi tidak boleh melebihi 100 karakter.'),
  redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
