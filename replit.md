# Rumah Terapy Ikhtiar Sehat

## Project overview

Website klinik Pengobatan Tradisional Tiongkok yang menggunakan React, Vite, Express, PostgreSQL, Drizzle ORM, dan Tailwind CSS. Express melayani API di `/api/*` dan Vite menyajikan aplikasi React melalui port 5000.

## Menjalankan di Replit

Workflow utama menjalankan:

```bash
npm run dev
```

Dependensi proyek diinstal dari `package-lock.json`. Database PostgreSQL development Replit sudah tersedia dan digunakan melalui `DATABASE_URL`. Untuk membuat atau memperbarui tabel sesuai schema, jalankan:

```bash
npm run db:push
```

Untuk menyiapkan akun administrator dan artikel awal setelah schema dibuat, jalankan:

```bash
npm run db:seed
```

Gunakan `ADMIN_EMAIL` (opsional, default `admin@rumahterapy.id`) dan secret `ADMIN_PASSWORD` minimal 8 karakter. Dashboard admin tersedia di `/admin`.

## User preferences

- Pertahankan struktur dan stack proyek yang sudah ada.
- Gunakan bahasa Indonesia untuk teks antarmuka dan komunikasi terkait proyek ini.