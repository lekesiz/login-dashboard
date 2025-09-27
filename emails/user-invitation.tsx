import { Button, Text } from '@react-email/components'
import { BaseEmailTemplate } from './base-template'

interface UserInvitationEmailProps {
  inviterName: string
  inviteeName: string
  inviteeEmail: string
  temporaryPassword?: string
  inviteLink: string
}

export default function UserInvitationEmail({
  inviterName,
  inviteeName,
  inviteeEmail,
  temporaryPassword,
  inviteLink,
}: UserInvitationEmailProps) {
  return (
    <BaseEmailTemplate
      preview={`${inviterName} sizi Modern WebApp'e davet etti`}
      heading="Modern WebApp'e Davet Edildiniz!"
    >
      <Text style={paragraph}>
        Merhaba {inviteeName},
      </Text>
      
      <Text style={paragraph}>
        {inviterName} sizi Modern WebApp platformuna davet etti. Hesabınız oluşturuldu ve kullanıma hazır.
      </Text>
      
      <Text style={paragraph}>
        <strong>Giriş Bilgileriniz:</strong>
      </Text>
      
      <div style={codeBox}>
        <Text style={codeText}>
          Email: {inviteeEmail}
        </Text>
        {temporaryPassword && (
          <Text style={codeText}>
            Geçici Şifre: {temporaryPassword}
          </Text>
        )}
      </div>
      
      <Text style={paragraph}>
        {temporaryPassword 
          ? 'İlk girişinizde şifrenizi değiştirmeniz istenecektir.'
          : 'Giriş yapmak için aşağıdaki butona tıklayın ve şifrenizi oluşturun.'
        }
      </Text>
      
      <div style={buttonContainer}>
        <Button href={inviteLink} style={button}>
          {temporaryPassword ? 'Giriş Yap' : 'Şifre Oluştur ve Giriş Yap'}
        </Button>
      </div>
      
      <Text style={smallText}>
        Veya bu linki tarayıcınıza kopyalayın:
      </Text>
      <Text style={link}>{inviteLink}</Text>
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

const codeBox = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
}

const codeText = {
  color: '#111827',
  fontSize: '14px',
  fontFamily: 'monospace',
  margin: '4px 0',
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