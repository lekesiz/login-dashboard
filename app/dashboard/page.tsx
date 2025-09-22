import { auth } from '@/auth'
import { TrendingUp, Users, ShoppingCart, DollarSign, FileText, Package, Settings } from 'lucide-react'

const stats = [
  { label: 'Toplam Gelir', value: '₺125,450', change: '+15.3%', icon: DollarSign, color: 'bg-blue-500' },
  { label: 'Kullanıcılar', value: '2,543', change: '+12.5%', icon: Users, color: 'bg-green-500' },
  { label: 'Siparişler', value: '346', change: '+8.2%', icon: ShoppingCart, color: 'bg-purple-500' },
  { label: 'Büyüme Oranı', value: '%23.5', change: '+4.1%', icon: TrendingUp, color: 'bg-orange-500' },
]

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldin, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-gray-600 mt-1">İşte bugünkü özet bilgilerin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yeni kullanıcı kaydı</p>
                    <p className="text-xs text-gray-500">2 saat önce</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Eylemler</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-6 w-6 text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Kullanıcı Ekle</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="h-6 w-6 text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Rapor Oluştur</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="h-6 w-6 text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Ürün Ekle</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-6 w-6 text-gray-600 mb-2" />
              <p className="text-sm font-medium text-gray-700">Ayarlar</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}