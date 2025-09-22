# API Dokümantasyonu

## Authentication Endpoints

### POST /api/auth/signin
Kullanıcı girişi için kullanılır.

**Request Body:**
```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Response:**
- Success: Redirect to /dashboard
- Error: 401 Unauthorized

### POST /api/auth/signout
Kullanıcı çıkışı için kullanılır.

### GET /api/auth/session
Mevcut oturum bilgilerini döner.

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "demo@example.com",
    "name": "Demo User"
  },
  "expires": "2024-02-13T12:00:00.000Z"
}
```

## Planned API Endpoints

### Users API
```
GET    /api/users          # Tüm kullanıcıları listele
GET    /api/users/:id      # Tek kullanıcı detayı
POST   /api/users          # Yeni kullanıcı oluştur
PUT    /api/users/:id      # Kullanıcı güncelle
DELETE /api/users/:id      # Kullanıcı sil
```

### Dashboard Stats API
```
GET /api/dashboard/stats   # Dashboard istatistikleri
GET /api/dashboard/activities # Son aktiviteler
```

### Products API (Örnek)
```
GET    /api/products       # Ürün listesi
GET    /api/products/:id   # Ürün detayı
POST   /api/products       # Ürün ekle
PUT    /api/products/:id   # Ürün güncelle
DELETE /api/products/:id   # Ürün sil
```

## API Route Oluşturma

Yeni API route eklemek için:

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Veritabanından kullanıcıları getir
  const users = [] // TODO: Database query

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Validation
  // Database insert
  
  return NextResponse.json({ success: true })
}
```

## Error Responses

Standart error formatı:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## Rate Limiting

Gelecekte eklenecek. Önerilen kütüphane: `@vercel/kv` veya `rate-limiter-flexible`

## CORS Configuration

Gerekirse `middleware.ts` dosyasında yapılandırılabilir.