'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { userApi, roleApi } from '@/lib/api-client'
import { Mail, User, Shield } from 'lucide-react'
import { UserStatus } from '@prisma/client'

const updateUserSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz').optional(),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  roleId: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
})

type UpdateUserForm = z.infer<typeof updateUserSchema>

interface User {
  id: string
  name: string
  email: string
  status: string
  role: {
    id: string
    name: string
    displayName: string
  }
}

interface Role {
  id: string
  name: string
  displayName: string
  description?: string | null
  _count: {
    users: number
  }
}

interface EditUserModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.getRoles,
    enabled: isOpen,
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserForm) => userApi.updateUser(user.id, data),
    onSuccess: () => {
      alert('Kullanıcı güncellendi!')
      onSuccess()
    },
    onError: (error) => {
      alert('Hata: ' + error.message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      status: user.status as UserStatus,
    },
  })

  const onSubmit = (data: UpdateUserForm) => {
    // Only send changed fields
    const changes: Partial<UpdateUserForm> = {}
    if (data.name !== user.name) changes.name = data.name
    if (data.email !== user.email) changes.email = data.email
    if (data.roleId !== user.role.id) changes.roleId = data.roleId
    if (data.status !== user.status) changes.status = data.status

    if (Object.keys(changes).length > 0) {
      updateUserMutation.mutate(changes)
    } else {
      alert('Değişiklik yapılmadı')
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kullanıcıyı Düzenle">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Role Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('roleId')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles?.map((role: Role) => (
                <option key={role.id} value={role.id}>
                  {role.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durum
          </label>
          <select
            {...register('status')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
            <option value="PENDING">Beklemede</option>
            <option value="SUSPENDED">Askıda</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            isLoading={updateUserMutation.isPending}
            disabled={updateUserMutation.isPending}
          >
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  )
}