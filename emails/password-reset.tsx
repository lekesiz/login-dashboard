import { Button, Text } from '@react-email/components'
import { BaseEmailTemplate } from './base-template'

interface PasswordResetEmailProps {
  userName: string
  resetLink: string
  expiresIn: string
}

export default function PasswordResetEmail({
  userName,
  resetLink,
  expiresIn,
}: PasswordResetEmailProps) {
  return (
    <BaseEmailTemplate
      preview="Şifre sıfırlama talebiniz"
      heading="Şifre Sıfırlama"
    >
      <Text style={paragraph}>
        Merhaba {userName},
      </Text>
      
      <Text style={paragraph}>
        Modern WebApp hesabınız için şifre sıfırlama talebinde bulundunuz. 
        Aşağıdaki butona tıklayarak yeni şifrenizi oluşturabilirsiniz.
      </Text>
      
      <div style={warningBox}>
        <Text style={warningText}>
          ⚠️ Bu link {expiresIn} içinde geçersiz olacaktır.
        </Text>
      </div>
      
      <div style={buttonContainer}>
        <Button href={resetLink} style={button}>
          Şifremi Sıfırla
        </Button>
      </div>
      
      <Text style={smallText}>
        Veya bu linki tarayıcınıza kopyalayın:
      </Text>
      <Text style={link}>{resetLink}</Text>
      
      <Text style={paragraph}>
        Eğer bu talebi siz yapmadıysanız, bu emaili güvenle silebilirsiniz. 
        Hesabınız güvende ve şifreniz değiştirilmemiştir.
      </Text>
      
      <Text style={securityNote}>
        🔒 Güvenlik İpucu: Şifrenizi kimseyle paylaşmayın ve güçlü bir şifre kullanın.
      </Text>
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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  padding: '12px 16px',
  margin: '24px 0',
}

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '600',
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

const securityNote = {
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  color: '#1e40af',
  fontSize: '14px',
  padding: '12px 16px',
  margin: '24px 0',
}