'use client'

import { useMutation } from '@tanstack/react-query'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { userApi } from '@/lib/api-client'
import { AlertTriangle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
}

interface DeleteUserDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteUserDialog({ user, isOpen, onClose, onSuccess }: DeleteUserDialogProps) {
  const deleteUserMutation = useMutation({
    mutationFn: () => userApi.deleteUser(user.id),
    onSuccess: () => {
      alert('Kullanıcı silindi!')
      onSuccess()
    },
    onError: (error) => {
      alert('Hata: ' + error.message)
    },
  })

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kullanıcıyı Sil" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              Bu kullanıcıyı silmek istediğinizden emin misiniz?
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <p className="font-medium">{user.name} ({user.email})</p>
              <p className="mt-1">Bu işlem geri alınamaz. Kullanıcının tüm verileri silinecektir.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteUserMutation.mutate()}
            isLoading={deleteUserMutation.isPending}
            disabled={deleteUserMutation.isPending}
          >
            Kullanıcıyı Sil
          </Button>
        </div>
      </div>
    </Modal>
  )
}