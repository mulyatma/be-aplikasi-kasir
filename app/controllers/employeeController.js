const User = require('../models/User');

exports.addEmployee = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email sudah digunakan karyawan lain.' });
        }

        const employee = new User({
            username,
            email,
            password,
            role: 'cashier',
            ownerId: req.user._id,
        });

        await employee.save();

        res.status(201).json({
            message: 'Karyawan berhasil ditambahkan.',
            data: {
                id: employee._id,
                username: employee.username,
                email: employee.email,
                role: employee.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};
