import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'
import { changePasswordSchema } from '@/lib/validations/user'
import bcrypt from 'bcryptjs'

type RouteParams = {
  params: Promise<{ id: string }>
}

// POST /api/users/:id/password - Change user password
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  return withAuth(async (session) => {
    try {
      const body = await request.json()
      const validatedData = changePasswordSchema.parse(body)
      const { id } = await params
      
      // Users can only change their own password unless they're admin
      if (session.user.id !== id && session.user.role !== 'admin') {
        return handleError({
          code: 'FORBIDDEN',
          message: 'You can only change your own password',
        })
      }
      
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: { id: true, password: true, name: true },
      })
      
      if (!user || !user.password) {
        return handleError({ code: 'P2025' })
      }
      
      // If changing own password, verify current password
      if (session.user.id === id) {
        const isValid = await bcrypt.compare(validatedData.currentPassword, user.password)
        if (!isValid) {
          return handleError({
            code: 'INVALID_PASSWORD',
            message: 'Current password is incorrect',
          })
        }
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)
      
      // Update password
      await prisma.user.update({
        where: { id: id },
        data: { password: hashedPassword },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'PASSWORD_CHANGED',
          action: session.user.id === id 
            ? 'Changed own password'
            : `Changed password for: ${user.name}`,
          details: JSON.stringify({ targetUserId: id }),
        },
      })
      
      return successResponse({ message: 'Password changed successfully' })
    } catch (error) {
      return handleError(error)
    }
  })
}