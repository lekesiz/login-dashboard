import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Token types
export enum TokenType {
  INVITE = 'INVITE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

// Token expiry durations (in milliseconds)
const TOKEN_EXPIRY = {
  [TokenType.INVITE]: 7 * 24 * 60 * 60 * 1000, // 7 days
  [TokenType.PASSWORD_RESET]: 60 * 60 * 1000, // 1 hour
  [TokenType.EMAIL_VERIFICATION]: 24 * 60 * 60 * 1000, // 24 hours
}

// Generate a secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create and save a verification token
export async function createVerificationToken(
  identifier: string,
  type: TokenType
): Promise<string> {
  const token = generateToken()
  const expires = new Date(Date.now() + TOKEN_EXPIRY[type])
  
  // Delete any existing tokens for this identifier
  await prisma.verificationToken.deleteMany({
    where: { identifier },
  })
  
  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  })
  
  return token
}

// Verify and consume a token
export async function verifyToken(
  token: string
): Promise<{ identifier: string } | null> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })
  
  if (!verificationToken) {
    return null
  }
  
  // Check if token is expired
  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    })
    return null
  }
  
  // Token is valid, delete it (one-time use)
  await prisma.verificationToken.delete({
    where: { token },
  })
  
  return { identifier: verificationToken.identifier }
}

// Create invite token for a user
export async function createInviteToken(userId: string): Promise<string> {
  return createVerificationToken(`invite:${userId}`, TokenType.INVITE)
}

// Create password reset token for a user
export async function createPasswordResetToken(userId: string): Promise<string> {
  return createVerificationToken(`reset:${userId}`, TokenType.PASSWORD_RESET)
}

// Create email verification token for a user
export async function createEmailVerificationToken(userId: string): Promise<string> {
  return createVerificationToken(`verify:${userId}`, TokenType.EMAIL_VERIFICATION)
}

// Get user ID from token identifier
export function getUserIdFromIdentifier(identifier: string): string | null {
  const parts = identifier.split(':')
  return parts.length === 2 ? parts[1] : null
}