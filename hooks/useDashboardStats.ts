import { useState, useEffect } from 'react'
import axios from 'axios'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  growthPercentage: number
  userGrowthData: Array<{ date: string; users: number }>
  recentActivities: Array<{
    id: string
    type: string
    description: string
    createdAt: string
    user: {
      name: string | null
      email: string
      avatar: string | null
    }
  }>
  activityStats: Array<{ type: string; count: number }>
}

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/dashboard/stats')
        setData(response.data.data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { data, loading, error }
}