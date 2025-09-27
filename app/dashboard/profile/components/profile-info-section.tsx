'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api-client'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  avatar: z.string().url().optional().or(z.literal('')),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

interface UserData {
  id: string
  email: string
  name: string
  avatar?: string | null
  status: string
  emailVerified: Date | string | null
  createdAt: Date | string
  lastLogin: Date | string | null
  role: {
    id: string
    name: string
    displayName: string
  }
  _count: {
    sessions: number
    activities: number
  }
}

interface ProfileInfoSectionProps {
  user: UserData
  onUpdate: () => void
}

export default function ProfileInfoSection({ user, onUpdate }: ProfileInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      avatar: user.avatar || '',
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setIsEditing(false)
      onUpdate()
    },
  })

  const onSubmit = (data: UpdateProfileData) => {
    updateMutation.mutate(data)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Genel Bilgiler</h3>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Düzenle
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim Soyisim
            </label>
            <input
              {...register('name')}
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              {...register('avatar')}
              type="text"
              placeholder="https://example.com/avatar.jpg"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              isLoading={updateMutation.isPending}
              disabled={!isDirty}
            >
              Kaydet
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              İptal
            </Button>
          </div>

          {updateMutation.isError && (
            <div className="text-sm text-red-600">
              {updateMutation.error instanceof Error ? updateMutation.error.message : 'Güncelleme başarısız'}
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <User className="h-4 w-4" />
                <span>İsim Soyisim</span>
              </div>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Shield className="h-4 w-4" />
                <span>Rol</span>
              </div>
              <p className="font-medium text-gray-900">{user.role.displayName}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Kayıt Tarihi</span>
              </div>
              <p className="font-medium text-gray-900">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Hesap Durumu</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hesap Durumu</span>
                <Badge variant={user.status === 'ACTIVE' ? 'success' : 'warning'}>
                  {user.status === 'ACTIVE' ? 'Aktif' : 'Beklemede'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Doğrulama</span>
                <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                  {user.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Son Giriş</span>
                <span className="text-sm text-gray-900">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Henüz giriş yapılmadı'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}