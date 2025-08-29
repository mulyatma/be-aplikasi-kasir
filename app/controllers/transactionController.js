const Transaction = require('../models/Transaction');
const Menu = require('../models/Menu');
const Stock = require('../models/Stock');

exports.createTransaction = async (req, res) => {
    try {
        const { items, amountPaid, customer } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items transaksi tidak boleh kosong.' });
        }

        if (typeof amountPaid !== 'number' || amountPaid <= 0) {
            return res.status(400).json({ message: 'Jumlah pembayaran tidak valid.' });
        }

        let total = 0;
        const populatedItems = [];
        const stockUpdates = [];

        for (const item of items) {
            const menu = await Menu.findOne({
                _id: item.menu,
                owner: req.ownerId,
            }).populate('ingredients.stock');

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

            for (const ing of menu.ingredients) {
                const requiredQty = ing.quantity * item.quantity;

                if (ing.stock.quantity < requiredQty) {
                    return res.status(400).json({
                        message: `Stok ${ing.stock.name} tidak cukup. Dibutuhkan ${requiredQty} ${ing.stock.unit}, tersedia ${ing.stock.quantity} ${ing.stock.unit}.`
                    });
                }

                stockUpdates.push({
                    stockId: ing.stock._id,
                    reduceBy: requiredQty
                });
            }
        }

        if (amountPaid < total) {
            return res.status(400).json({ message: 'Jumlah pembayaran kurang dari total transaksi.' });
        }

        const change = amountPaid - total;

        const transaction = new Transaction({
            items: populatedItems,
            total,
            customer,
            amountPaid,
            change,
            createdBy: req.ownerId,
        });

        await transaction.save();

        for (const update of stockUpdates) {
            await Stock.findByIdAndUpdate(update.stockId, {
                $inc: { quantity: -update.reduceBy }
            });
        }

        res.status(201).json({
            message: 'Transaksi berhasil disimpan & stok diperbarui.',
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

        let filter = { createdBy: req.ownerId };

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
            createdBy: req.ownerId
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
