# 🏪 Store Rating Platform

> Full-stack web app for rating stores with role-based access control
<img width="1657" height="687" alt="image" src="https://github.com/user-attachments/assets/6cfba8a3-b59b-4b69-b7d5-39998b9146cf" />

---

## 🎯 Features

### 🔑 **System Admin**
- Add stores, users, and admins
- Analytics dashboard  
- Filter and manage data
- User detail views

### 👤 **Normal User**
- Sign up / login
- Search stores
- Rate stores (1-5 stars)
- View ratings

### 🏪 **Store Owner**
- Login / password update
- View store ratings
- Customer dashboard

---

## ⚡ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React + Tailwind CSS |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Auth** | JWT |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/StoreReview.git

# Backend setup
cd backend
npm install
cp .env.example .env   # Configure DB + JWT

# Frontend setup  
cd ../frontend
npm install
npm run dev
```

---

## ⚙️ Environment Setup

Create `.env` in backend folder:

```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
```

---

## 🎉 Usage

1. **Start Backend Server**
2. **Launch Frontend Dev Server** 
3. **Access at** `http://localhost:3000`

---

<div align="center">

**Ready to rate some stores!** ⭐

</div>
