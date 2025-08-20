const express = require('express');
const pool = require('../config/db'); 
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// POST /api/ratings - Submit rating (Normal users only)
router.post('/', authenticateToken, requireRole(['normal_user']), async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        
       
        if (!store_id) {
            return res.status(400).json({ error: 'Store ID is required' });
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        // store existence check
        const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }
        
        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, store_id) 
             DO UPDATE SET rating = $3, updated_at = NOW()
             RETURNING *`,
            [req.user.id, store_id, rating]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/ratings/:id - Update rating (Normal users only)
router.put('/:id', authenticateToken, requireRole(['normal_user']), async (req, res) => {
    try {
        const { rating } = req.body;
        const { id } = req.params;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        const result = await pool.query(
            'UPDATE ratings SET rating = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [rating, id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rating not found or unauthorized' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/ratings - Get all ratings (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id, r.rating, r.created_at, r.updated_at,
                   u.name as user_name, u.email as user_email,
                   s.name as store_name, s.email as store_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            ORDER BY r.created_at DESC
        `);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;