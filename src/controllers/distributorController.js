// Importamos los modelos necesarios
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Batch from "../models/Batch.js";
import { Op } from "sequelize";

// FUNCIÓN MANAGEINVENTORY: gestiona el inventario de productos
export const manageInventory = async (req, res) => {
    try {
        const { action, productId, quantity } = req.body;
        const distributorId = req.user.id;

        // CONSULTA: buscar inventario existente
        const inventory = await Inventory.findOne({
            where: {
                productId,
                distributorId
            }
        });

        switch (action) {
            case 'add':
                if (!inventory) {
                    // CREACIÓN: nuevo registro de inventario
                    await Inventory.create({
                        productId,
                        distributorId,
                        quantity
                    });
                } else {
                    // ACTUALIZACIÓN: incrementar cantidad existente
                    await inventory.update({
                        quantity: inventory.quantity + quantity
                    });
                }
                break;

            case 'remove':
                if (!inventory || inventory.quantity < quantity) {
                    return res.status(400).json({ message: "Inventario insuficiente" });
                }
                // ACTUALIZACIÓN: decrementar cantidad
                await inventory.update({
                    quantity: inventory.quantity - quantity
                });
                break;

            default:
                return res.status(400).json({ message: "Acción no válida" });
        }

        res.json({ message: "Inventario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN MANAGEBATCHES: gestiona los lotes de productos
export const manageBatches = async (req, res) => {
    try {
        const { action, batchId, batchData } = req.body;
        const distributorId = req.user.id;

        switch (action) {
            case 'create':
                const newBatch = await Batch.create({
                    ...batchData,
                    distributorId
                });
                return res.status(201).json(newBatch);

            case 'update':
                await Batch.update(batchData, {
                    where: {
                        id: batchId,
                        distributorId
                    }
                });
                return res.json({ message: "Lote actualizado" });

            case 'delete':
                await Batch.destroy({
                    where: {
                        id: batchId,
                        distributorId
                    }
                });
                return res.json({ message: "Lote eliminado" });

            default:
                return res.status(400).json({ message: "Acción no válida" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN GETDISTRIBUTORSTATS: obtiene estadísticas del distribuidor
export const getDistributorStats = async (req, res) => {
    try {
        const distributorId = req.user.id;

        // CONSULTAS CON JOIN Y CONTEOS
        const inventoryStats = await Inventory.findAll({
            where: { distributorId },
            include: Product
        });

        const totalProducts = await Inventory.count({
            where: { distributorId }
        });

        const totalBatches = await Batch.count({
            where: { distributorId }
        });

        // CONSULTA CON CONDICIÓN: productos con bajo stock
        const lowStockItems = await Inventory.findAll({
            where: {
                distributorId,
                quantity: {
                    [Op.lt]: 10 // Usando operadores de Sequelize
                }
            },
            include: Product
        });

        res.json({
            inventoryStats,
            totalProducts,
            totalBatches,
            lowStockItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN GETMOVEMENTHISTORY: obtiene el historial de movimientos
export const getMovementHistory = async (req, res) => {
    try {
        const distributorId = req.user.id;
        const { startDate, endDate } = req.query;

        const whereClause = {
            distributorId
        };

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const movements = await Batch.findAll({
            where: whereClause,
            include: Product,
            order: [['createdAt', 'DESC']]
        });

        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};