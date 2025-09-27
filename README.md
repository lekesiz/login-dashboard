# Modern WebApp

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş profesyonel bir web uygulamasıdır. Full-stack Next.js 15 uygulaması olarak geliştirilmiş, kullanıcı yönetimi, aktivite takibi ve dashboard özellikleri içeren kurumsal seviye bir web platformudur.

## 🚀 Özellikler

### Authentication & Authorization
- ✅ NextAuth.js v5 ile güvenli kimlik doğrulama
- ✅ JWT token bazlı session yönetimi
- ✅ Role-based access control (Admin, User, Moderator)
- ✅ Şifre sıfırlama ve email doğrulama
- ✅ Güvenli logout ve session yönetimi

### Dashboard & Analytics
- ✅ Gerçek zamanlı istatistikler ve grafikler
- ✅ Kullanıcı büyüme trendi (Recharts)
- ✅ Aktivite takip ve loglama sistemi
- ✅ Son aktiviteler feed'i
- ✅ Hızlı eylem butonları

### Kullanıcı Yönetimi
- ✅ Kullanıcı CRUD işlemleri
- ✅ Rol ve durum yönetimi
- ✅ Kullanıcı profil sayfası
- ✅ Session yönetimi ve güvenlik ayarları
- ✅ Aktivite geçmişi görüntüleme

### Teknik Özellikler
- ✅ TypeScript ile %100 tip güvenliği
- ✅ Prisma ORM ile veritabanı yönetimi
- ✅ PostgreSQL veritabanı desteği
- ✅ Responsive tasarım (Mobile-first)
- ✅ SEO optimizasyonu
- ✅ Email entegrasyonu (Resend)
- ✅ Form validation (React Hook Form + Zod)
- ✅ Loading states ve error handling
- ✅ IP adresi ve User Agent takibi

## 🛠️ Teknoloji Stack'i

### Frontend
- **Next.js 15.5.3** - React framework (App Router)
- **React 19.1.0** - UI library
- **TypeScript 5** - Tip güvenli JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Recharts** - Grafik ve veri görselleştirme
- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation
- **Lucide Icons** - Modern ikon seti
- **Tanstack Query** - Data fetching ve caching
- **Tanstack Table** - Gelişmiş tablo bileşeni

### Backend
- **NextAuth.js v5** - Authentication çözümü
- **Prisma ORM** - Veritabanı ORM
- **PostgreSQL** - İlişkisel veritabanı
- **bcryptjs** - Şifre hashleme
- **Resend** - Email gönderimi
- **React Email** - Email template'leri

### Development
- **ESLint** - Kod kalite kontrolü
- **Prettier** - Kod formatlama
- **TypeScript** - Statik tip kontrolü

## 📦 Kurulum

### Gereksinimler
- Node.js 18.17 veya üzeri
- PostgreSQL veritabanı
- npm veya yarn paket yöneticisi

### Adım Adım Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/lekesiz/modern-webapp.git
cd modern-webapp
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
```

3. **Environment variables'ları ayarlayın:**
```bash
cp .env.example .env.local
```

4. **`.env.local` dosyasını düzenleyin:**
```env
# Authentication Secret (openssl rand -base64 32)
AUTH_SECRET=your-auth-secret-here-please-change-in-production
AUTH_TRUST_HOST=true

# Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/modern_webapp"

# Email Configuration (Resend)
RESEND_API_KEY=re_XXXXXXXXXX
EMAIL_FROM=noreply@yourdomain.com

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Veritabanını hazırlayın:**
```bash
# Veritabanı şemasını oluştur
npx prisma db push

# Seed verilerini yükle (opsiyonel)
npx prisma db seed
```

6. **Development server'ı başlatın:**
```bash
npm run dev
# veya
yarn dev
```

Proje http://localhost:3000 adresinde çalışacaktır.

### Demo Kullanıcılar

Seed verileri yüklendiyse:
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123
- **Demo:** demo@example.com / demo123

## 🧪 Test ve Geliştirme

### Komutlar
```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Prisma Studio (Veritabanı GUI)
npm run db:studio
```

### API Endpoints

#### Authentication
- `POST /api/auth/callback/credentials` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Şifre sıfırlama talebi
- `POST /api/auth/reset-password` - Şifre sıfırlama
- `GET /api/auth/verify-email` - Email doğrulama
- `POST /api/auth/resend-verification` - Doğrulama emaili tekrar gönder

#### Users
- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/users/:id` - Kullanıcı detayı
- `PATCH /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil

#### Dashboard
- `GET /api/dashboard/stats` - Dashboard istatistikleri
- `GET /api/activities` - Aktivite logları
- `GET /api/activities/stats` - Aktivite istatistikleri

#### Profile
- `GET /api/auth/me` - Kullanıcı bilgileri
- `PATCH /api/auth/me` - Profil güncelle
- `POST /api/auth/me/password` - Şifre değiştir
- `GET /api/auth/sessions` - Aktif sessionlar
- `DELETE /api/auth/sessions/:id` - Session sonlandır

## 🌐 Deployment

### Vercel Deployment

1. **GitHub'a Push:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Vercel'e Deploy:**
- [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
- "New Project" tıklayın
- GitHub reposunu seçin
- Environment variables ekleyin
- "Deploy" tıklayın

### Environment Variables (Production)
```env
AUTH_SECRET=<güçlü-secret-key>
AUTH_TRUST_HOST=true
DATABASE_URL=<production-database-url>
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Netlify Deployment

1. `netlify.toml` dosyası projede mevcut
2. Netlify Dashboard'dan "New site from Git" seçin
3. Environment variables ekleyin
4. Deploy edin

## 🔒 Güvenlik

- Şifreler bcrypt ile hashleniyor (salt rounds: 10)
- JWT token bazlı session yönetimi
- CSRF koruması NextAuth tarafından sağlanıyor
- SQL injection koruması (Prisma ORM)
- XSS koruması (React otomatik escape)
- Rate limiting önerilir (production için)
- Environment variables güvenli saklanmalı

## 📊 Performans

- Server Components kullanımı
- Otomatik code splitting
- Image optimization
- Font optimization
- Lazy loading
- React Query ile veri caching
- Database indexleri optimize edildi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Geliştiriciler

- **Proje Yönetimi:** Claude Code Assistant
- **Backend Development:** Ollama qwen2.5-coder:32b
- **Frontend Development:** Ollama deepseek-coder:33b
- **Auth Systems:** Ollama gpt-oss:120b
- **Quality Assurance:** Ollama qwen3:30b
- **DevOps:** Ollama gemma3:27b

---

**Son Güncelleme:** 14 Ocak 2025