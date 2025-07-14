const Stock = require('../models/Stock');

exports.index = async (req, res) => {
    try {
        const stocks = await Stock.find({ ownerId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Data stok berhasil diambil.',
            data: stocks
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data stok.' });
    }
};

exports.store = async (req, res) => {
    try {
        const { name, unit, quantity } = req.body;

        if (!name || !unit) {
            return res.status(400).json({ message: 'Nama dan unit wajib diisi.' });
        }

        const stock = new Stock({
            name,
            unit,
            quantity: quantity ?? 0,
            ownerId: req.user._id
        });

        await stock.save();

        return res.status(201).json({
            message: 'Data stok berhasil disimpan.',
            data: stock
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan stok.' });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;

        const stock = await Stock.findOne({
            _id: id,
            ownerId: req.user._id
        });

        if (!stock) {
            return res.status(404).json({ message: 'Data stok tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Data stok berhasil diambil.',
            data: stock
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data stok.' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ message: 'Quantity wajib diisi.' });
        }

        const stock = await Stock.findOneAndUpdate(
            {
                _id: id,
                ownerId: req.user._id
            },
            {
                quantity
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!stock) {
            return res.status(404).json({ message: 'Data stok tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Quantity stok berhasil diperbarui.',
            data: stock
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui quantity stok.' });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const stock = await Stock.findOneAndDelete({
            _id: id,
            ownerId: req.user._id
        });

        if (!stock) {
            return res.status(404).json({ message: 'Data stok tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Data stok berhasil dihapus.'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data stok.' });
    }
};
