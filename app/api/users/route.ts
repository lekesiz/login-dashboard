import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  withRole, 
  handleError, 
  successResponse, 
  getPaginationParams,
  getSearchParams 
} from '@/lib/api-helpers'
import { createUserSchema } from '@/lib/validations/user'
import bcrypt from 'bcryptjs'
import { UserStatus } from '@prisma/client'

// GET /api/users - List users with pagination and filters
export async function GET(request: NextRequest) {
  return withRole(['admin', 'moderator'], async (session) => {
    try {
      const { page, limit, skip } = getPaginationParams(request)
      const { search, status, role, sortBy, sortOrder } = getSearchParams(request)
      
      // Build where clause
      const where: any = {}
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }
      
      if (status) {
        where.status = status as UserStatus
      }
      
      if (role) {
        where.role = { name: role }
      }
      
      // Get total count
      const total = await prisma.user.count({ where })
      
      // Get users
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          lastLogin: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
          invitedByUser: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      })
      
      return successResponse(users, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      return handleError(error)
    }
  })
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  return withRole(['admin'], async (session) => {
    try {
      const body = await request.json()
      const validatedData = createUserSchema.parse(body)
      
      // Generate password or use provided one
      const password = validatedData.password || generateRandomPassword()
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          password: hashedPassword,
          roleId: validatedData.roleId,
          status: validatedData.sendInvite ? UserStatus.PENDING : UserStatus.ACTIVE,
          invitedBy: session.user.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
      })
      
      // Log activity
      await prisma.activity.create({
        data: {
          userId: session.user.id,
          type: 'USER_CREATED',
          action: `Created user: ${user.name}`,
          details: { createdUserId: user.id },
        },
      })
      
      // TODO: Send invite email if sendInvite is true
      if (validatedData.sendInvite) {
        // Email implementation will be added later
      }
      
      return successResponse({
        user,
        temporaryPassword: validatedData.sendInvite ? undefined : password,
      })
    } catch (error) {
      return handleError(error)
    }
  })
}

function generateRandomPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}