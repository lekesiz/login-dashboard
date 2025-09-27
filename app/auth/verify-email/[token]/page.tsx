'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const params = useParams<{ token: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!params.token) {
        setError('Geçersiz doğrulama linki')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${params.token}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Email doğrulama başarısız')
        }

        setIsSuccess(true)
        setUserName(result.userName || '')
        
        // Redirect to login after 5 seconds
        setTimeout(() => {
          router.push('/login')
        }, 5000)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [params.token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
          {isLoading ? (
            <div className="text-center">
              <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Doğrulanıyor...
              </h1>
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
              <p className="mt-4 text-sm text-gray-600">
                Lütfen bekleyin, email adresiniz doğrulanıyor.
              </p>
            </div>
          ) : isSuccess ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Doğrulandı!
              </h1>
              <p className="text-gray-600 mb-6">
                {userName && `Tebrikler ${userName}, `}
                email adresiniz başarıyla doğrulandı.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-green-900 mb-2">
                  Artık şunları yapabilirsiniz:
                </h2>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>✓ Hesabınıza tam erişim</li>
                  <li>✓ Şifre sıfırlama özelliği</li>
                  <li>✓ Email bildirimleri</li>
                  <li>✓ Güvenlik güncellemeleri</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                5 saniye içinde giriş sayfasına yönlendirileceksiniz...
              </p>

              <Link
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Hemen giriş yap
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Doğrulama Başarısız
              </h1>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">
                  Doğrulama linki geçersiz veya süresi dolmuş olabilir.
                  Lütfen yeni bir doğrulama emaili talep edin.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Giriş Sayfasına Git
                </Link>
                
                <Link
                  href="/auth/resend-verification"
                  className="block w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors text-center"
                >
                  Yeni Doğrulama Emaili Gönder
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}