const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: 'User tidak ditemukan.' });
        }

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (user.lastActiveAt < oneWeekAgo) {
            return res.status(401).json({ message: 'Session expired karena tidak aktif lebih dari 7 hari. Silakan login ulang.' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

