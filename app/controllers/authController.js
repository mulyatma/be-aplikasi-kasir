const User = require('../models/User');
const Employee = require('../models/Employee');
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

        const token = jwt.sign(
            { userId: user._id, username: user.username },
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
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await employee.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        const token = jwt.sign(
            {
                employeeId: employee._id,
                userId: employee.userId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.logout = async (req, res) => {
    res.json({ message: 'Logout berhasil' });
};
