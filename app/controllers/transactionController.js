const Transaction = require('../models/Transaction');
const Menu = require('../models/Menu');

exports.createTransaction = async (req, res) => {
    try {
        const { items, amountPaid } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items transaksi tidak boleh kosong.' });
        }

        if (typeof amountPaid !== 'number' || amountPaid <= 0) {
            return res.status(400).json({ message: 'Jumlah pembayaran tidak valid.' });
        }

        let total = 0;
        const populatedItems = [];

        for (const item of items) {
            const menu = await Menu.findOne({
                _id: item.menu,
                owner: req.ownerId,
            });

            if (!menu) {
                return res.status(404).json({ message: `Menu dengan ID ${item.menu} tidak ditemukan.` });
            }

            const subtotal = menu.price * item.quantity;
            total += subtotal;

            populatedItems.push({
                menu: menu._id,
                quantity: item.quantity,
                price: menu.price,
                subtotal,
            });
        }

        if (amountPaid < total) {
            return res.status(400).json({ message: 'Jumlah pembayaran kurang dari total transaksi.' });
        }

        const change = amountPaid - total;

        const transaction = new Transaction({
            items: populatedItems,
            total,
            amountPaid,
            change,
            createdBy: req.ownerId,
        });

        await transaction.save();

        res.status(201).json({
            message: 'Transaksi berhasil disimpan.',
            transaction,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let filter = { createdBy: req.user.userId };

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).populate('items.menu');

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            createdBy: req.user.userId,
        }).populate('items.menu');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }

        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};
