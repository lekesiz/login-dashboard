'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'

export default function DangerZoneSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDeleteAccount = () => {
    // This would call an API endpoint to delete/deactivate the account
    console.log('Account deletion requested')
    alert('Hesap silme işlemi şu an mümkün değil. Lütfen yönetici ile iletişime geçin.')
    setShowDeleteModal(false)
    setConfirmText('')
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tehlike Bölgesi</h3>
      
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-red-900">Hesabı Sil</h4>
            <p className="text-sm text-red-700 mt-1">
              Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir. 
              Bu işlem geri alınamaz.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-3"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hesabı Sil
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setConfirmText('')
        }}
        title="Hesabı Sil"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
            <div>
              <p className="text-gray-900 font-medium">
                Bu işlem geri alınamaz!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Hesabınız ve tüm ilişkili verileriniz kalıcı olarak silinecektir:
              </p>
              <ul className="text-sm text-gray-600 mt-2 ml-5 list-disc">
                <li>Profil bilgileriniz</li>
                <li>Tüm oturumlarınız</li>
                <li>Aktivite kayıtlarınız</li>
                <li>Davet ettiğiniz kullanıcılar</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-2">
              Devam etmek için lütfen <strong>&quot;hesabımı sil&quot;</strong> yazın:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="hesabımı sil"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setConfirmText('')
              }}
            >
              İptal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={confirmText.toLowerCase() !== 'hesabımı sil'}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Kalıcı Olarak Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}