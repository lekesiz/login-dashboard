# Deployment Rehberi

## Netlify Deployment

### Hızlı Başlangıç
1. GitHub repo'nuzu Netlify'a bağlayın
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Environment variables ekleyin:
   ```
   AUTH_SECRET=<güvenli-bir-secret-key>
   AUTH_TRUST_HOST=true
   ```

### AUTH_SECRET Oluşturma
Terminal'de çalıştırın:
```bash
openssl rand -base64 32
```

### Bilinen Sorunlar ve Çözümler

#### 1. Edge Runtime Hatası
bcryptjs Edge Runtime'da çalışmadığı için demo için plain text şifre karşılaştırması yapılıyor. Production'da mutlaka veritabanı ve server-side hashing kullanın.

#### 2. ESLint Hataları
Build sırasında ESLint hatası alırsanız:
- TypeScript any tiplerini düzeltin
- Kullanılmayan değişkenleri kaldırın

## Vercel Deployment

### Hızlı Başlangıç
1. GitHub repo'nuzu Vercel'e import edin
2. Environment variables ekleyin
3. Deploy butonuna tıklayın

### Avantajlar
- Next.js'in yaratıcısı
- Otomatik optimizasyonlar
- Daha hızlı build süreleri

## Environment Variables

### Zorunlu
```env
AUTH_SECRET=your-secret-key-here
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://bilancompetence.netlify.app
```

**NOT**: NEXTAUTH_URL'i kendi domain'inize göre güncelleyin!

### Opsiyonel (gelecek özellikler için)
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Güvenlik Notları

1. **AUTH_SECRET**: Production'da mutlaka güçlü ve benzersiz bir key kullanın
2. **HTTPS**: Her zaman HTTPS kullanın
3. **Headers**: Güvenlik header'ları ekleyin (CSP, HSTS, vs.)

## Performance İyileştirmeleri

1. **Image Optimization**: Next.js Image component kullanın
2. **Font Optimization**: Google Fonts yerine next/font kullanın
3. **Bundle Size**: Kullanılmayan paketleri kaldırın

## Monitoring

Production'da monitoring için:
- Vercel Analytics
- Sentry (error tracking)
- LogRocket (session replay)