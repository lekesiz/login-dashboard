import { NextRequest } from 'next/server'
import { withRole, handleError, successResponse } from '@/lib/api-helpers'
import { ActivityService } from '@/lib/services/activity.service'

// GET /api/activities/stats - Get activity statistics
export async function GET(request: NextRequest) {
  return withRole(['admin', 'moderator'], async () => {
    try {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const days = parseInt(searchParams.get('days') || '30')

      if (!userId) {
        return handleError(new Error('User ID is required'))
      }

      const stats = await ActivityService.getUserStats(userId, days)
      
      return successResponse(stats)
    } catch (error) {
      return handleError(error)
    }
  })
}