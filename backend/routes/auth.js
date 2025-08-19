const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db');
const router = express.Router();

router.post('/register', async(req,res) => {
    try{
        const {name,email,password,address} = req.body;

        if(name.length < 5 || name.length > 60){
            return res.status(400).json({error:"Name must be 5-60 characters"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        console.log("db is working")

        const result = await pool.query(
            'INSERT INTO users (name,email,password,address,role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role',
             [name, email, hashedPassword, address, 'normal_user']
        )
        
                const token = jwt.sign(
            { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
            process.env.JWT_SECRET
        );
        res.status(201).json({
            token,
            user:result.rows[0]
        })
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;