import { prisma } from '@/lib/prisma'
import { withRole, handleError, successResponse } from '@/lib/api-helpers'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  return withRole(['admin', 'moderator'], async () => {
    try {
      const today = new Date()
      const startOfToday = startOfDay(today)
      const endOfToday = endOfDay(today)
      const sevenDaysAgo = subDays(today, 7)

      // Get total users
      const totalUsers = await prisma.user.count()

      // Get active users (logged in within last 7 days)
      const activeUsers = await prisma.user.count({
        where: {
          lastLogin: {
            gte: sevenDaysAgo
          }
        }
      })

      // Get new users today
      const newUsersToday = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday
          }
        }
      })

      // Get user growth for last 7 days
      const userGrowthData = []
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i)
        const startDate = startOfDay(date)
        const endDate = endOfDay(date)
        
        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })

        userGrowthData.push({
          date: format(date, 'dd MMM'),
          users: count
        })
      }

      // Calculate growth percentage
      const previousWeekUsers = await prisma.user.count({
        where: {
          createdAt: {
            lt: sevenDaysAgo
          }
        }
      })

      const growthPercentage = previousWeekUsers > 0 
        ? ((totalUsers - previousWeekUsers) / previousWeekUsers) * 100 
        : 100

      // Get recent activities
      const recentActivities = await prisma.activity.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })

      // Get activity type statistics
      const activityStats = await prisma.activity.groupBy({
        by: ['type'],
        _count: {
          type: true
        },
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      })

      const stats = {
        totalUsers,
        activeUsers,
        newUsersToday,
        growthPercentage: Number(growthPercentage.toFixed(1)),
        userGrowthData,
        recentActivities,
        activityStats: activityStats.map(stat => ({
          type: stat.type,
          count: stat._count.type
        }))
      }

      return successResponse(stats)
    } catch (error) {
      return handleError(error)
    }
  })
}