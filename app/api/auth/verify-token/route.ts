import { NextRequest } from 'next/server'
import { handleError, successResponse } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

// GET /api/auth/verify-token - Verify if a token is valid
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
    
    // Check if token exists and is not expired
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })
    
    if (!verificationToken) {
      return handleError({
        code: 'INVALID_TOKEN',
        message: 'Geçersiz token',
      })
    }
    
    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return handleError({
        code: 'EXPIRED_TOKEN',
        message: 'Token süresi dolmuş',
      })
    }
    
    return successResponse({ 
      valid: true,
      message: 'Token geçerli' 
    })
  } catch (error) {
    return handleError(error)
  }
}