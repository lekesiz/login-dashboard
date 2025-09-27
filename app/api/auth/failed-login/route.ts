import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleError, successResponse } from '@/lib/api-helpers'
import { ActivityService } from '@/lib/services/activity.service'

// POST /api/auth/failed-login - Log failed login attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return handleError({
        code: 'VALIDATION_ERROR',
        message: 'Email is required',
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (user) {
      // Log failed attempt for existing user
      await ActivityService.logFromRequest(
        request,
        user.id,
        'AUTH_FAILED',
        'Failed login attempt',
        { email }
      )
    }

    // Always return success to avoid user enumeration
    return successResponse({ message: 'Failed login recorded' })
  } catch (error) {
    return handleError(error)
  }
}