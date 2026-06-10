# Kargo İşletme Sistemi

Kargo şirketleri için full-stack yönetim uygulaması.

## Teknoloji Stack

| Katman | Teknoloji |
|--------|----------|
| Backend | ASP.NET Core, Entity Framework Core, SQLite |
| Kimlik Doğrulama | ASP.NET Identity, JWT |
| Validasyon | FluentValidation |
| Frontend | React, Vite, Tailwind CSS |

## Özellikler

- Kullanıcı kimlik doğrulama ve rol tabanlı yetkilendirme
- Kargo oluşturma, takip ve yönetimi
- RESTful API mimarisi

## Başlatma

```bash
# Backend
cd KargoBackend
dotnet run

# Frontend
cd kargo-frontend
npm install
npm run dev
```

## Proje Yapısı

```
KargoBackend/
├── Controllers/    # API endpoint'leri
├── Models/         # Veri modelleri
├── Services/       # İş mantığı
├── Identity/       # Kimlik doğrulama
└── Migrations/     # EF Core migrations

kargo-frontend/
├── src/            # React bileşenleri
└── public/         # Statik dosyalar
```
