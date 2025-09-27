import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleError, successResponse } from '@/lib/api-helpers'
import { verifyToken, getUserIdFromIdentifier } from '@/lib/tokens'
import { sendWelcomeEmail } from '@/lib/email'

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token gereklidir'),
})

// GET /api/auth/verify-email - Verify email with token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    
    if (!token) {
      return handleError({
        code: 'MISSING_TOKEN',
        message: 'Token parametresi gereklidir',
      })
    }
    
    // Verify token
    const tokenData = await verifyToken(token)
    
    if (!tokenData) {
      return handleError({
        code: 'INVALID_TOKEN',
        message: 'Geçersiz veya süresi dolmuş token',
      })
    }
    
    // Get user ID from token identifier
    const userId = getUserIdFromIdentifier(tokenData.identifier)
    
    if (!userId || !tokenData.identifier.startsWith('verify:')) {
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
        emailVerified: true,
      },
    })
    
    if (!user) {
      return handleError({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      })
    }
    
    if (user.emailVerified) {
      return successResponse({ 
        message: 'Email adresiniz zaten doğrulanmış.',
        userName: user.name
      })
    }
    
    // Verify email
    await prisma.user.update({
      where: { id: userId },
      data: { 
        emailVerified: new Date(),
        status: 'ACTIVE', // Activate user if they were pending
      },
    })
    
    // Send welcome email
    await sendWelcomeEmail({
      userName: user.name,
      userEmail: user.email,
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'USER_UPDATED',
        action: 'Email verified',
      },
    })
    
    return successResponse({ 
      message: 'Email adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.',
      userName: user.name
    })
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/auth/verify-email - Verify email with token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = verifyEmailSchema.parse(body)
    
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
    
    if (!userId || !tokenData.identifier.startsWith('verify:')) {
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
        emailVerified: true,
      },
    })
    
    if (!user) {
      return handleError({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      })
    }
    
    if (user.emailVerified) {
      return successResponse({ 
        message: 'Email adresiniz zaten doğrulanmış.' 
      })
    }
    
    // Verify email
    await prisma.user.update({
      where: { id: userId },
      data: { 
        emailVerified: new Date(),
        status: 'ACTIVE', // Activate user if they were pending
      },
    })
    
    // Send welcome email
    await sendWelcomeEmail({
      userName: user.name,
      userEmail: user.email,
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'USER_UPDATED',
        action: 'Email verified',
      },
    })
    
    return successResponse({ 
      message: 'Email adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.' 
    })
  } catch (error) {
    return handleError(error)
  }
}