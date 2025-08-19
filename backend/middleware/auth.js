const jwt = require('jsonwebtoken')
const pool = require('..config/db');

const authenticateToken = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if(!token){
        return res.status(401).json({error:'Access token required'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT id,email,role FROM users WHERE id = $1',[decoded.id]);

        if(userResult.rows.length === 0){
            return res.status(403).json({error:'Invalid token'});
        }
        req.user = userResult.rows[0];
        next();
    }catch(error){
        res.status(403).json({error:'Invalid token'})
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};
module.exports = { authenticateToken, requireRole };