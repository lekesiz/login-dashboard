'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { userApi, roleApi } from '@/lib/api-client'
import { Mail, User, Shield, Key } from 'lucide-react'

interface Role {
  id: string
  name: string
  displayName: string
  description?: string | null
  _count: {
    users: number
  }
}

const createUserSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  roleId: z.string().min(1, 'Rol seçimi zorunludur'),
  sendInvite: z.boolean(),
  password: z.string().optional(),
})

type CreateUserForm = z.infer<typeof createUserSchema>

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [showPassword, setShowPassword] = useState(false)

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.getRoles,
    enabled: isOpen,
  })

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (data) => {
      if (data.temporaryPassword) {
        alert(`Kullanıcı oluşturuldu!\nGeçici şifre: ${data.temporaryPassword}`)
      } else {
        alert('Kullanıcı oluşturuldu! Davet emaili gönderildi.')
      }
      onSuccess()
      reset()
    },
    onError: (error) => {
      alert('Hata: ' + error.message)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      sendInvite: true,
    },
  })

  const sendInvite = watch('sendInvite')

  const onSubmit = (data: CreateUserForm) => {
    createUserMutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Kullanıcı Ekle">
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
              placeholder="Örn: Ali Veli"
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
              placeholder="ornek@email.com"
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
              <option value="">Rol Seçin</option>
              {roles?.map((role: Role) => (
                <option key={role.id} value={role.id}>
                  {role.displayName} ({role._count.users} kullanıcı)
                </option>
              ))}
            </select>
          </div>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600">{errors.roleId.message}</p>
          )}
        </div>

        {/* Send Invite Checkbox */}
        <div className="flex items-center">
          <input
            {...register('sendInvite')}
            type="checkbox"
            id="sendInvite"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-900">
            Kullanıcıya davet emaili gönder (Önerilen)
          </label>
        </div>

        {/* Manual Password (if not sending invite) */}
        {!sendInvite && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geçici Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Boş bırakırsanız otomatik oluşturulur"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-sm text-gray-500">
                  {showPassword ? 'Gizle' : 'Göster'}
                </span>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Kullanıcı ilk girişte şifresini değiştirmelidir
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            isLoading={createUserMutation.isPending}
            disabled={createUserMutation.isPending}
          >
            Kullanıcı Oluştur
          </Button>
        </div>
      </form>
    </Modal>
  )
}