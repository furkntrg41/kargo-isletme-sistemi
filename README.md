<div align="center">

# Kargo İşletme Sistemi

**Kargo şirketleri için modern full-stack yönetim uygulaması**

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-frontend-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

</div>

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Backend** | ASP.NET Core, Entity Framework Core, SQLite |
| **Kimlik Doğrulama** | ASP.NET Identity + JWT |
| **Validasyon** | FluentValidation |
| **Frontend** | React 18, Vite, Tailwind CSS |

---

## Özellikler

- **Kimlik doğrulama:** ASP.NET Identity ile kullanıcı kaydı, giriş ve rol yönetimi
- **Kargo yönetimi:** Kargo oluşturma, güncelleme, takip ve iptal
- **RESTful API:** Swagger/OpenAPI ile belgelenmiş endpoint'ler
- **Modern arayüz:** React + Tailwind CSS ile responsive tasarım
- **Güvenli:** JWT tabanlı oturum yönetimi

---

## Başlangıç

### Gereksinimler
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org)

### Backend

```bash
cd KargoBackend
dotnet restore
dotnet run
# → http://localhost:5000
# → Swagger: http://localhost:5000/swagger
```

### Frontend

```bash
cd kargo-frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Proje Yapısı

```
.
├── KargoBackend/
│   ├── Controllers/        # REST API endpoint'leri
│   ├── Models/             # Entity ve DTO sınıfları
│   ├── Services/           # İş mantığı katmanı
│   ├── Identity/           # Kimlik doğrulama altyapısı
│   ├── Data/               # EF Core DbContext
│   ├── Migrations/         # Veritabanı migration'ları
│   └── Program.cs          # Uygulama giriş noktası
│
└── kargo-frontend/
    ├── src/
    │   ├── components/     # Yeniden kullanılabilir UI bileşenleri
    │   ├── pages/          # Sayfa bileşenleri
    │   └── services/       # API istemcisi
    └── public/
```

---

## API Endpoint'leri

Backend çalışırken `http://localhost:5000/swagger` adresinden tüm endpoint'leri interaktif olarak test edebilirsiniz.

---

## Lisans

[MIT](LICENSE) © 2026 furkntrg41
