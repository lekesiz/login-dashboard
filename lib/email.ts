import { Resend } from 'resend'
import { render } from '@react-email/render'
import UserInvitationEmail from '@/emails/user-invitation'
import PasswordResetEmail from '@/emails/password-reset'
import EmailVerificationEmail from '@/emails/email-verification'

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Default from email
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@example.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Generic email sender
async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.warn('Email service not configured - RESEND_API_KEY is missing')
    return { success: false, error: 'Email service not configured' }
  }
  
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    
    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Send user invitation email
export async function sendUserInvitationEmail({
  inviterName,
  inviteeName,
  inviteeEmail,
  temporaryPassword,
  inviteToken,
}: {
  inviterName: string
  inviteeName: string
  inviteeEmail: string
  temporaryPassword?: string
  inviteToken?: string
}) {
  const inviteLink = temporaryPassword
    ? `${APP_URL}/login`
    : `${APP_URL}/auth/accept-invite?token=${inviteToken}`
    
  const html = await render(
    UserInvitationEmail({
      inviterName,
      inviteeName,
      inviteeEmail,
      temporaryPassword,
      inviteLink,
    })
  )
  
  return sendEmail({
    to: inviteeEmail,
    subject: `${inviterName} sizi Modern WebApp'e davet etti`,
    html,
  })
}

// Send password reset email
export async function sendPasswordResetEmail({
  userName,
  userEmail,
  resetToken,
}: {
  userName: string
  userEmail: string
  resetToken: string
}) {
  const resetLink = `${APP_URL}/auth/reset-password/${resetToken}`
  const expiresIn = '1 saat'
  
  const html = await render(
    PasswordResetEmail({
      userName,
      resetLink,
      expiresIn,
    })
  )
  
  return sendEmail({
    to: userEmail,
    subject: 'Şifre Sıfırlama - Modern WebApp',
    html,
  })
}

// Send email verification email
export async function sendEmailVerificationEmail({
  userName,
  userEmail,
  verificationToken,
}: {
  userName: string
  userEmail: string
  verificationToken: string
}) {
  const verificationLink = `${APP_URL}/auth/verify-email/${verificationToken}`
  
  const html = await render(
    EmailVerificationEmail({
      userName,
      verificationLink,
    })
  )
  
  return sendEmail({
    to: userEmail,
    subject: 'Email Doğrulama - Modern WebApp',
    html,
  })
}

// Send welcome email after email verification
export async function sendWelcomeEmail({
  userName,
  userEmail,
}: {
  userName: string
  userEmail: string
}) {
  const html = `
    <h2>Hoş Geldiniz, ${userName}!</h2>
    <p>Email adresinizi doğruladığınız için teşekkür ederiz.</p>
    <p>Artık Modern WebApp'in tüm özelliklerinden yararlanabilirsiniz.</p>
    <p>İyi çalışmalar!</p>
  `
  
  return sendEmail({
    to: userEmail,
    subject: 'Hoş Geldiniz - Modern WebApp',
    html,
  })
}

// Email preview for development
export function getEmailPreviewUrl(template: 'invitation' | 'reset' | 'verification') {
  const baseUrl = 'http://localhost:3000/api/email/preview'
  return `${baseUrl}?template=${template}`
}