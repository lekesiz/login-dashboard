import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleError, successResponse } from '@/lib/api-helpers'
import { sendPasswordResetEmail } from '@/lib/email'
import { createPasswordResetToken } from '@/lib/tokens'
import { UserStatus } from '@prisma/client'

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
})

// POST /api/auth/forgot-password - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        emailVerified: true,
      },
    })
    
    // Always return success to prevent email enumeration
    const successMessage = 'Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderildi.'
    
    if (!user) {
      return successResponse({ message: successMessage })
    }
    
    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      return successResponse({ message: successMessage })
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
      return successResponse({ 
        message: 'Email adresiniz doğrulanmamış. Lütfen önce email adresinizi doğrulayın.' 
      })
    }
    
    // Generate reset token
    const resetToken = await createPasswordResetToken(user.id)
    
    // Send reset email
    await sendPasswordResetEmail({
      userName: user.name,
      userEmail: user.email,
      resetToken,
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        action: 'Password reset requested',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    })
    
    return successResponse({ message: successMessage })
  } catch (error) {
    return handleError(error)
  }
}