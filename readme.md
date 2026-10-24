# Resto Server

Backend application menggunakan **Node.js, TypeScript, Express.js, MySQL, dan Drizzle ORM**.

## Requirements

Pastikan sudah ter-install:

* Node.js
* npm
* MySQL
* Git

## 1. Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

Jika repository sudah ada:

```bash
git pull
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment

Buat file berikut di root project:

```text
.env.dev
.env.test
```

Gunakan `.env.example` sebagai referensi konfigurasi environment.

> Jangan commit file `.env` ke repository.

## 4. Development

Migration:

```bash
npm run docker:dev:up
```

```bash
npm run db:migrate:dev
```

Seed database:

```bash
npm run db:seed:dev
```

Jalankan aplikasi:

```bash
npm run dev
```

## Quick Reference

| Kebutuhan             | Perintah                  |
| --------------------- | ------------------------- |
| Install               | `npm install`             |
| Development migration | `npm run db:migrate:dev`  |
| Development seed      | `npm run db:seed:dev`     |
| Run development       | `npm run dev`             |
| Test migration        | `npm run db:migrate:test` |
| Test seed             | `npm run db:seed:test`    |
| Run test              | `npm run test`            |
