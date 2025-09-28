-- Update demo user password with correct hash for 'demo123'
UPDATE "User" 
SET password = '$2b$10$lvSZfx9aKlrCJ3dg0MkahuBBjVHvwuqEStI77Cf3mPpD7Uaq2BGhS'
WHERE email = 'demo@example.com';