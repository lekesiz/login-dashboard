import { NextRequest } from 'next/server'
import { ActivityType } from '@prisma/client'
import { withRole, handleError, successResponse } from '@/lib/api-helpers'
import { ActivityService } from '@/lib/services/activity.service'
import type { ActivityFiltersQuery } from '@/types/activity'

// GET /api/activities - Get activities with advanced filtering
export async function GET(request: NextRequest) {
  return withRole(['admin', 'moderator'], async () => {
    try {
      const { searchParams } = new URL(request.url)
      
      // Parse query parameters
      const params: ActivityFiltersQuery = {
        userId: searchParams.get('userId') || undefined,
        type: searchParams.get('type') as ActivityType || undefined,
        dateFrom: searchParams.get('dateFrom') || undefined,
        dateTo: searchParams.get('dateTo') || undefined,
        search: searchParams.get('search') || undefined,
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '20',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      }

      // Build filters
      const filters = {
        userId: params.userId,
        type: params.type,
        dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
        dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
        search: params.search,
      }

      // Pagination options
      const pagination = {
        page: Math.max(1, parseInt(params.page || '1')),
        limit: Math.min(100, Math.max(1, parseInt(params.limit || '20'))),
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
      }

      // Get activities
      const result = await ActivityService.findMany(filters, pagination)

      return successResponse(result.activities, result.pagination)
    } catch (error) {
      return handleError(error)
    }
  })
}