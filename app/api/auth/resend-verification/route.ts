import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleError, successResponse } from '@/lib/api-helpers'
import { sendEmailVerificationEmail } from '@/lib/email'
import { createEmailVerificationToken } from '@/lib/tokens'

const resendVerificationSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
})

// POST /api/auth/resend-verification - Resend email verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resendVerificationSchema.parse(body)
    
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
    const successMessage = 'Eğer bu email adresi sistemde kayıtlıysa ve doğrulanmamışsa, yeni bir doğrulama emaili gönderildi.'
    
    if (!user) {
      return successResponse({ message: successMessage })
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      return successResponse({ 
        message: 'Email adresiniz zaten doğrulanmış. Giriş yapabilirsiniz.' 
      })
    }
    
    // Generate new verification token
    const verificationToken = await createEmailVerificationToken(user.id)
    
    // Send verification email
    await sendEmailVerificationEmail({
      userName: user.name,
      userEmail: user.email,
      verificationToken,
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'USER_UPDATED',
        action: 'Email verification resent',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    })
    
    return successResponse({ message: successMessage })
  } catch (error) {
    return handleError(error)
  }
}