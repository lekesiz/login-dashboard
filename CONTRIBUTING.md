# Katkıda Bulunma Rehberi

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/lekesiz/login-dashboard.git
cd login-dashboard
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env.local` dosyası oluşturun:
```env
AUTH_SECRET=your-auth-secret-here-please-change-in-production
AUTH_TRUST_HOST=true
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📁 Kod Yapısı

### Önemli Dosyalar
- `auth.ts` - Kimlik doğrulama mantığı
- `middleware.ts` - Route koruması
- `app/dashboard/*` - Dashboard sayfaları
- `app/login/page.tsx` - Login sayfası

### Yeni Sayfa Ekleme
Dashboard'a yeni sayfa eklemek için:

1. `app/dashboard/yeni-sayfa/page.tsx` oluşturun
2. `app/dashboard/components/sidebar.tsx` dosyasına menü öğesi ekleyin

Örnek:
```typescript
// app/dashboard/products/page.tsx
export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Ürünler</h1>
      {/* Sayfa içeriği */}
    </div>
  )
}
```

## 🔐 Authentication

### Mevcut Sistem
- Demo kullanıcı hardcoded: `demo@example.com` / `demo123`
- Gerçek veritabanı entegrasyonu gerekli

### Veritabanı Entegrasyonu İçin
1. Prisma veya Drizzle ORM ekleyin
2. User model oluşturun
3. `auth.ts` dosyasındaki `authorize` fonksiyonunu güncelleyin

## 🎨 UI/UX Kuralları

### Tasarım Prensipleri
- Tailwind CSS utility classes kullanın
- Lucide Icons kullanın
- Responsive tasarım zorunlu
- Dark mode desteği eklenebilir

### Renk Paleti
- Primary: Blue (blue-600)
- Success: Green (green-500)
- Warning: Orange (orange-500)
- Error: Red (red-600)
- Background: Gray (gray-50)

## 🧪 Test

### Manuel Test Checklist
- [ ] Login işlemi çalışıyor mu?
- [ ] Hatalı giriş mesajları gösteriliyor mu?
- [ ] Dashboard yükleniyor mu?
- [ ] Logout çalışıyor mu?
- [ ] Protected routes çalışıyor mu?

### Test Eklemek İçin
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📝 Commit Mesajları

Format:
```
<tip>: <kısa açıklama>

<detaylı açıklama (opsiyonel)>
```

Tipler:
- `feat`: Yeni özellik
- `fix`: Bug düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod yeniden düzenleme
- `test`: Test ekleme
- `chore`: Genel bakım

## 🚧 Yapılacaklar Listesi

### Yüksek Öncelik
- [ ] Gerçek veritabanı entegrasyonu
- [ ] Kullanıcı kayıt sistemi
- [ ] Email doğrulama
- [ ] Şifre sıfırlama

### Orta Öncelik
- [ ] Dashboard'da gerçek veriler
- [ ] API endpoints
- [ ] Role sistemi (admin, user)
- [ ] Dark mode

### Düşük Öncelik
- [ ] Çoklu dil desteği
- [ ] PWA desteği
- [ ] Analytics entegrasyonu

## 💡 İpuçları

1. **State Management**: Küçük uygulamalar için Context API yeterli, büyürse Zustand düşünülebilir
2. **API Routes**: `/app/api` klasörü altında oluşturun
3. **Database**: PostgreSQL + Prisma öneriyoruz
4. **Deployment**: Vercel en kolay seçenek

## 🐛 Bilinen Sorunlar

1. **Turbopack Uyarısı**: package.json'da turbopack kaldırıldı (uyumluluk için)
2. **Type Hatası**: Bazı NextAuth tipleri beta olduğu için değişebilir

## 📞 İletişim

Sorularınız için:
- GitHub Issues kullanın
- Pull Request açmaktan çekinmeyin

---

*Kolay gelsin! 🚀*