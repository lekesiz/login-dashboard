'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash, 
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'
import { userApi } from '@/lib/api-client'
import { DataTable } from '@/components/ui/data-table'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import UserDetailModal from './components/user-detail-modal'
import CreateUserModal from './components/create-user-modal'
import EditUserModal from './components/edit-user-modal'
import DeleteUserDialog from './components/delete-user-dialog'

type User = {
  id: string
  email: string
  name: string
  avatar: string | null
  status: string
  emailVerified: Date | null
  createdAt: string
  lastLogin: string | null
  role: {
    id: string
    name: string
    displayName: string
  }
  invitedByUser: {
    id: string
    name: string
  } | null
  _count: {
    activities: number
  }
}

const statusConfig = {
  ACTIVE: { label: 'Aktif', variant: 'success' as const },
  INACTIVE: { label: 'Pasif', variant: 'danger' as const },
  PENDING: { label: 'Beklemede', variant: 'warning' as const },
  SUSPENDED: { label: 'Askıda', variant: 'danger' as const },
  DELETED: { label: 'Silinmiş', variant: 'default' as const },
}

const roleConfig = {
  admin: { label: 'Admin', icon: '👑' },
  moderator: { label: 'Moderatör', icon: '🛡️' },
  user: { label: 'Kullanıcı', icon: '👤' },
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', page, search, selectedStatus, selectedRole],
    queryFn: () =>
      userApi.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        status: selectedStatus || undefined,
        role: selectedRole || undefined,
      }),
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Kullanıcı',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {row.original.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{roleConfig[row.original.role.name as keyof typeof roleConfig]?.icon}</span>
          <span className="font-medium">{row.original.role.displayName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const config = statusConfig[row.original.status as keyof typeof statusConfig]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'emailVerified',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.emailVerified ? (
            <span className="text-green-600">✓ Doğrulandı</span>
          ) : (
            <span className="text-gray-400">⏳ Beklemede</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Son Giriş',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.lastLogin ? formatDate(row.original.lastLogin) : 'Hiç giriş yapmadı'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'İşlemler',
      cell: ({ row }) => (
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 border">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedUser(row.original)
                setShowDetailModal(true)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
              Görüntüle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingUser(row.original)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
              Düzenle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeletingUser(row.original)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
              Sil
            </button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
        <p className="text-gray-600 mt-1">Sistemdeki tüm kullanıcıları yönetin</p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tüm Roller</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderatör</option>
          <option value="user">Kullanıcı</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Pasif</option>
          <option value="PENDING">Beklemede</option>
          <option value="SUSPENDED">Askıda</option>
        </select>

        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="md">
            <Upload className="h-4 w-4 mr-2" />
            İçe Aktar
          </Button>
          <Button variant="outline" size="md">
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Yükleniyor...</div>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={data?.data || []}
              onRowClick={(user) => {
                setSelectedUser(user)
                setShowDetailModal(true)
              }}
            />
            
            {/* Pagination */}
            {data?.meta && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Toplam {data.meta.total} kullanıcıdan{' '}
                  {(page - 1) * 10 + 1} - {Math.min(page * 10, data.meta.total)} arası gösteriliyor
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.meta.totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          userId={selectedUser.id}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedUser(null)
          }}
        />
      )}
      
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          refetch()
        }}
      />
      
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null)
            refetch()
          }}
        />
      )}
      
      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onSuccess={() => {
            setDeletingUser(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}