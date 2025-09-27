'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api-client'
import Button from '@/components/ui/button'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gereklidir'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

type ChangePasswordData = z.infer<typeof changePasswordSchema>

export default function ChangePasswordSection() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => authApi.changeMyPassword(data),
    onSuccess: () => {
      reset()
      alert('Şifreniz başarıyla güncellendi')
    },
  })

  const onSubmit = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
      <p className="text-sm text-gray-600 mb-6">
        Hesap güvenliğiniz için güçlü bir şifre kullandığınızdan emin olun.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mevcut Şifre
          </label>
          <div className="relative">
            <input
              {...register('currentPassword')}
              type={showPassword.current ? 'text' : 'password'}
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yeni Şifre
          </label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showPassword.new ? 'text' : 'password'}
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yeni Şifre (Tekrar)
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showPassword.confirm ? 'text' : 'password'}
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={changePasswordMutation.isPending}
            className="w-full sm:w-auto"
          >
            <Lock className="h-4 w-4 mr-2" />
            Şifreyi Güncelle
          </Button>
        </div>

        {changePasswordMutation.isError && (
          <div className="text-sm text-red-600">
            {changePasswordMutation.error instanceof Error ? changePasswordMutation.error.message : 'Şifre değiştirme başarısız'}
          </div>
        )}

        {changePasswordMutation.isSuccess && (
          <div className="text-sm text-green-600">
            Şifreniz başarıyla güncellendi!
          </div>
        )}
      </form>
    </div>
  )
}