Store Rating Platform
A full-stack web app for rating stores with role-based access control.
Features
🔑 System Admin

Add stores, users, and admins
Dashboard with analytics
Filter and manage all data
User detail views

👤 Normal User

Sign up / login
Search stores
Rate stores (1-5 stars)
View ratings

🏪 Store Owner

Login / password update
View store ratings
Customer dashboard

Tech Stack

Frontend: React + Tailwind CSS
Backend: Node.js + Express
Database: PostgreSQL
Auth: JWT

Quick Start
bash# Clone repository
git clone https://github.com/yourusername/StoreReview.git

# Backend setup
cd backend
npm install
cp .env.example .env   # Configure DB + JWT

# Frontend setup  
cd ../frontend
npm install
npm run dev
Environment Variables
Create .env in backend folder:
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
Usage

Start backend server
Launch frontend dev server
Access app at http://localhost:3000
