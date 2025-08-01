# 🚗 AvtoTest - Haydovchilik Guvohnomasi Platformasi

Zamonaviy va responsive haydovchilik guvohnomasi uchun test va ta'lim platformasi. React, Tailwind CSS va Supabase yordamida qurilgan.

## ✨ Xususiyatlar

### 👥 Foydalanuvchilar uchun
- **Test ishlash** - 25 ta random savol bilan imtihon
- **Video darsliklar** - YouTube videolar orqali ta'lim
- **Statistika** - Test natijalarini kuzatish
- **Aloqa** - Admin bilan bog'lanish

### 🔐 Autentifikatsiya
- **Foydalanuvchilar** - Telefon raqam + tug'ilgan yil
- **Admin** - Username + parol
- **Xavfsizlik** - Role-based access control

### 👨‍💼 Admin paneli
- **Foydalanuvchilarni boshqarish** - CRUD operatsiyalari
- **Test savollarini boshqarish** - Savollar qo'shish/tahrirlash
- **Darsliklarni boshqarish** - Video darsliklar
- **So'rovlarni ko'rish** - Foydalanuvchilar xabarlari

## 🛠️ Texnologiyalar

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS 3, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📦 O'rnatish

### Talablar
- Node.js 18+ 
- npm yoki yarn
- Supabase hisob

### 1. Loyihani klonlash
```bash
git clone <repository-url>
cd avtomaktab
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. Environment variables
`.env` fayl yarating:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development server ishga tushirish
```bash
npm run dev
```

## 🗄️ Database Schema

### Users jadvali
```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  fio text NOT NULL,
  phone varchar(20) NOT NULL UNIQUE,
  passport varchar(9) NOT NULL UNIQUE,
  birth_date date NOT NULL,
  category text CHECK (category IN ('A','B','C','BC')),
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
```

### Admin jadvali
```sql
CREATE TABLE admin (
  id serial PRIMARY KEY,
  username varchar(50) NOT NULL UNIQUE,
  password text NOT NULL
);
```

### Darsliklar jadvali
```sql
CREATE TABLE darsliklar (
  id serial PRIMARY KEY,
  link text NOT NULL,
  title text NOT NULL,
  description text NOT NULL
);
```

### Test savollari jadvali
```sql
CREATE TABLE test_savollar (
  id serial PRIMARY KEY,
  savol text NOT NULL,
  javob_a text NOT NULL,
  javob_b text NOT NULL,
  javob_c text NOT NULL,
  javob_d text NOT NULL,
  togri_javob integer NOT NULL CHECK (togri_javob IN (0,1,2,3))
);
```

### Aloqa jadvali
```sql
CREATE TABLE aloqa (
  id serial PRIMARY KEY,
  ism text NOT NULL,
  email text,
  telefon text,
  xabar text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
```

## 🎨 Dizayn tizimi

### Ranglar
- **Primary**: Ko'k ranglar (asosiy)
- **Secondary**: Kulranglar (ikkinchi darajali)
- **Accent**: Binafsha ranglar (vurgu)
- **Success**: Yashil ranglar (muvaffaqiyat)
- **Warning**: Sariq ranglar (ogohlantirish)
- **Error**: Qizil ranglar (xatolik)

### Komponentlar
- **Cards** - Ma'lumotlarni ko'rsatish
- **Buttons** - Har xil turdagi tugmalar
- **Inputs** - Forma maydonlari
- **Animations** - Framer Motion bilan

## 📱 Responsive dizayn

- **Mobile First** yondashuv
- **Breakpoints**: sm, md, lg, xl
- **Flexbox va Grid** layout
- **Touch-friendly** interfeys

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Build preview
npm run lint         # ESLint check
```

### Fayl struktura
```
src/
├── components/      # Qayta ishlatiluvchi komponentlar
├── pages/          # Sahifalar
├── utils/          # Utility funksiyalar
├── AuthContext.jsx # Autentifikatsiya
├── App.jsx         # Asosiy app
└── main.jsx        # Entry point
```

## 🚀 Deployment

### Vercel
1. GitHub repository ga ulang
2. Vercel da yangi loyiha yarating
3. Environment variables qo'shing
4. Deploy qiling

### Netlify
1. Build fayllarini yuklang
2. Environment variables sozlang
3. Deploy qiling

## 📄 Litsenziya

MIT License - [LICENSE](LICENSE) faylini ko'ring

## 🤝 Hissa qo'shish

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Branch ga push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📞 Aloqa

- **Email**: info@avtotest.uz
- **Telefon**: +998 71 123 45 67
- **Manzil**: Toshkent shahri, Chilonzor tumani

---

⭐ Bu loyiha sizga foydali bo'lsa, star bering!
