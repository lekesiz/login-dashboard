# Veritabanı Entegrasyonu Rehberi

## Mevcut Durum
Şu anda uygulama demo kullanıcı ile çalışıyor (hardcoded). Gerçek bir veritabanı entegrasyonu için aşağıdaki adımları takip edin.

## Önerilen Stack
- **ORM**: Prisma (TypeScript desteği mükemmel)
- **Database**: PostgreSQL (production için) veya SQLite (development için)

## Kurulum Adımları

### 1. Prisma Kurulumu
```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Schema Tanımlama
`prisma/schema.prisma` dosyasını düzenleyin:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  activities    Activity[]
}

model Session {
  id            String    @id @default(cuid())
  sessionToken  String    @unique
  userId        String
  expires       DateTime
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Activity {
  id            String    @id @default(cuid())
  type          String
  description   String
  userId        String
  createdAt     DateTime  @default(now())
  user          User      @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
}
```

### 3. Veritabanı Migrasyonu
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Prisma Client Oluşturma
`lib/prisma.ts` dosyası oluşturun:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5. Auth.ts Güncelleme
`auth.ts` dosyasını güncelleyin:

```typescript
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// authorize fonksiyonunu güncelle
async authorize(credentials) {
  const parsedCredentials = credentialsSchema.safeParse(credentials)
  
  if (!parsedCredentials.success) {
    return null
  }

  const { email, password } = parsedCredentials.data

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) return null

  const passwordMatch = await bcrypt.compare(password, user.password)
  
  if (!passwordMatch) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
```

## Seed Data
`prisma/seed.ts` dosyası oluşturun:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      role: 'USER'
    }
  })
  
  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

`package.json` dosyasına ekleyin:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

## Kullanıcı Kayıt Sistemi

### 1. Kayıt API Route
`app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
})

export async function POST(request: Request) {
  const body = await request.json()
  
  const validation = registerSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }

  const { email, password, name } = validation.data

  // Check if user exists
  const exists = await prisma.user.findUnique({
    where: { email }
  })

  if (exists) {
    return NextResponse.json(
      { error: 'User already exists' },
      { status: 409 }
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  })
}
```

## Dashboard Verileri

Dashboard verilerini gerçek verilerle doldurmak için:

```typescript
// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [userCount, todayActivities] = await Promise.all([
    prisma.user.count(),
    prisma.activity.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ])

  return NextResponse.json({
    stats: {
      users: userCount,
      activities: todayActivities,
      revenue: 125450, // TODO: Gerçek veri
      growth: 23.5 // TODO: Hesapla
    }
  })
}
```

## Migration Komutları

```bash
# Yeni migration oluştur
npx prisma migrate dev --name migration_name

# Production'da migration çalıştır
npx prisma migrate deploy

# Veritabanını sıfırla (dikkatli!)
npx prisma migrate reset

# Seed data yükle
npx prisma db seed
```

## Önemli Notlar

1. `.env` dosyasına DATABASE_URL ekleyin
2. Production'da güçlü şifreler kullanın
3. Prisma Studio ile verileri görüntüleyebilirsiniz: `npx prisma studio`
4. Type safety için generated types'ları kullanın