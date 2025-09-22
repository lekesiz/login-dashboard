import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
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
    return api.get('/users', { params })
  },

  getUser: (id: string) => {
    return api.get(`/users/${id}`)
  },

  createUser: (data: {
    email: string
    name: string
    roleId: string
    password?: string
    sendInvite?: boolean
  }) => {
    return api.post('/users', data)
  },

  updateUser: (id: string, data: any) => {
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
    return api.get('/roles')
  },
}