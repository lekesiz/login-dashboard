import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'

// GET /api/auth/activities - Get current user's recent activities
export async function GET(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const url = new URL(request.url)
      const limit = parseInt(url.searchParams.get('limit') || '10')
      
      const activities = await prisma.activity.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          type: true,
          action: true,
          details: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      })
      
      return successResponse(activities)
    } catch (error) {
      return handleError(error)
    }
  })
}