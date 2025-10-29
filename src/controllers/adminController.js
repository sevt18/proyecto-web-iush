const User = require('../models/User');
const Product = require('../models/Product');
const Role = require('../models/Role');

// Gestión de usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Gestión de roles
const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { role: roleId },
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar rol', error: error.message });
    }
};

// Gestión de productos
const manageProducts = async (req, res) => {
    try {
        const { action, productId, productData } = req.body;
        let result;

        switch (action) {
            case 'create':
                result = await Product.create(productData);
                break;
            case 'update':
                result = await Product.findByIdAndUpdate(productId, productData, { new: true });
                break;
            case 'delete':
                result = await Product.findByIdAndDelete(productId);
                break;
            default:
                return res.status(400).json({ message: 'Acción no válida' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en la gestión de productos', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    assignRole,
    manageProducts
};