import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Activity, LogIn, UserPlus, Settings, Shield } from 'lucide-react'

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string
  user: {
    name: string | null
    email: string
    avatar: string | null
  }
}

interface RecentActivitiesProps {
  activities: Activity[]
  loading?: boolean
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'LOGIN':
      return LogIn
    case 'USER_CREATED':
      return UserPlus
    case 'SETTINGS_UPDATED':
      return Settings
    case 'ROLE_CHANGED':
      return Shield
    default:
      return Activity
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'LOGIN':
      return 'bg-blue-100 text-blue-600'
    case 'USER_CREATED':
      return 'bg-green-100 text-green-600'
    case 'SETTINGS_UPDATED':
      return 'bg-yellow-100 text-yellow-600'
    case 'ROLE_CHANGED':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function RecentActivities({ activities, loading }: RecentActivitiesProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Henüz aktivite yok</p>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClasses = getActivityColor(activity.type)
            
            return (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user.name || activity.user.email}
                    </p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { 
                    addSuffix: true,
                    locale: tr 
                  })}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}