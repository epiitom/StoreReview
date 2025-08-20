const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const {authenticateToken, requireRole} = require('../middleware/auth')
const router = express.Router();

//GET /api/users - get all users with filtering and sorting 
router.get('/', authenticateToken,requireRole(['admin']), async(req,res) => {
    try{
        const {role,name,email,address,sort,order = 'asc'} = req.query;

        let query =`
          SELECT u.id , u.name, u.email, u.address, u.role, u.created_at,
          CASE 
          WHEN u.role = 'store_owner' THEN (
          SELECT COALESCE(ROUND(AVG(r.rating)::numeric,2),0)
          FROM stores S
          LEFT JOIN ratings r ON s.id = r.store_id
          WHERE s.owner_id = u.id 
          )    
          ELSE null
          END as rating 
        FROM users u  
          `;
    
        const params = [];
        const conditions = [];
          // Apply filters
        if (role) {
            conditions.push(`u.role = $${params.length + 1}`);
            params.push(role);
        }
        
        if (name) {
            conditions.push(`u.name ILIKE $${params.length + 1}`);
            params.push(`%${name}%`);
        }
        
        if (email) {
            conditions.push(`u.email ILIKE $${params.length + 1}`);
            params.push(`%${email}%`);
        }
        
        if (address) {
            conditions.push(`u.address ILIKE $${params.length + 1}`);
            params.push(`%${address}%`);
        }
        
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
            
        //apply sorting
         const validSortFields = ['name', 'email', 'role', 'created_at'];
        const sortField = validSortFields.includes(sort) ? sort : 'name';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        
        query += ` ORDER BY u.${sortField} ${sortOrder}`;
        
        const result = await pool.query(query, params);
        res.json(result.rows);

    }
    catch(error){
           res.status(500).json({ error: error.message });
    }
});
// POST /api/users - Create user (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { name, email, password, address, role = 'normal_user' } = req.body;
        
        // Validation
        if (!name || name.length < 5 || name.length > 60) {
            return res.status(400).json({ error: 'Name must be 20-60 characters' });
        }
        
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Valid email required' });
        }
        
        if (!password || password.length < 8 || password.length > 16) {
            return res.status(400).json({ error: 'Password must be 8-16 characters' });
        }
        
        // Password validation - at least one uppercase and one special character
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter and one special character' 
            });
        }
        
        if (address && address.length > 400) {
            return res.status(400).json({ error: 'Address max 400 characters' });
        }
        
        if (!['admin', 'normal_user', 'store_owner'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at',
            [name, email, hashedPassword, address, role]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
                   CASE 
                       WHEN u.role = 'store_owner' THEN (
                           SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0)
                           FROM stores s
                           LEFT JOIN ratings r ON s.id = r.store_id
                           WHERE s.owner_id = u.id
                       )
                       ELSE NULL
                   END as rating
            FROM users u
            WHERE u.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;