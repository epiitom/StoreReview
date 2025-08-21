const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { 
    UserRegistrationSchema, 
    UserLoginSchema, 
    PasswordUpdateSchema 
} = require('../schemas/userSchema');

const router = express.Router();

// Validation middleware
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }
    req.validatedBody = result.data;
    next();
};

// Register route
router.post('/register', validateBody(UserRegistrationSchema), async (req, res) => {
    try {
        const { name, email, password, address, role } = req.validatedBody;

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Database is working");

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, address, role]
        );

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: result.rows[0].id, 
                email: result.rows[0].email, 
                role: result.rows[0].role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Add expiration
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        res.status(500).json({ 
            error: 'Registration failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Login route
router.post('/login', validateBody(UserLoginSchema), async (req, res) => {
    try {
        const { email, password } = req.validatedBody;

        // Get user from database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update password route
router.put('/update-password', validateBody(PasswordUpdateSchema), async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.validatedBody;

        // Get user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Check if new password is different from current
        const samePassword = await bcrypt.compare(newPassword, user.password);
        if (samePassword) {
            return res.status(400).json({ error: 'New password must be different from current password' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await pool.query(
            'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2', 
            [hashedNewPassword, email]
        );

        res.json({ 
            message: 'Password updated successfully' 
        });

    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ 
            error: 'Password update failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;