# Kullanıcı Yönetimi - UI Mockup ve Detaylar

## 📱 Responsive Kullanıcı Listesi

### Desktop View (1200px+)
```
┌────────────────────────────────────────────────────────────────────┐
│ 👥 Kullanıcı Yönetimi                                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ [+ Yeni Kullanıcı] [📥 İçe Aktar] [📤 Dışa Aktar] [🔄 Yenile]    │
│                                                                    │
│ ┌─────────────────────────┬─────────────┬──────────┬────────┐   │
│ │ 🔍 Kullanıcı ara...     │ Rol: Tümü ▼ │ Durum ▼  │ Tarih ▼ │   │
│ └─────────────────────────┴─────────────┴──────────┴────────┘   │
│                                                                    │
│ □ Tümünü Seç  [Seçili: 0]  [🗑️ Toplu Sil] [📧 Toplu Email]       │
│                                                                    │
│ ┌──┬────────────┬─────────────────┬──────────┬────────┬─────────┐│
│ │□ │ Kullanıcı  │ Email           │ Rol      │ Durum  │ İşlemler││
│ ├──┼────────────┼─────────────────┼──────────┼────────┼─────────┤│
│ │□ │ 👤 Ali Veli│ ali@example.com │ 👑 Admin │ 🟢 Aktif│ ⋮       ││
│ │  │ Son giriş: │ ✅ Doğrulanmış   │          │        │         ││
│ │  │ 2 saat önce│                 │          │        │         ││
│ ├──┼────────────┼─────────────────┼──────────┼────────┼─────────┤│
│ │□ │ 👤 Ayşe Öz │ ayse@example.com│ 👤 User  │ 🟡 Bekle│ ⋮       ││
│ │  │ Son giriş: │ ⏳ Davet gönder. │          │ mede   │         ││
│ │  │ 5 gün önce │                 │          │        │         ││
│ ├──┼────────────┼─────────────────┼──────────┼────────┼─────────┤│
│ │□ │ 👤 Can Tan │ can@example.com │ 🛡️ Mod   │ 🔴 Pasif│ ⋮       ││
│ │  │ Son giriş: │ ❌ Doğrulanmamış │          │        │         ││
│ │  │ 30 gün önce│                 │          │        │         ││
│ └──┴────────────┴─────────────────┴──────────┴────────┴─────────┘│
│                                                                    │
│ Sayfa: [◀] [1] 2 3 4 5 ... 10 [▶]  Göster: [10 ▼] Toplam: 95    │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌─────────────────────┐
│ 👥 Kullanıcı (95)   │
├─────────────────────┤
│ [+] [📥] [📤] [🔄]  │
│ ┌─────────────────┐ │
│ │ 🔍 Ara...      │ │
│ └─────────────────┘ │
│ [Filtrele ▼]       │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ 👤 Ali Veli    │ │
│ │ 👑 Admin • 🟢   │ │
│ │ ali@example.com│ │
│ │ ✅ 2 saat önce  │ │
│ │ [Düzenle] [⋮]  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 👤 Ayşe Öz     │ │
│ │ 👤 User • 🟡    │ │
│ │ ayse@example.c │ │
│ │ ⏳ 5 gün önce   │ │
│ │ [Düzenle] [⋮]  │ │
│ └─────────────────┘ │
│                     │
│ [◀] 1/10 [▶]       │
└─────────────────────┘
```

## 🆕 Yeni/Düzenle Kullanıcı Modal

```
┌──────────────────────────────────────────┐
│       Yeni Kullanıcı Ekle         [✕]   │
├──────────────────────────────────────────┤
│                                          │
│ Temel Bilgiler                          │
│ ─────────────────                       │
│                                          │
│ Ad Soyad *                              │
│ ┌────────────────────────────────────┐  │
│ │ Örn: Ali Veli                     │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Email *                                 │
│ ┌────────────────────────────────────┐  │
│ │ ornek@email.com                   │  │
│ └────────────────────────────────────┘  │
│ ℹ️ Davet emaili bu adrese gönderilecek   │
│                                          │
│ Rol *                                   │
│ ┌────────────────────────────────────┐  │
│ │ Rol Seçin                      ▼  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ┌─┐ Kullanıcıya davet emaili gönder    │
│ └─┘ (Önerilen)                         │
│                                          │
│ ┌─┐ Geçici şifre oluştur               │
│ └─┘                                     │
│                                          │
│ Ek Ayarlar (Opsiyonel)                 │
│ ─────────────────────                   │
│                                          │
│ Departman                               │
│ ┌────────────────────────────────────┐  │
│ │ Seçin                          ▼  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Telefon                                 │
│ ┌────────────────────────────────────┐  │
│ │ +90 5XX XXX XX XX                 │  │
│ └────────────────────────────────────┘  │
│                                          │
│ ──────────────────────────────────────  │
│                                          │
│ [İptal]             [Kullanıcı Oluştur] │
└──────────────────────────────────────────┘
```

