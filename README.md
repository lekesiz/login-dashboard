# Modern WebApp

Modern ve profesyonel bir web uygulaması. Next.js 14, TypeScript, Tailwind CSS ve NextAuth.js kullanılarak geliştirilmiştir.

## Özellikler

- 🔐 Güvenli kimlik doğrulama sistemi
- 📊 Modern dashboard arayüzü
- 🎨 Tailwind CSS ile responsive tasarım
- ⚡ Next.js 14 App Router
- 🔷 TypeScript desteği
- 🛡️ Protected routes (korumalı sayfalar)

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin

## Demo Kullanıcı

- **Email:** demo@example.com
- **Şifre:** demo123

## Proje Yapısı

```
modern-webapp/
├── app/
│   ├── api/auth/[...nextauth]/ # NextAuth API endpoints
│   ├── dashboard/               # Dashboard sayfaları
│   │   ├── components/         # Dashboard bileşenleri
│   │   ├── layout.tsx         # Dashboard layout
│   │   └── page.tsx           # Dashboard ana sayfa
│   ├── login/                  # Giriş sayfası
│   └── page.tsx               # Ana sayfa (redirect)
├── auth.ts                     # NextAuth konfigürasyonu
├── middleware.ts              # Route koruması
└── .env.local                 # Çevre değişkenleri
```

## Kullanılan Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js v5** - Kimlik doğrulama
- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation
- **Lucide Icons** - Modern ikonlar

## Geliştirme

Dashboard'u genişletmek için:

1. Yeni sayfalar `app/dashboard/` altına eklenebilir
2. Sidebar menüsü `app/dashboard/components/sidebar.tsx` dosyasından düzenlenebilir
3. Kimlik doğrulama mantığı `auth.ts` dosyasında bulunur

## Güvenlik

- Şifreler bcrypt ile hashlenir
- Session bazlı kimlik doğrulama
- Protected routes middleware ile korunur
- CSRF koruması NextAuth tarafından sağlanır
