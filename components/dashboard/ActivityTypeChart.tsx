'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ActivityTypeChartProps {
  data: Array<{
    type: string
    count: number
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    LOGIN: 'Giriş Yapma',
    USER_CREATED: 'Kullanıcı Oluşturma',
    SETTINGS_UPDATED: 'Ayar Güncelleme',
    ROLE_CHANGED: 'Rol Değişikliği',
    LOGOUT: 'Çıkış Yapma'
  }
  return labels[type] || type
}

export function ActivityTypeChart({ data }: ActivityTypeChartProps) {
  const chartData = data.map(item => ({
    name: getActivityTypeLabel(item.type),
    value: item.count
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivite Dağılımı</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}