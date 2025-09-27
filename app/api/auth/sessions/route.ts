import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'

// GET /api/auth/sessions - Get current user's sessions
export async function GET(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const sessions = await prisma.session.findMany({
        where: { 
          userId: session.user.id,
          expires: {
            gte: new Date(), // Only active sessions
          },
        },
        orderBy: { expires: 'desc' },
        select: {
          id: true,
          sessionToken: true,
          expires: true,
        },
      })
      
      // Mark current session
      const currentSessionToken = request.cookies.get('authjs.session-token')?.value ||
                                 request.cookies.get('__Secure-authjs.session-token')?.value
      
      const sessionsWithCurrent = sessions.map(s => ({
        ...s,
        isCurrent: s.sessionToken === currentSessionToken,
      }))
      
      return successResponse(sessionsWithCurrent)
    } catch (error) {
      return handleError(error)
    }
  })
}

// DELETE /api/auth/sessions/:id - Revoke a session
export async function DELETE(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      const url = new URL(request.url)
      const sessionId = url.pathname.split('/').pop()
      
      if (!sessionId) {
        return handleError({
          code: 'INVALID_REQUEST',
          message: 'Session ID required',
        })
      }
      
      // Check if session belongs to user
      const targetSession = await prisma.session.findFirst({
        where: {
          id: sessionId,
          userId: session.user.id,
        },
      })
      
      if (!targetSession) {
        return handleError({ code: 'P2025' })
      }
      
      // Don't allow revoking current session
      const currentSessionToken = request.cookies.get('authjs.session-token')?.value ||
                                 request.cookies.get('__Secure-authjs.session-token')?.value
      
      if (targetSession.sessionToken === currentSessionToken) {
        return handleError({
          code: 'INVALID_REQUEST',
          message: 'Cannot revoke current session. Use logout instead.',
        })
      }
      
      // Delete session
      await prisma.session.delete({
        where: { id: sessionId },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'USER_UPDATED',
          action: 'Revoked session',
          details: JSON.stringify({ sessionId }),
        },
      })
      
      return successResponse({ message: 'Session revoked successfully' })
    } catch (error) {
      return handleError(error)
    }
  })
}