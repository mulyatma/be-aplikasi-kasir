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
        const { userId, role } = decoded;

        if (!userId) {
            return res.status(401).json({ message: 'Token tidak valid.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        if (role != 'owner') {
            return res.status(401).json({ message: 'Akses ditolak. Anda bukan owner' });
        }

        user.lastActiveAt = new Date();
        await user.save();

        req.user = user;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Sesi login telah habis. Silakan login kembali.' });
        }
        console.error(err);
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};