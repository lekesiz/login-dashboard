'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, Package, Settings, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// User Form Schema
const userFormSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  email: z.string().email('Geçerli bir email adresi girin'),
  roleId: z.string().min(1, 'Rol seçiniz')
})

type UserFormData = z.infer<typeof userFormSchema>

interface Role {
  id: string
  name: string
  displayName: string
}

export function QuickActions() {
  const router = useRouter()
  const [modals, setModals] = useState({
    addUser: false,
    createReport: false,
    addProduct: false,
    settings: false
  })

  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema)
  })

  useEffect(() => {
    // Fetch roles when component mounts
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/roles')
        setRoles(response.data.data)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }))
  }

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }))
    reset()
  }

  const onSubmitUser = async (data: UserFormData) => {
    setLoading(true)
    try {
      await axios.post('/api/users', {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        sendInvite: true
      })
      closeModal('addUser')
      router.refresh()
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Eylemler</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => openModal('addUser')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Users className="h-6 w-6 text-gray-600 mb-2 mx-auto" />
            <p className="text-sm font-medium text-gray-700">Kullanıcı Ekle</p>
          </button>
          
          <button
            onClick={() => openModal('createReport')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FileText className="h-6 w-6 text-gray-600 mb-2 mx-auto" />
            <p className="text-sm font-medium text-gray-700">Rapor Oluştur</p>
          </button>
          
          <button
            onClick={() => openModal('addProduct')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Package className="h-6 w-6 text-gray-600 mb-2 mx-auto" />
            <p className="text-sm font-medium text-gray-700">Ürün Ekle</p>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Settings className="h-6 w-6 text-gray-600 mb-2 mx-auto" />
            <p className="text-sm font-medium text-gray-700">Ayarlar</p>
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={modals.addUser}
        onClose={() => closeModal('addUser')}
        title="Yeni Kullanıcı Ekle"
      >
        <form onSubmit={handleSubmit(onSubmitUser)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim Soyisim
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              {...register('roleId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Rol Seçin</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.displayName}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => closeModal('addUser')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Report Modal */}
      <Modal
        isOpen={modals.createReport}
        onClose={() => closeModal('createReport')}
        title="Rapor Oluştur"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Rapor oluşturma özelliği yakında eklenecek.</p>
          <div className="flex justify-end">
            <button
              onClick={() => closeModal('createReport')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Kapat
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={modals.addProduct}
        onClose={() => closeModal('addProduct')}
        title="Ürün Ekle"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Ürün ekleme özelliği yakında eklenecek.</p>
          <div className="flex justify-end">
            <button
              onClick={() => closeModal('addProduct')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Kapat
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}