# 🚀 Modern WebApp - Google Cloud Run Deployment

**Project ID:** `bilan-competence-449414`  
**Region:** `us-central1`  
**Service:** `modern-webapp`

---

## ⚡ Hızlı Deployment (Tek Komut)

```bash
# Deployment scriptini çalıştırın
./deploy-to-gcloud.sh
```

Bu script otomatik olarak:
- ✅ Cloud SQL PostgreSQL kurulumu yapar
- ✅ Güvenli şifreler oluşturur
- ✅ Container'ı build eder ve deploy eder
- ✅ Veritabanı migration'larını çalıştırır
- ✅ Test verilerini yükler

---

## 📋 Manuel Deployment Adımları

Eğer script çalışmazsa veya adım adım yapmak isterseniz:

### 1. Giriş ve Proje Ayarı
```bash
gcloud auth login
gcloud config set project bilan-competence-449414
```

### 2. Servisleri Etkinleştirin
```bash
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com  
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

### 3. Cloud SQL Kurulumu
```bash
# PostgreSQL instance oluştur
gcloud sql instances create modern-webapp-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Database oluştur
gcloud sql databases create modernwebapp \
  --instance=modern-webapp-db

# User oluştur (güvenli şifre ile)
gcloud sql users create dbuser \
  --instance=modern-webapp-db \
  --password=YOUR_SECURE_PASSWORD
```

### 4. Container Build & Deploy
```bash
# Container'ı build et
gcloud builds submit --tag gcr.io/bilan-competence-449414/modern-webapp .

# Cloud Run'a deploy et
gcloud run deploy modern-webapp \
  --image gcr.io/bilan-competence-449414/modern-webapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances bilan-competence-449414:us-central1:modern-webapp-db \
  --memory 512Mi \
  --port 3000
```

---

## 🧪 Local Docker Test

Deploy öncesi local test yapmak için:

```bash
# Build
docker build -t modern-webapp .

# Run (SQLite ile)
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e AUTH_SECRET="test-secret-for-local" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  modern-webapp
```

---

## 🔐 Güvenlik

Deployment sonrası yapılacaklar:

1. **Secret Manager'a hassas bilgileri taşıyın:**
```bash
# Database URL secret
echo -n "postgresql://dbuser:YOUR_PASSWORD@localhost/modernwebapp?host=/cloudsql/PROJECT:REGION:INSTANCE" | \
  gcloud secrets create database-url --data-file=-

# Auth secret  
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create auth-secret --data-file=-

# Service'i güncelle
gcloud run services update modern-webapp \
  --region us-central1 \
  --set-secrets "DATABASE_URL=database-url:latest,AUTH_SECRET=auth-secret:latest"
```

2. **Custom Domain ekleyin (opsiyonel):**
```bash
gcloud run domain-mappings create \
  --service modern-webapp \
  --domain your-domain.com \
  --region us-central1
```

---

## 📊 Monitoring & Logs

```bash
# Logları görüntüle
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=modern-webapp" --limit 50

# Metrics
gcloud run services describe modern-webapp --region us-central1

# Real-time logs
gcloud alpha run services logs tail modern-webapp --region us-central1
```

---

## 🎯 Deployment Sonrası

1. **URL'yi alın:**
```bash
gcloud run services describe modern-webapp \
  --region us-central1 \
  --format 'value(status.url)'
```

2. **Test edin:**
- Email: `demo@example.com`
- Password: `demo123`

3. **Admin paneline erişin:**
- Dashboard: `/dashboard`
- Users: `/dashboard/users`
- Activities: `/dashboard/activities`

---

## ❓ Troubleshooting

### Database bağlantı hatası
```bash
# Cloud SQL proxy connection test
gcloud sql connect modern-webapp-db --user=dbuser --database=modernwebapp
```

### Container build hatası
```bash
# Local build test
docker build -t test . --no-cache
```

### Permission hatası
```bash
# Service account permissions
gcloud projects add-iam-policy-binding bilan-competence-449414 \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/cloudsql.client"
```

---

## 🚨 Önemli Notlar

1. İlk deployment'ta `SEED_DATABASE=true` otomatik ayarlanır
2. Sonraki deployment'larda seed data tekrar yüklenmez
3. Production'da email servisi için Resend API key gerekli
4. Min instances = 0 (cost optimization), gerekirse 1 yapın

---

**Hazır! 🎉** Deployment script'ini çalıştırabilirsiniz: `./deploy-to-gcloud.sh`