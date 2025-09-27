'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, BarChart3, FileText, Package, User, Activity } from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/users', label: 'Kullanıcılar', icon: Users },
  { href: '/dashboard/activities', label: 'Aktiviteler', icon: Activity },
  { href: '/dashboard/profile', label: 'Profil', icon: User },
  { href: '/dashboard/analytics', label: 'Analizler', icon: BarChart3 },
  { href: '/dashboard/products', label: 'Ürünler', icon: Package },
  { href: '/dashboard/reports', label: 'Raporlar', icon: FileText },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Modern WebApp</h1>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}