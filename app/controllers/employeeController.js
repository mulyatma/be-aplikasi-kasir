const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
        }

        const existing = await Employee.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email sudah digunakan karyawan lain.' });
        }

        const employee = new Employee({
            userId: req.user.userId,
            name,
            email,
            password,
        });

        await employee.save();

        res.status(201).json({
            message: 'Karyawan berhasil ditambahkan.',
            data: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};
