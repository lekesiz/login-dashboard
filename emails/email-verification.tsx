import { Button, Text } from '@react-email/components'
import { BaseEmailTemplate } from './base-template'

interface EmailVerificationEmailProps {
  userName: string
  verificationLink: string
}

export default function EmailVerificationEmail({
  userName,
  verificationLink,
}: EmailVerificationEmailProps) {
  return (
    <BaseEmailTemplate
      preview="Email adresinizi doğrulayın"
      heading="Email Doğrulama"
    >
      <Text style={paragraph}>
        Merhaba {userName},
      </Text>
      
      <Text style={paragraph}>
        Modern WebApp&apos;e hoş geldiniz! Hesabınızı aktif hale getirmek için 
        lütfen email adresinizi doğrulayın.
      </Text>
      
      <div style={infoBox}>
        <Text style={infoText}>
          ✉️ Email doğrulaması, hesabınızın güvenliği için gereklidir.
        </Text>
      </div>
      
      <div style={buttonContainer}>
        <Button href={verificationLink} style={button}>
          Email Adresimi Doğrula
        </Button>
      </div>
      
      <Text style={smallText}>
        Veya bu linki tarayıcınıza kopyalayın:
      </Text>
      <Text style={link}>{verificationLink}</Text>
      
      <Text style={paragraph}>
        Email adresinizi doğruladıktan sonra tüm özelliklere erişim sağlayabilirsiniz.
      </Text>
      
      <div style={benefitsBox}>
        <Text style={benefitsTitle}>Doğrulama sonrası:</Text>
        <Text style={benefitItem}>✓ Şifre sıfırlama özelliği</Text>
        <Text style={benefitItem}>✓ Email bildirimleri</Text>
        <Text style={benefitItem}>✓ Güvenlik güncellemeleri</Text>
        <Text style={benefitItem}>✓ Tam platform erişimi</Text>
      </div>
    </BaseEmailTemplate>
  )
}

// Styles
const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const infoBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  padding: '12px 16px',
  margin: '24px 0',
}

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  margin: '0',
}

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const link = {
  color: '#2563eb',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  wordBreak: 'break-all' as const,
}

const benefitsBox = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
}

const benefitsTitle = {
  color: '#111827',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
}

const benefitItem = {
  color: '#374151',
  fontSize: '14px',
  margin: '4px 0',
}