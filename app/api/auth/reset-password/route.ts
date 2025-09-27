import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { handleError, successResponse } from '@/lib/api-helpers'
import { verifyToken, getUserIdFromIdentifier } from '@/lib/tokens'
import { UserStatus } from '@prisma/client'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gereklidir'),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'
    ),
})

// POST /api/auth/reset-password - Reset password with token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)
    
    // Verify token
    const tokenData = await verifyToken(validatedData.token)
    
    if (!tokenData) {
      return handleError({
        code: 'INVALID_TOKEN',
        message: 'Geçersiz veya süresi dolmuş token',
      })
    }
    
    // Get user ID from token identifier
    const userId = getUserIdFromIdentifier(tokenData.identifier)
    
    if (!userId || !tokenData.identifier.startsWith('reset:')) {
      return handleError({
        code: 'INVALID_TOKEN',
        message: 'Geçersiz token formatı',
      })
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    })
    
    if (!user || user.status !== UserStatus.ACTIVE) {
      return handleError({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı veya aktif değil',
      })
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        // Also verify email if not already verified
        emailVerified: new Date(),
      },
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_CHANGED',
        action: 'Password reset completed',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    })
    
    return successResponse({ 
      message: 'Şifreniz başarıyla değiştirildi. Şimdi giriş yapabilirsiniz.' 
    })
  } catch (error) {
    return handleError(error)
  }
}