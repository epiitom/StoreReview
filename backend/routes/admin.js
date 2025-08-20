const express = require('express');
const pool = require('../config/db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/dashboard - Admin dashboard stats
router.get('/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const [usersResult, storesResult, ratingsResult] = await Promise.all([
            pool.query('SELECT COUNT(*) as total_users FROM users'),
            pool.query('SELECT COUNT(*) as total_stores FROM stores'),
            pool.query('SELECT COUNT(*) as total_ratings FROM ratings')
        ]);
        
        res.json({
            total_users: parseInt(usersResult.rows[0].total_users),
            total_stores: parseInt(storesResult.rows[0].total_stores),
            total_ratings: parseInt(ratingsResult.rows[0].total_ratings)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;