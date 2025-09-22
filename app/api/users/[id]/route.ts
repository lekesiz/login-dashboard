import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRole, handleError, successResponse } from '@/lib/api-helpers'
import { updateUserSchema } from '@/lib/validations/user'
import { UserStatus } from '@prisma/client'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/users/:id - Get user details
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  return withRole(['admin', 'moderator'], async (session) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
              description: true,
              permissions: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
          invitedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          invitedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
          activities: {
            select: {
              id: true,
              type: true,
              action: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: {
              activities: true,
              sessions: true,
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

// PATCH /api/users/:id - Update user
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  return withRole(['admin'], async (session) => {
    try {
      const body = await request.json()
      const validatedData = updateUserSchema.parse(body)
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: params.id },
      })
      
      if (!existingUser) {
        return handleError({ code: 'P2025' })
      }
      
      // Don't allow users to change their own role or status
      if (session.user.id === params.id) {
        delete validatedData.roleId
        delete validatedData.status
      }
      
      // Update user
      const user = await prisma.user.update({
        where: { id: params.id },
        data: validatedData,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          status: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'USER_UPDATED',
          action: `Updated user: ${user.name}`,
          details: { 
            updatedUserId: user.id,
            changes: validatedData,
          },
        },
      })
      
      return successResponse(user)
    } catch (error) {
      return handleError(error)
    }
  })
}

// DELETE /api/users/:id - Soft delete user
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return withRole(['admin'], async (session) => {
    try {
      // Don't allow users to delete themselves
      if (session.user.id === params.id) {
        return handleError({
          code: 'FORBIDDEN',
          message: 'You cannot delete your own account',
        })
      }
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: params.id },
      })
      
      if (!existingUser) {
        return handleError({ code: 'P2025' })
      }
      
      // Soft delete (update status)
      const user = await prisma.user.update({
        where: { id: params.id },
        data: { status: UserStatus.DELETED },
        select: {
          id: true,
          name: true,
        },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'USER_DELETED',
          action: `Deleted user: ${user.name}`,
          details: { deletedUserId: user.id },
        },
      })
      
      return successResponse({ message: 'User deleted successfully' })
    } catch (error) {
      return handleError(error)
    }
  })
}