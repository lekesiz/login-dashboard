import { z } from 'zod'
import { UserStatus } from '@prisma/client'

export const createUserSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').optional(),
  roleId: z.string().cuid('Geçerli bir rol ID giriniz'),
  sendInvite: z.boolean().default(true),
})

export const updateUserSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz').optional(),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  roleId: z.string().cuid('Geçerli bir rol ID giriniz').optional(),
  status: z.nativeEnum(UserStatus).optional(),
  avatar: z.string().url('Geçerli bir URL giriniz').optional().nullable(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mevcut şifre gereklidir'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string().min(6, 'Şifre onayı gereklidir'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>