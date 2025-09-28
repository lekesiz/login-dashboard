import { prisma } from '@/lib/prisma'
import { ActivityType, Prisma } from '@prisma/client'

export interface ActivityFilters {
  userId?: string
  type?: ActivityType
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

export interface ActivityPaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateActivityOptions {
  userId: string
  type: ActivityType
  action: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export class ActivityService {
  /**
   * Create a new activity log entry
   */
  static async create(options: CreateActivityOptions) {
    return prisma.activity.create({
      data: {
        userId: options.userId,
        type: options.type,
        action: options.action,
        details: options.details ? JSON.stringify(options.details) : undefined,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      },
    })
  }

  /**
   * Log activity from request context
   */
  static async logFromRequest(
    request: Request,
    userId: string,
    type: ActivityType,
    action: string,
    details?: Record<string, unknown>
  ) {
    // Extract IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    // Extract user agent
    const userAgent = request.headers.get('user-agent') || undefined

    return this.create({
      userId,
      type,
      action,
      details,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Find activities with filters and pagination
   */
  static async findMany(
    filters: ActivityFilters = {},
    pagination: ActivityPaginationOptions
  ) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ActivityWhereInput = {}

    if (filters.userId) {
      where.userId = filters.userId
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo
      }
    }

    if (filters.search) {
      where.OR = [
        { action: { contains: filters.search } },
        // For PostgreSQL JSON search, we'll need to use raw query or ignore for now
      ]
    }

    // Get total count
    const total = await prisma.activity.count({ where })

    // Get activities
    const activities = await prisma.activity.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return {
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get activity statistics for a user
   */
  static async getUserStats(userId: string, days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await prisma.activity.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      _count: {
        type: true,
      },
    })

    const dailyActivity = await prisma.activity.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      _count: true,
    })

    return {
      byType: stats.reduce((acc, stat) => {
        acc[stat.type] = stat._count.type
        return acc
      }, {} as Record<ActivityType, number>),
      dailyCount: dailyActivity.length,
      totalCount: stats.reduce((sum, stat) => sum + stat._count.type, 0),
    }
  }

  /**
   * Clean up old activities (for maintenance)
   */
  static async cleanup(daysToKeep: number = 90) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    return prisma.activity.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    })
  }
}