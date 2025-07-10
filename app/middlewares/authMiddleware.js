const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        await User.findByIdAndUpdate(decoded.userId, { lastActiveAt: new Date() });

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
    }
};
