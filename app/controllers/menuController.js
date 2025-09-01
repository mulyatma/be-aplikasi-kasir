const Menu = require('../models/Menu');

exports.createMenu = async (req, res) => {
    try {
        const { name, price, description, ingredients } = req.body;

        let image;
        if (req.file && req.file.path) {
            image = req.file.path;
        } else {
            image = 'https://res.cloudinary.com/dnlogcrtc/image/upload/v1751429960/cashier_app/26576_efsoo0.jpg';
        }

        let parsedIngredients = [];
        if (ingredients) {
            parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        }

        const menu = new Menu({
            name,
            price,
            description,
            image,
            owner: req.user._id,
            ingredients: parsedIngredients
        });

        await menu.save();

        res.status(201).json({
            message: 'Menu berhasil dibuat.',
            menu
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Terjadi kesalahan server.',
            error: err.message,
            stack: err.stack
        });
    }
};

exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find({ owner: req.ownerId }).sort({ createdAt: -1 });
        res.status(200).json(menus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

exports.getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findOne({ _id: req.params.id, owner: req.ownerId })
            .populate({
                path: "ingredients.stock",
                select: "name",
            });

        if (!menu) {
            return res.status(404).json({ message: "Menu tidak ditemukan." });
        }

        res.status(200).json(menu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};


exports.updateMenu = async (req, res) => {
    try {
        const { name, price, description, ingredients } = req.body;

        const menu = await Menu.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user._id,
            },
            {
                name,
                price,
                description,
                ...(ingredients && { ingredients }),
            },
            {
                new: true,
            }
        );

        if (!menu) {
            return res.status(404).json({
                message: 'Menu tidak ditemukan atau Anda tidak memiliki akses.',
            });
        }

        res.status(200).json({
            message: 'Menu berhasil diperbarui.',
            menu,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Terjadi kesalahan server.',
        });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!menu) {
            return res.status(404).json({
                message: 'Menu tidak ditemukan atau Anda tidak memiliki akses.',
            });
        }

        res.status(200).json({
            message: 'Menu berhasil dihapus.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Terjadi kesalahan server.',
        });
    }
};