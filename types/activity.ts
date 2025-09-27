import { Activity, ActivityType, User } from '@prisma/client'

export interface ActivityWithUser extends Activity {
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>
}

export interface ActivityFiltersQuery {
  userId?: string
  type?: ActivityType
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ActivityResponse {
  activities: ActivityWithUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ActivityStatsResponse {
  byType: Record<ActivityType, number>
  dailyCount: number
  totalCount: number
}

// Activity detail types for different actions
export interface UserCreatedDetails {
  createdUserId: string
}

export interface UserUpdatedDetails {
  updatedUserId: string
  changes: Record<string, unknown>
}

export interface PasswordChangedDetails {
  userId: string
}

export interface RoleChangedDetails {
  userId: string
  oldRole: string
  newRole: string
}

export interface LoginDetails {
  provider?: string
  success: boolean
}

export type ActivityDetails =
  | UserCreatedDetails
  | UserUpdatedDetails
  | PasswordChangedDetails
  | RoleChangedDetails
  | LoginDetails
  | Record<string, unknown>