Store Rating Platform

A full-stack web app where users can rate stores (1–5 stars). Features role-based access with System Admin, Normal User, and Store Owner.

Roles & Functionalities
🔑 System Administrator

Add new stores, normal users, and admins

Dashboard: total users, stores, ratings

View & filter stores and users (Name, Email, Address, Role)

View user details (incl. ratings for store owners)

Logout

👤 Normal User

Sign up / log in

Update password

View & search stores (by Name/Address)

Submit or update rating (1–5) for stores

See own rating + overall rating of stores

Logout

🏪 Store Owner

Log in

Update password

Dashboard: view users who rated their store

See store’s average rating

Logout

Tech Stack

Frontend: React + Tailwind

Backend: Express / Node.js

Database: PostgreSQL

Auth: JWT

Setup
git clone https://github.com/yourusername/StoreReview.git
cd backend
npm install
cp .env.example .env   # Add DB + JWT values
cd frontend  
npm run dev
