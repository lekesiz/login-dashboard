'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { activityApi } from '@/lib/api-client'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { ActivityType } from '@prisma/client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import type { ActivityWithUser } from '@/types/activity'

const activityTypeColors: Record<ActivityType, string> = {
  AUTH_LOGIN: 'bg-green-500',
  AUTH_LOGOUT: 'bg-gray-500',
  AUTH_FAILED: 'bg-red-500',
  USER_CREATED: 'bg-blue-500',
  USER_UPDATED: 'bg-yellow-500',
  USER_DELETED: 'bg-red-600',
  PASSWORD_CHANGED: 'bg-purple-500',
  PASSWORD_RESET: 'bg-purple-600',
  ROLE_CHANGED: 'bg-indigo-500',
  PERMISSION_CHANGED: 'bg-indigo-600',
}

const activityTypeLabels: Record<ActivityType, string> = {
  AUTH_LOGIN: 'Giriş',
  AUTH_LOGOUT: 'Çıkış',
  AUTH_FAILED: 'Başarısız Giriş',
  USER_CREATED: 'Kullanıcı Oluşturuldu',
  USER_UPDATED: 'Kullanıcı Güncellendi',
  USER_DELETED: 'Kullanıcı Silindi',
  PASSWORD_CHANGED: 'Şifre Değiştirildi',
  PASSWORD_RESET: 'Şifre Sıfırlandı',
  ROLE_CHANGED: 'Rol Değiştirildi',
  PERMISSION_CHANGED: 'İzin Değiştirildi',
}

export default function ActivitiesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ActivityType | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data, isLoading } = useQuery<{
    data: ActivityWithUser[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>({
    queryKey: ['activities', page, search, typeFilter, dateFrom, dateTo],
    queryFn: () =>
      activityApi.getActivities({
        page,
        limit: 20,
        search: search || undefined,
        type: typeFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  })

  const columns = [
    {
      id: 'createdAt',
      header: 'Tarih',
      accessorFn: (row: ActivityWithUser) => format(new Date(row.createdAt), 'dd MMM yyyy HH:mm', { locale: tr }),
    },
    {
      id: 'user',
      header: 'Kullanıcı',
      accessorFn: (row: ActivityWithUser) => row.user?.name || 'Bilinmeyen',
    },
    {
      id: 'type',
      header: 'Tür',
      cell: ({ row }: { row: { original: ActivityWithUser } }) => (
        <Badge className={`${activityTypeColors[row.original.type]} text-white`}>
          {activityTypeLabels[row.original.type]}
        </Badge>
      ),
    },
    {
      id: 'action',
      header: 'Aksiyon',
      accessorFn: (row: ActivityWithUser) => row.action,
    },
    {
      id: 'ipAddress',
      header: 'IP Adresi',
      accessorFn: (row: ActivityWithUser) => row.ipAddress || '-',
    },
    {
      id: 'userAgent',
      header: 'Tarayıcı',
      accessorFn: (row: ActivityWithUser) => {
        if (!row.userAgent) return '-'
        // Simple browser detection
        if (row.userAgent.includes('Chrome')) return 'Chrome'
        if (row.userAgent.includes('Firefox')) return 'Firefox'
        if (row.userAgent.includes('Safari')) return 'Safari'
        if (row.userAgent.includes('Edge')) return 'Edge'
        return 'Diğer'
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aktiviteler</h1>
        <p className="text-gray-500">Sistem aktivitelerini görüntüleyin ve yönetin</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ActivityType | '')}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Tüm Türler</option>
          {Object.entries(activityTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 border rounded-md"
          placeholder="Başlangıç Tarihi"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 border rounded-md"
          placeholder="Bitiş Tarihi"
        />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
        />
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-700">
            Sayfa {page} / {data.meta.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.meta.totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  )
}