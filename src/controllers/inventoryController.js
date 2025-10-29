// Importamos modelos necesarios para inventario
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { Op } from "sequelize";

// FUNCIÓN GETINVENTORY: obtener inventario de un distribuidor
// SQL equivalente: SELECT * FROM inventory JOIN products ON inventory.productId = products.id WHERE distributorId = ?;
export const getInventory = async (req, res) => {
    try {
        const distributorId = req.user.id;

        const inventory = await Inventory.findAll({
            where: { distributorId },
            include: [{
                model: Product,
                attributes: ['name', 'description', 'price']
            }]
        });

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN UPDATESTOCK: actualizar cantidad en inventario
// SQL equivalente: UPDATE inventory SET quantity=quantity+? WHERE productId=? AND distributorId=?;
export const updateStock = async (req, res) => {
    try {
        const { productId, quantity, action } = req.body;
        const distributorId = req.user.id;

        // BUSCAR INVENTARIO EXISTENTE
        let inventory = await Inventory.findOne({
            where: { productId, distributorId }
        });

        if (!inventory && action === 'remove') {
            return res.status(400).json({ message: "No hay inventario para este producto" });
        }

        // CREAR O ACTUALIZAR INVENTARIO
        if (!inventory) {
            if (action === 'add') {
                inventory = await Inventory.create({
                    productId,
                    distributorId,
                    quantity
                });
            }
        } else {
            const newQuantity = action === 'add' ? 
                inventory.quantity + quantity : 
                inventory.quantity - quantity;

            if (newQuantity < 0) {
                return res.status(400).json({ message: "Stock insuficiente" });
            }

            await inventory.update({ quantity: newQuantity });
        }

        res.json({ message: "Inventario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN GETLOWSTOCK: obtener productos con bajo stock
// SQL equivalente: SELECT * FROM inventory JOIN products WHERE quantity < threshold;
export const getLowStock = async (req, res) => {
    try {
        const distributorId = req.user.id;
        const { threshold = 10 } = req.query;

        const lowStock = await Inventory.findAll({
            where: {
                distributorId,
                quantity: {
                    [Op.lt]: threshold
                }
            },
            include: Product
        });

        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN GETSTOCKHISTORY: obtener historial de cambios en inventario
// SQL equivalente: SELECT * FROM inventory_history WHERE distributorId = ? ORDER BY date DESC;
export const getStockHistory = async (req, res) => {
    try {
        const distributorId = req.user.id;
        const { startDate, endDate } = req.query;

        const whereClause = { distributorId };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const history = await Inventory.findAll({
            where: whereClause,
            include: Product,
            order: [['updatedAt', 'DESC']]
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};