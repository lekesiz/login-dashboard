import { NextRequest } from 'next/server'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'
import { ActivityService } from '@/lib/services/activity.service'
import { signOut } from '@/auth'

// POST /api/auth/logout - Log out current user
export async function POST(request: NextRequest) {
  return withAuth(async (session) => {
    try {
      // Log activity before signing out
      await ActivityService.logFromRequest(
        request,
        session.user.id,
        'AUTH_LOGOUT',
        'User logged out'
      )
      
      // Sign out the user
      await signOut()
      
      return successResponse({ message: 'Logged out successfully' })
    } catch (error) {
      return handleError(error)
    }
  })
}