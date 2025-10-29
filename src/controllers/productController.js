// Importamos modelos necesarios para productos
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Inventory from "../models/Inventory.js";
import { Op } from "sequelize";

// FUNCIÓN GETPRODUCTS: obtener todos los productos
// SQL equivalente: SELECT * FROM products LEFT JOIN reviews ON products.id = reviews.productId;
export const getProducts = async (req, res) => {
    try {
        // CONSULTA CON JOIN: incluye reseñas relacionadas
        const products = await Product.findAll({
            include: Review
        });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN CREATEPRODUCT: crear nuevo producto
// SQL equivalente: INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?);
export const createProduct = async (req, res) => {
    try {
        // EXTRACCIÓN DE DATOS: datos del producto del body
        const { name, description, price, category } = req.body;

        // CREACIÓN: nuevo producto en la base de datos
        const product = await Product.create({
            name,
            description,
            price,
            category
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN UPDATEPRODUCT: actualizar producto existente
// SQL equivalente: UPDATE products SET name=?, description=?, price=? WHERE id=?;
export const updateProduct = async (req, res) => {
    try {
        // EXTRACCIÓN DE PARÁMETROS Y DATOS
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        // ACTUALIZACIÓN: modificar producto
        await Product.update(
            { name, description, price, category },
            { where: { id } }
        );

        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN DELETEPRODUCT: eliminar producto
// SQL equivalente: DELETE FROM products WHERE id=?;
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Product.destroy({ where: { id } });
        
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN SEARCHPRODUCTS: buscar productos con filtros
// SQL equivalente: SELECT * FROM products WHERE category = ? AND price BETWEEN ? AND ?;
export const searchProducts = async (req, res) => {
    try {
        // EXTRACCIÓN DE QUERY PARAMS: filtros de búsqueda
        const { query, category, minPrice, maxPrice } = req.query;
        
        // CONSTRUCCIÓN DE FILTROS
        const whereClause = {};

        if (query) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } }
            ];
        }

        if (category) {
            whereClause.category = category;
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        // CONSULTA CON FILTROS
        const products = await Product.findAll({
            where: whereClause,
            include: Review
        });
            
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};