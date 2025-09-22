# Yarınki Görevler - Modern WebApp Projesi

**Tarih**: 14 Ocak 2025  
**Proje Durumu**: Kullanıcı yönetimi ve profil sistemleri tamamlandı

---

## 🔴 Yüksek Öncelikli Görevler

### 1. Aktivite Logları Sayfası (Backend Developer - Ahmet)
**Tahmini Süre**: 3-4 saat

- [ ] `/dashboard/activities` sayfasını oluştur
- [ ] API endpoint: `GET /api/activities` (tüm sistem aktiviteleri)
- [ ] Filtreleme: kullanıcı, tarih aralığı, aktivite tipi
- [ ] Pagination ve arama özelliği
- [ ] Aktivite detay modalı
- [ ] Export özelliği (CSV)

### 2. Dashboard Ana Sayfa Geliştirmeleri (Frontend Developer - Ayşe)
**Tahmini Süre**: 4-5 saat

- [ ] Gerçek istatistik kartları (API bağlantısı)
- [ ] Son 7 günlük kullanıcı grafiği (Chart.js veya Recharts)
- [ ] Aktif kullanıcılar widgetı
- [ ] Son aktiviteler listesi (gerçek veri)
- [ ] Hızlı eylem butonları için modal'lar

### 3. Auth Sayfaları (Full Stack Developer - Mehmet)
**Tahmini Süre**: 3-4 saat

- [ ] `/auth/forgot-password` sayfası
- [ ] `/auth/reset-password/[token]` sayfası
- [ ] `/auth/verify-email/[token]` sayfası
- [ ] Success/error state'leri
- [ ] Otomatik yönlendirmeler

---

## 🟡 Orta Öncelikli Görevler

### 4. Bildirim Sistemi (Backend Developer - Ahmet)
**Tahmini Süre**: 4-5 saat

- [ ] Notification model (Prisma schema)
- [ ] API endpoints (list, mark as read, delete)
- [ ] Real-time notifications (Socket.io veya Pusher)
- [ ] Header'da bildirim ikonu ve dropdown
- [ ] Unread count badge

### 5. Bulk Operations (Frontend Developer - Ayşe)
**Tahmini Süre**: 2-3 saat

- [ ] Kullanıcılar tablosunda checkbox column
- [ ] Toplu seçim toolbarı
- [ ] Bulk actions: Delete, Change Status, Change Role
- [ ] Confirmation dialog
- [ ] Progress indicator

---

## 🟢 Düşük Öncelikli Görevler

### 6. Import/Export Özelliği (Full Stack Developer - Mehmet)
**Tahmini Süre**: 3-4 saat

- [ ] CSV export endpoint
- [ ] Excel export (xlsx paketi)
- [ ] CSV import with validation
- [ ] Import preview modal
- [ ] Error handling ve rapor

### 7. Avatar Yükleme (Backend Developer - Ahmet)
**Tahmini Süre**: 2-3 saat

- [ ] Cloudinary veya S3 entegrasyonu
- [ ] Upload endpoint
- [ ] File validation (type, size)
- [ ] Profil sayfasında upload UI
- [ ] Crop/resize özelliği

---

## 📋 Teknik Notlar

### API Endpoint'leri Özeti
```
# Mevcut
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
GET    /api/roles
GET    /api/auth/me
PATCH  /api/auth/me
POST   /api/auth/me/password
GET    /api/auth/sessions
DELETE /api/auth/sessions/:id
GET    /api/auth/activities

# Yarın Eklenecek
GET    /api/activities
GET    /api/dashboard/stats
GET    /api/notifications
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id
POST   /api/users/bulk
GET    /api/users/export
POST   /api/users/import
POST   /api/upload/avatar
```

### Kullanılacak Paketler
- **Grafikler**: `recharts` veya `chart.js`
- **Excel**: `xlsx`
- **Real-time**: `socket.io-client` veya `pusher-js`
- **File upload**: `react-dropzone`
- **Image crop**: `react-image-crop`

### Test Senaryoları
1. Aktivite loglarının doğru filtrelenmesi
2. Dashboard istatistiklerinin doğruluğu
3. Bulk operations'da yetki kontrolü
4. Import validation hata mesajları
5. Real-time bildirimlerin çalışması

---

## 👥 Ekip İletişim

- **Saat 09:00**: Stand-up meeting - Günlük görev dağılımı
- **Saat 13:00**: Progress check - Durum değerlendirmesi
- **Saat 17:00**: Code review - Merge request'leri

### Branch Stratejisi
```bash
# Feature branch oluşturma
git checkout -b feature/activity-logs
git checkout -b feature/dashboard-stats
git checkout -b feature/auth-pages

# Main'e merge öncesi
git pull origin main
git rebase main
```

---

## ⚠️ Dikkat Edilecekler

1. **Performance**: Büyük veri setlerinde pagination kullan
2. **Security**: Tüm endpoint'lerde yetki kontrolü
3. **UX**: Loading ve error state'leri unutma
4. **Responsive**: Mobile uyumluluğu test et
5. **Documentation**: Her yeni özellik için DEVELOPMENT-LOG güncelle

---

**Bugün Tamamlanan Özellikler**:
- ✅ Veritabanı entegrasyonu (PostgreSQL + Prisma)
- ✅ Gerçek authentication sistemi
- ✅ Kullanıcı yönetim paneli (CRUD)
- ✅ Role-based access control
- ✅ Email sistemi (davet, şifre sıfırlama)
- ✅ Kullanıcı profil sayfası

**Proje Tamamlanma**: %60

---

*Son güncelleme: 13 Ocak 2025 - 18:45*