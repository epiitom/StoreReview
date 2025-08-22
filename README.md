# StoreRate - Store Review Platform

A comprehensive web application for rating and reviewing local stores with role-based user management.

## 🏗️ System Architecture

<img width="1465" height="747" alt="Screenshot 2025-08-22 122436" src="https://github.com/user-attachments/assets/cab9fe36-f772-4e41-9c93-15fb4b1c5883" />


```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    DATABASE     │
│   (React.js)    │    │   (Node.js)     │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ├─ Landing Page         ├─ Auth Routes          ├─ Users Table
         ├─ Registration         ├─ Store Routes         ├─ Stores Table  
         ├─ Authentication       ├─ Rating Routes        ├─ Ratings Table
         ├─ User Dashboard       ├─ JWT Middleware       └─ Relationships
         ├─ Store Management     ├─ Validation Layer           │
         └─ Rating System        └─ Error Handling             │
                                                               │
┌─────────────────────────────────────────────────────────────┘
│
└─── USER ROLES & PERMISSIONS
     ├─ Regular User: Browse stores, submit ratings, view reviews
     └─ Store Owner: Manage owned stores, view detailed analytics
```

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Role-Based Access Control**: Different permissions for regular users and store owners
- **Store Management**: Add, edit, and manage store information
- **Rating System**: 5-star rating system with detailed reviews
- **Search & Filter**: Find stores by location, category, or rating

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Both client-side and server-side validation using Zod
- **Password Security**: Bcrypt hashing for secure password storage
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management for authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **Environment Variables** - Configuration management

## 📊 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    category VARCHAR(50),
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings Table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create new store (store owners only)
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store (owner only)

### Ratings
- `POST /api/ratings` - Submit rating/review
- `GET /api/ratings/store/:id` - Get store ratings
- `GET /api/ratings/user/:id` - Get user's ratings

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storerate.git
   cd storerate
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/storerate
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create database and run migrations
   npm run db:setup
   ```

5. **Run the application**
   ```bash
   # Start backend server
   cd backend && npm start
   
   # Start frontend development server
   cd frontend && npm start
   ```

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend for production
cd frontend && npm run build

# Start production server
cd backend && npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React community for excellent documentation
- Express.js team for the robust web framework
- PostgreSQL for reliable data storage

---

**Live Demo**: [https://storerate-demo.netlify.app](https://your-demo-link.com)  
**API Documentation**: [https://api.storerate.com/docs](https://your-api-docs.com)
