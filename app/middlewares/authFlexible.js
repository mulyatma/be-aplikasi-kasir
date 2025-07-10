const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { employeeId, userId } = decoded;

        if (employeeId && userId) {
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee tidak ditemukan.' });
            }

            req.employee = employee;
            req.ownerId = userId;
            return next();
        }

        if (userId && !employeeId) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User tidak ditemukan.' });
            }

            req.user = user;
            req.ownerId = user._id;
            return next();
        }

        return res.status(400).json({ message: 'Token tidak valid.' });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};
