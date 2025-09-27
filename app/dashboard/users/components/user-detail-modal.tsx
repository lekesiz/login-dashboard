'use client'

import { useQuery } from '@tanstack/react-query'
import Modal from '@/components/ui/modal'
import Badge from '@/components/ui/badge'
import { userApi } from '@/lib/api-client'
import { formatDate } from '@/lib/utils'
import { Mail, Calendar, Clock, Activity, Users, Shield } from 'lucide-react'

interface UserDetailModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

const statusConfig = {
  ACTIVE: { label: 'Aktif', variant: 'success' as const },
  INACTIVE: { label: 'Pasif', variant: 'danger' as const },
  PENDING: { label: 'Beklemede', variant: 'warning' as const },
  SUSPENDED: { label: 'Askıda', variant: 'danger' as const },
  DELETED: { label: 'Silinmiş', variant: 'default' as const },
}

const activityTypeLabels = {
  AUTH_LOGIN: 'Giriş yaptı',
  AUTH_LOGOUT: 'Çıkış yaptı',
  AUTH_FAILED: 'Başarısız giriş',
  USER_CREATED: 'Kullanıcı oluşturdu',
  USER_UPDATED: 'Kullanıcı güncelledi',
  USER_DELETED: 'Kullanıcı sildi',
  PASSWORD_CHANGED: 'Şifre değiştirdi',
  PASSWORD_RESET: 'Şifre sıfırladı',
  ROLE_CHANGED: 'Rol değiştirdi',
  PERMISSION_CHANGED: 'Yetki değiştirdi',
}

export default function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUser(userId),
    enabled: isOpen,
  })

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kullanıcı Detayları" size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-medium">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusConfig[user.status as keyof typeof statusConfig].variant}>
                  {statusConfig[user.status as keyof typeof statusConfig].label}
                </Badge>
                <Badge variant="info">{user.role.displayName}</Badge>
                {user.emailVerified && <Badge variant="success">Email Doğrulandı</Badge>}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Katılım:</span>
                <span className="font-medium">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Son Giriş:</span>
                <span className="font-medium">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Hiç giriş yapmadı'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">
                  {user.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Aktivite:</span>
                <span className="font-medium">{user._count.activities} işlem</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Oturum:</span>
                <span className="font-medium">{user._count.sessions} oturum</span>
              </div>
              {user.invitedByUser && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Davet Eden:</span>
                  <span className="font-medium">{user.invitedByUser.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Role & Permissions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rol ve Yetkiler</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium text-gray-900">{user.role.displayName}</div>
              {user.role.description && (
                <p className="text-sm text-gray-600 mt-1">{user.role.description}</p>
              )}
              {user.role.permissions.length > 0 && (
                <div className="mt-3 space-y-1">
                  {user.role.permissions.map((perm) => (
                    <div key={perm.id} className="text-sm">
                      <span className="font-medium">✓ {perm.name}</span>
                      {perm.description && (
                        <span className="text-gray-600"> - {perm.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Son Aktiviteler</h4>
            <div className="space-y-2">
              {user.activities.length > 0 ? (
                user.activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <span className="text-sm font-medium">
                        {activityTypeLabels[activity.type as keyof typeof activityTypeLabels] || activity.type}
                      </span>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(activity.createdAt)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Henüz aktivite yok</p>
              )}
            </div>
          </div>

          {/* Invited Users */}
          {user.invitedUsers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Davet Ettiği Kullanıcılar</h4>
              <div className="space-y-2">
                {user.invitedUsers.map((invitedUser) => (
                  <div key={invitedUser.id} className="flex items-center justify-between">
                    <span className="text-sm">{invitedUser.name} ({invitedUser.email})</span>
                    <Badge variant={statusConfig[invitedUser.status as keyof typeof statusConfig].variant}>
                      {statusConfig[invitedUser.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">Kullanıcı bulunamadı</div>
      )}
    </Modal>
  )
}