'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  User, 
  Activity,
  Settings,
  Lock,
  Camera
} from 'lucide-react'
import { authApi } from '@/lib/api-client'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import ProfileInfoSection from './components/profile-info-section'
import ChangePasswordSection from './components/change-password-section'
import SessionsSection from './components/sessions-section'
import DangerZoneSection from './components/danger-zone-section'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getMe,
  })

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Lock },
    { id: 'sessions', label: 'Oturumlar', icon: Activity },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Kullanıcı bulunamadı</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600 mt-1">Hesap bilgilerinizi ve ayarlarınızı yönetin</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            {/* User Avatar and Basic Info */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-medium mx-auto">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge variant="info" className="mt-2">
                {user.role.displayName}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Durum:</span>
                <Badge variant="success">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">
                  {user.emailVerified ? '✓ Doğrulandı' : '⏳ Beklemede'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Oturumlar:</span>
                <span className="text-gray-900">{user._count.sessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Aktiviteler:</span>
                <span className="text-gray-900">{user._count.activities}</span>
              </div>
            </div>

            <hr className="my-6" />

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'general' && (
              <ProfileInfoSection user={user} onUpdate={() => refetch()} />
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <ChangePasswordSection />
                <hr />
                <DangerZoneSection />
              </div>
            )}

            {activeTab === 'sessions' && (
              <SessionsSection />
            )}

            {activeTab === 'settings' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hesap Ayarları
                </h3>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Email Bildirimleri</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Güvenlik bildirimleri</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Aktivite özeti</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Pazarlama emaileri</span>
                      </label>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dil</h4>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Saat Dilimi</h4>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="America/New_York">New York (EST)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button>Ayarları Kaydet</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}