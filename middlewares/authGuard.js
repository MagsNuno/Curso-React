const User = require('../models/User');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // CHECK IF HEADER HAS A TOKEN
    if(!token) return res.status(401).json({errors: ["Access denied!"]});

    // CHECK IF TOKEN IS VALID
    try {

        const verified = jwt.verify(token, jwtSecret);
        req.user = await User.findById(verified.id).select("-password");

        next();
        
    } catch (error) {
        res.status(401).json({errors: ["Invalid token!"]});
    }

};


module.exports = authGuard;