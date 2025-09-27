import axios from 'axios'
import type { ActivityWithUser } from '@/types/activity'

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.error?.message || 'Bir hata oluştu'
    throw new Error(message)
  }
)

// Export api with response.data already extracted
export const api = axiosInstance as {
  get<T = unknown>(url: string, config?: object): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: object): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: object): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: object): Promise<T>
  delete<T = unknown>(url: string, config?: object): Promise<T>
}

// User API functions
export const userApi = {
  getUsers: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    role?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    return api.get<{
      data: Array<{
        id: string
        email: string
        name: string
        avatar: string | null
        status: string
        emailVerified: Date | null
        createdAt: string
        lastLogin: string | null
        role: {
          id: string
          name: string
          displayName: string
        }
        invitedByUser: {
          id: string
          name: string
        } | null
        _count: {
          activities: number
        }
      }>
      meta: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/users', { params })
  },

  getUser: (id: string) => {
    return api.get<{
      id: string
      email: string
      name: string
      avatar?: string | null
      status: string
      emailVerified: Date | string | null
      createdAt: Date | string
      updatedAt: Date | string
      lastLogin: Date | string | null
      role: {
        id: string
        name: string
        displayName: string
        description?: string | null
        permissions: Array<{
          id: string
          name: string
          description?: string | null
        }>
      }
      invitedByUser?: {
        id: string
        name: string
        email: string
      } | null
      invitedUsers: Array<{
        id: string
        name: string
        email: string
        status: string
      }>
      activities: Array<{
        id: string
        type: string
        action: string
        createdAt: Date | string
      }>
      _count: {
        activities: number
        sessions: number
      }
    }>(`/users/${id}`)
  },

  createUser: (data: {
    email: string
    name: string
    roleId: string
    password?: string
    sendInvite?: boolean
  }) => {
    return api.post<{
      user: {
        id: string
        email: string
        name: string
        status: string
        role: {
          id: string
          name: string
          displayName: string
        }
      }
      temporaryPassword?: string
    }>('/users', data)
  },

  updateUser: (id: string, data: Partial<{
    name: string
    email: string
    roleId: string
    status: string
  }>) => {
    return api.patch(`/users/${id}`, data)
  },

  deleteUser: (id: string) => {
    return api.delete(`/users/${id}`)
  },

  changePassword: (id: string, data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    return api.post(`/users/${id}/password`, data)
  },
}

// Role API functions
export const roleApi = {
  getRoles: () => {
    return api.get<Array<{
      id: string
      name: string
      displayName: string
      description?: string | null
      _count: {
        users: number
      }
    }>>('/roles')
  },
}

// Auth API functions
export const authApi = {
  getMe: () => {
    return api.get<{
      id: string
      email: string
      name: string
      avatar?: string | null
      status: string
      emailVerified: Date | string | null
      createdAt: Date | string
      lastLogin: Date | string | null
      role: {
        id: string
        name: string
        displayName: string
      }
      _count: {
        sessions: number
        activities: number
      }
    }>('/auth/me')
  },

  updateMe: (data: { name?: string; avatar?: string }) => {
    return api.patch('/auth/me', data)
  },

  changeMyPassword: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    return api.post('/auth/me/password', data)
  },

  getSessions: () => {
    return api.get<Array<{
      id: string
      sessionToken: string
      expires: string
      isCurrent?: boolean
    }>>('/auth/sessions')
  },

  revokeSession: (sessionId: string) => {
    return api.delete(`/auth/sessions/${sessionId}`)
  },

  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email })
  },

  resetPassword: (data: {
    token: string
    newPassword: string
    confirmPassword: string
  }) => {
    return api.post('/auth/reset-password', data)
  },

  verifyEmail: (token: string) => {
    return api.post('/auth/verify-email', { token })
  },

  logout: () => {
    return api.post('/auth/logout')
  },

  logFailedLogin: (email: string) => {
    return api.post('/auth/failed-login', { email })
  },
}

// Activity API functions
export const activityApi = {
  getActivities: (params?: {
    page?: number
    limit?: number
    userId?: string
    type?: string
    dateFrom?: string
    dateTo?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    return api.get<{
      data: ActivityWithUser[]
      meta: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/activities', { params })
  },

  getUserStats: (userId: string, days?: number) => {
    return api.get('/activities/stats', {
      params: { userId, days: days || 30 }
    })
  },
}