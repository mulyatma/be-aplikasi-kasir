const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getDailyReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const transactions = await Transaction.find({
            createdBy: req.user.userId,
            createdAt: { $gte: today, $lt: tomorrow },
        }).populate('items.menu');

        const totalSales = transactions.reduce((sum, trx) => sum + trx.total, 0);

        res.json({
            date: today.toISOString().split('T')[0],
            totalTransactions: transactions.length,
            totalSales,
            transactions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.getRangeReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ message: 'Parameter startDate dan endDate wajib diisi.' });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            createdBy: req.user.userId,
            createdAt: { $gte: start, $lte: end },
        }).populate('items.menu');

        const totalSales = transactions.reduce((sum, trx) => sum + trx.total, 0);

        res.json({
            range: {
                startDate: startDate,
                endDate: endDate,
            },
            totalTransactions: transactions.length,
            totalSales,
            transactions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};
