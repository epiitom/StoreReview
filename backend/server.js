require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const userRoutes = require('./routes/users');
const ratingRoutes = require('./routes/rating');
const adminRoutes = require('./routes/admin');

const app = express();

// Updated CORS configuration
const corsOptions = {
    origin: [
        'https://store-review-7bsv.vercel.app',
        'https://store-review-7bsv.vercel.app/Landing',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ]
};

app.use(helmet());
app.use(cors(corsOptions)); // Use the configured options
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});