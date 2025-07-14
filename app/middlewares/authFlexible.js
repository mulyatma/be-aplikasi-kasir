const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { userId } = decoded;

        if (!userId) {
            return res.status(400).json({ message: 'Token tidak valid.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        req.user = user;
        req.ownerId = user.role === 'cashier' ? user.ownerId : user._id;

        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};
