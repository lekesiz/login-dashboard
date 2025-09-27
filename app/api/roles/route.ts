import { prisma } from '@/lib/prisma'
import { withAuth, handleError, successResponse } from '@/lib/api-helpers'

// GET /api/roles - List all roles
export async function GET() {
  return withAuth(async () => {
    try {
      const roles = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      })
      
      return successResponse(roles)
    } catch (error) {
      return handleError(error)
    }
  })
}