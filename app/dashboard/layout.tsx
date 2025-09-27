import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from './components/sidebar'
import DashboardHeader from './components/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardHeader user={session.user} />
        <main className="py-6 px-8">
          {children}
        </main>
      </div>
    </div>
  )
}