# Google Cloud Run Deployment Guide

## 🚀 Deployment Hazırlığı Tamamlandı!

Projeniz Google Cloud Run'da çalışmaya hazır. İşte yapmanız gerekenler:

---

## 📋 Ön Gereksinimler

1. **Google Cloud Hesabı** (varsa project ID'nizi belirtin)
2. **gcloud CLI** kurulu olmalı
3. **Docker** kurulu olmalı (container test için)

---

## 🛠️ Deployment Adımları

### 1. Google Cloud Projesi Kurulumu

```bash
# gcloud CLI'ye giriş yapın
gcloud auth login

# Proje ID'nizi ayarlayın
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Gerekli servisleri etkinleştirin
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### 2. Cloud SQL (PostgreSQL) Kurulumu

```bash
# Cloud SQL instance oluşturun
gcloud sql instances create modern-webapp-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Veritabanı oluşturun
gcloud sql databases create modernwebapp \
  --instance=modern-webapp-db

# Kullanıcı oluşturun
gcloud sql users create dbuser \
  --instance=modern-webapp-db \
  --password=your-secure-password
```

### 3. Environment Variables Ayarlama

`.env.production` dosyası oluşturun:

```env
DATABASE_URL="postgresql://dbuser:your-secure-password@/modernwebapp?host=/cloudsql/YOUR_PROJECT_ID:us-central1:modern-webapp-db"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="https://modern-webapp-xxxxx-uc.a.run.app"
RESEND_API_KEY="re_your_actual_key"
EMAIL_FROM="noreply@yourdomain.com"
NEXT_PUBLIC_APP_URL="https://modern-webapp-xxxxx-uc.a.run.app"
NODE_ENV="production"
```

### 4. Container Build & Deploy

```bash
# Container'ı local'de test edin
docker build -t modern-webapp .
docker run -p 3000:3000 --env-file .env.production modern-webapp

# Cloud Build ile deploy edin
gcloud builds submit --config cloudbuild.yaml

# VEYA manuel deploy
docker build -t gcr.io/$PROJECT_ID/modern-webapp .
docker push gcr.io/$PROJECT_ID/modern-webapp
gcloud run deploy modern-webapp \
  --image gcr.io/$PROJECT_ID/modern-webapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances $PROJECT_ID:us-central1:modern-webapp-db \
  --set-env-vars-from-file .env.production
```

---

## 🔐 Güvenlik Ayarları

1. **Secret Manager Kullanımı** (Önerilen):
```bash
# Secret oluşturun
echo -n "your-auth-secret" | gcloud secrets create auth-secret --data-file=-
echo -n "re_your_resend_key" | gcloud secrets create resend-api-key --data-file=-

# Cloud Run'a secret erişimi verin
gcloud run services update modern-webapp \
  --update-secrets AUTH_SECRET=auth-secret:latest \
  --update-secrets RESEND_API_KEY=resend-api-key:latest
```

2. **IAM Ayarları**:
```bash
# Service account oluşturun
gcloud iam service-accounts create modern-webapp-sa \
  --display-name="Modern WebApp Service Account"

# Cloud SQL erişimi verin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:modern-webapp-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

---

## 📊 Monitoring & Logging

1. **Cloud Monitoring Dashboard** otomatik oluşturulur
2. **Cloud Logging**'de logları görüntüleyebilirsiniz:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=modern-webapp" --limit 50
```

---

## 🚨 Önemli Notlar

1. **İlk deployment'ta** veritabanı migration'ları otomatik çalışacak
2. **Seed data** için `SEED_DATABASE=true` env variable ekleyin (sadece ilk sefer)
3. **Custom domain** eklemek için Cloud Run console kullanın
4. **SSL sertifikası** otomatik olarak Google tarafından sağlanır

---

## 🎯 Deployment Sonrası

1. **Test edin**: `https://modern-webapp-xxxxx-uc.a.run.app`
2. **Admin paneline girin**: `admin@example.com / demo123`
3. **Monitoring kontrol edin**: Cloud Console > Cloud Run > Metrics
4. **Logları inceleyin**: Cloud Console > Logging

---

## 💡 Troubleshooting

### Database bağlantı hatası
- Cloud SQL proxy'nin çalıştığından emin olun
- IAM permission'ları kontrol edin

### Build hatası
- `npm run build` local'de çalıştığından emin olun
- Docker image boyutu 1GB'ı geçmemeli

### Performance sorunları
- Min instances = 1 yapın (cold start önleme)
- Memory'yi 1GB'a çıkarın

---

## 📞 Destek İçin Gereken Bilgiler

Bana şunları sağlayın:
1. **Google Cloud Project ID**
2. **Tercih ettiğiniz region** (varsayılan: us-central1)
3. **Custom domain** (opsiyonel)
4. **Email servis tercihi** (Resend API key veya alternatif)

Bu bilgilerle deployment'ı tamamlayabilirim!