## 👤 Kullanıcı Detay Sayfası

```
┌─────────────────────────────────────────────────────────┐
│ ← Kullanıcı Listesi                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────┐   Ali Veli                                 │
│  │  👤    │   ali.veli@example.com                     │
│  │ AVATAR │   👑 Admin • 🟢 Aktif                       │
│  └────────┘   Katılım: 15 Ocak 2024                   │
│               Son Giriş: 2 saat önce                   │
│                                                         │
│  [✏️ Düzenle] [🔒 Şifre Sıfırla] [⏸️ Askıya Al] [🗑️ Sil] │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Profil Bilgileri │ Aktiviteler │ Oturumlar │ Loglar   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Email: ali.veli@example.com ✅                         │
│ Telefon: +90 555 123 4567                              │
│ Departman: Bilgi İşlem                                 │
│ Konum: İstanbul, Türkiye                               │
│ Dil: Türkçe                                            │
│                                                         │
│ Roller ve Yetkiler                                     │
│ ─────────────────                                      │
│ 👑 Admin                                                │
│   ✓ Kullanıcı yönetimi                                │
│   ✓ Sistem ayarları                                   │
│   ✓ Raporlara erişim                                  │
│                                                         │
│ İstatistikler                                          │
│ ─────────────                                          │
│ • Toplam oturum: 127                                   │
│ • Ortalama oturum süresi: 4.5 saat                    │
│ • Son 30 gün aktivite: 89 işlem                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 İşlem Menüsü (Action Menu)

```
┌─────────────────┐
│ ⋮ İşlemler      │
├─────────────────┤
│ 👁️ Görüntüle     │
│ ✏️ Düzenle       │
│ 🔒 Şifre Sıfırla │
│ 📧 Email Gönder  │
│ ─────────────── │
│ ⏸️ Askıya Al     │
│ 🗑️ Sil           │
└─────────────────┘
```

## 🎨 Renk Kodları ve İkonlar

### Durum Renkleri
- 🟢 Aktif: `#22c55e`
- 🟡 Beklemede: `#eab308`
- 🔴 Pasif/Askıda: `#ef4444`
- 🔵 Davetli: `#3b82f6`

### Rol İkonları
- 👑 Admin
- 🛡️ Moderator
- 👤 User
- 👥 Guest

### Durum Durumları
- ✅ Email Doğrulanmış
- ❌ Email Doğrulanmamış
- ⏳ Davet Gönderildi
- 🔒 Hesap Kilitli
- ⏸️ Askıya Alındı

## 📊 Dashboard Widget'ı

```
┌─────────────────────────────┐
│ 👥 Kullanıcı Özeti          │
├─────────────────────────────┤
│                             │
│ Toplam: 95                  │
│ ├─ 🟢 Aktif: 78            │
│ ├─ 🟡 Beklemede: 12        │
│ └─ 🔴 Pasif: 5             │
│                             │
│ Bu Ay Katılan: +15          │
│ Son 7 Gün Aktif: 67         │
│                             │
│ [Tümünü Gör →]              │
└─────────────────────────────┘
```

## 💡 UX İyileştirmeleri

1. **Bulk Actions**: Birden fazla kullanıcı seçildiğinde üst bar görünür
2. **Inline Edit**: Email ve telefon gibi basit alanlar inline düzenlenebilir
3. **Quick Filters**: Sık kullanılan filtreler için quick buttons
4. **Search Autocomplete**: Kullanıcı ararken autocomplete önerileri
5. **Drag & Drop**: Kullanıcıları gruplara sürükle-bırak ile atama
6. **Export Options**: PDF, CSV, Excel formatlarında export
7. **Real-time Updates**: WebSocket ile anlık güncellemeler
8. **Undo Action**: Silme işlemlerinde 5 saniyelik undo seçeneği

## 🔔 Bildirimler

```
┌────────────────────────────────┐
│ ✅ Kullanıcı başarıyla eklendi │
│    "Ali Veli" sisteme eklendi  │
│    [Geri Al] [Kapat]          │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⚠️ Dikkat!                     │
│ 3 kullanıcıyı silmek üzeresin │
│ Bu işlem geri alınamaz.       │
│ [İptal] [Evet, Sil]           │
└────────────────────────────────┘
```