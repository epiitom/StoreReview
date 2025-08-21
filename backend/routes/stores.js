const express = require('express')
const pool = require('../config/db')
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

//get /api/stores - view all the stores (all authenticated users)
router.get('/getstore',authenticateToken , async (req,res) =>{
    try{
         const{search,name,address} = req.query;
          let query = `
            SELECT s.id, s.name, s.email, s.address,
                   COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
                   COUNT(r.rating) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `;
        const params= [];
        const conditions =[];

           // search functionality for normal user
        if(search){
             conditions.push(`(s.name ILIKE $${params.length + 1} OR s.address ILIKE $${params.length + 1})`);
            params.push(`%${search}%`)
        }
        if(name){
            conditions.push(`s.name ILIKE $${params.length + 1}`);
            params.push('%${address}%');
        }
         
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
         query += ` GROUP BY s.id, s.name, s.email, s.address ORDER BY s.name`;


          const result = await pool.query(query, params);
           if (req.user.role === 'normal') {
            const storesWithUserRatings = await Promise.all(
                result.rows.map(async (store) => {
                    const userRatingResult = await pool.query(
                        'SELECT rating FROM ratings WHERE user_id = $1 AND store_id = $2',
                        [req.user.id, store.id]
                    );
                    
                    return {
                        ...store,
                        user_submitted_rating: userRatingResult.rows[0]?.rating || null
                    };
                })
            );
            return res.json(storesWithUserRatings);
        }
        
        res.json(result.rows);       
    }
    catch(error){
         res.status(500).json({error:error.message});
    }
});
  //admin only create store
// Admin only create store - OWNER REQUIRED
router.post("/createstore", authenticateToken, requireRole(['admin']), async(req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        
        // Validation
        if (!name || name.length > 60) {
            return res.status(400).json({ error: 'Store name required, max 60 characters' });
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Valid email required' });
        }
        if (address && address.length > 400) {
            return res.status(400).json({ error: 'Address max 400 characters' });
        }
        
        // OWNER IS REQUIRED
        if (!owner_id) {
            return res.status(400).json({ error: 'Store owner is required' });
        }
        
        // Verify owner exists and is store_owner role
        const ownerResult = await pool.query(
            'SELECT id, role FROM users WHERE id = $1 AND role = $2',
            [owner_id, 'store_owner']
        );
        if (ownerResult.rows.length === 0) {
            return res.status(400).json({ error: 'Owner must be a store_owner role' });
        }
        
        const result = await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, owner_id]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Store email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});
   //Store owners store details
router.get('/my-store', authenticateToken, requireRole(['store_owner']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, 
             COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as average_rating,
             COUNT(r.rating) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id
        `, [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No store found for this owner' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get store owners for dropdown (Admin only)
router.get('/store-owners', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE role = $1 ORDER BY name',
            ['store_owner']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/stores/my-store/ratings - Store owner's ratings list
router.get('/my-store/ratings', authenticateToken, requireRole(['store_owner']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.rating, r.created_at, u.name as user_name, u.email as user_email, u.address as user_address
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = $1
            ORDER BY r.created_at DESC
        `, [req.user.id]);
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if store exists
        const storeCheck = await pool.query('SELECT id, name FROM stores WHERE id = $1', [id]);
        if (storeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }
        
        // Delete related ratings first (if any foreign key constraints)
        await pool.query('DELETE FROM ratings WHERE store_id = $1', [id]);
        
        // Delete the store
        const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
        
        res.json({ 
            message: 'Store deleted successfully', 
            deletedStore: result.rows[0] 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

