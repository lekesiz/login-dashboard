'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api-client'
import { formatDate } from '@/lib/utils'
import { Globe, LogOut, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'

interface Session {
  id: string
  sessionToken: string
  expires: string
  isCurrent?: boolean
}

export default function SessionsSection() {
  const queryClient = useQueryClient()

  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: authApi.getSessions,
  })

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Oturumlar yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Aktif Oturumlar
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Hesabınızda açık olan tüm oturumları görüntüleyin ve yönetin.
      </p>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session: Session) => {
            return (
              <div
                key={session.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Globe className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          Web Oturumu
                        </h4>
                        {session.isCurrent && (
                          <Badge variant="info">
                            Mevcut Oturum
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Sona erme: {formatDate(session.expires)}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeMutation.mutate(session.id)}
                      isLoading={revokeMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Kapat
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Aktif oturum bulunamadı
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          Güvenlik Tavsiyesi
        </h4>
        <p className="text-sm text-blue-700">
          Eğer tanımadığınız bir oturum görüyorsanız, hemen kapatın ve şifrenizi değiştirin.
        </p>
      </div>
    </div>
  )
}