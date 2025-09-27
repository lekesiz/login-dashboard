import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'

// GET /api/auth/me - Get current user
export async function GET() {
  return withAuth(async (session) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          lastLogin: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
          _count: {
            select: {
              sessions: true,
              activities: true,
            },
          },
        },
      })
      
      if (!user) {
        return handleError({ code: 'P2025' })
      }
      
      return successResponse(user)
    } catch (error) {
      return handleError(error)
    }
  })
}

// PATCH /api/auth/me - Update current user profile
export async function PATCH(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const body = await request.json()
      
      // Only allow updating certain fields
      const allowedFields = ['name', 'avatar'] as const
      const updates: Partial<{ name: string; avatar: string }> = {}
      
      for (const field of allowedFields) {
        if (field in body) {
          updates[field] = body[field]
        }
      }
      
      if (Object.keys(updates).length === 0) {
        return successResponse({ message: 'No updates provided' })
      }
      
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: updates,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'USER_UPDATED',
          action: 'Updated profile',
          details: JSON.stringify({ updatedFields: Object.keys(updates) }),
        },
      })
      
      return successResponse(user)
    } catch (error) {
      return handleError(error)
    }
  })
}