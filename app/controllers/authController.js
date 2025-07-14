const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Username atau email sudah digunakan.' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'Registrasi berhasil.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};


exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!user) {
            return res.status(400).json({ message: 'User tidak ditemukan.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        const payload = {
            userId: user._id,
            username: user.username,
            role: user.role,
            ownerId: user.ownerId || null,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login berhasil.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                ownerId: user.ownerId || null,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.logout = async (req, res) => {
    res.json({ message: 'Logout berhasil' });
};
