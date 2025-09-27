'use client'

import { TrendingUp, Users, Activity, UserCheck } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart'
import { RecentActivities } from '@/components/dashboard/RecentActivities'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ActivityTypeChart } from '@/components/dashboard/ActivityTypeChart'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: stats, loading, error } = useDashboardStats()

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Veriler yüklenirken bir hata oluştu</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    { 
      label: 'Toplam Kullanıcı', 
      value: stats?.totalUsers || 0, 
      change: stats ? `+${stats.growthPercentage}%` : undefined,
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Aktif Kullanıcı', 
      value: stats?.activeUsers || 0, 
      change: undefined,
      icon: UserCheck, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Bugünkü Yeni Kayıt', 
      value: stats?.newUsersToday || 0, 
      change: undefined,
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Büyüme Oranı', 
      value: stats ? `%${stats.growthPercentage}` : '%0', 
      change: undefined,
      icon: Activity, 
      color: 'bg-orange-500' 
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldin, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-gray-600 mt-1">İşte bugünkü özet bilgilerin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} loading={loading} />
        ))}
      </div>

      {/* User Growth Chart */}
      <div className="mb-8">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        ) : stats?.userGrowthData ? (
          <UserGrowthChart data={stats.userGrowthData} />
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activities */}
        <RecentActivities 
          activities={stats?.recentActivities || []} 
          loading={loading} 
        />

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Activity Type Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          ) : stats?.activityStats && stats.activityStats.length > 0 ? (
            <ActivityTypeChart data={stats.activityStats} />
          ) : null}
        </div>
      </div>
    </div>
  )
}