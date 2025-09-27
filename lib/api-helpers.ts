import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import type { Session } from 'next-auth'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function withAuth<T>(
  handler: (session: Session) => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      )
    }
    
    return handler(session)
  } catch (error) {
    return handleError(error)
  }
}

export async function withRole<T>(
  allowedRoles: string[],
  handler: (session: Session) => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  return withAuth(async (session) => {
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        },
        { status: 403 }
      )
    }
    
    return handler(session)
  })
}

export function handleError<T = unknown>(error: unknown): NextResponse<ApiResponse<T>> {
  console.error('API Error:', error)
  
  // Handle custom error objects
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const customError = error as { code: string; message: string }
    return NextResponse.json(
      {
        success: false,
        error: {
          code: customError.code,
          message: customError.message,
        },
      },
      { status: customError.code === 'NOT_FOUND' ? 404 : 
               customError.code === 'FORBIDDEN' ? 403 :
               customError.code === 'UNAUTHORIZED' ? 401 :
               customError.code === 'VALIDATION_ERROR' ? 400 : 500 }
    )
  }
  
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues,
        },
      },
      { status: 400 }
    )
  }
  
  if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this data already exists',
        },
      },
      { status: 409 }
    )
  }
  
  if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2025') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
        },
      },
      { status: 404 }
    )
  }
  
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  )
}

export function successResponse<T>(
  data: T,
  meta?: ApiResponse['meta']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  })
}

export function getPaginationParams(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSearchParams(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined
  const status = searchParams.get('status') || undefined
  const role = searchParams.get('role') || undefined
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  
  return { search, status, role, sortBy, sortOrder }
}