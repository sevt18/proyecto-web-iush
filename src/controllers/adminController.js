import User from '../models/User.js';
import Product from '../models/Product.js';
import Role from '../models/Role.js';

// Gestión de usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Gestión de roles
const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const user = await User.update(
            { rolId: roleId },
            { where: { id: userId }, returning: true }
        );
        res.status(200).json(user[1][0]);
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
                await Product.update(productData, { where: { id: productId } });
                result = await Product.findByPk(productId);
                break;
            case 'delete':
                result = await Product.destroy({ where: { id: productId } });
                break;
            default:
                return res.status(400).json({ message: 'Acción no válida' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error en la gestión de productos', error: error.message });
    }
};

export {
    getAllUsers,
    assignRole,
    manageProducts
};
