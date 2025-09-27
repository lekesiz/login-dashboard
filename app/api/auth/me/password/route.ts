import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'
import { changePasswordSchema } from '@/lib/validations/user'
import { ActivityService } from '@/lib/services/activity.service'

// POST /api/auth/me/password - Change current user's password
export async function POST(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const body = await request.json()
      const validation = changePasswordSchema.safeParse(body)
      
      if (!validation.success) {
        return handleError({
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.issues,
        })
      }
      
      const { currentPassword, newPassword } = validation.data
      
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      })
      
      if (!user?.password) {
        return handleError({
          code: 'INVALID_REQUEST',
          message: 'User password not found',
        })
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return handleError({
          code: 'INVALID_REQUEST',
          message: 'Mevcut şifre yanlış',
        })
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      // Update password
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      })
      
      // Log activity
      await ActivityService.logFromRequest(
        request,
        session.user.id,
        'PASSWORD_CHANGED',
        'Changed password',
        { userId: session.user.id }
      )
      
      return successResponse({ message: 'Password changed successfully' })
    } catch (error) {
      return handleError(error)
    }
  })
}