// Importamos modelos necesarios para productos
import models from "../models/index.js";
const { Product, Review, Inventory } = models;
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

export const createProduct = async (req, res) => {
    try {
        // EXTRACCIÓN DE DATOS: datos del producto del body
        const { nombre, tipo, fechaProduccion, codigoTrazabilidad } = req.body;

        // CREACIÓN: nuevo producto en la base de datos
        const product = await Product.create({
            nombre,
            tipo,
            fechaProduccion,
            codigoTrazabilidad
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN UPDATEPRODUCT: actualizar producto existente

export const updateProduct = async (req, res) => {
    try {
        // EXTRACCIÓN DE PARÁMETROS Y DATOS
        const { id } = req.params;
        const { nombre, tipo, fechaProduccion, codigoTrazabilidad } = req.body;

        // ACTUALIZACIÓN: modificar producto
        await Product.update(
            { nombre, tipo, fechaProduccion, codigoTrazabilidad },
            { where: { id } }
        );

        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN DELETEPRODUCT: eliminar producto

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

export const searchProducts = async (req, res) => {
    try {
        // EXTRACCIÓN DE QUERY PARAMS: filtros de búsqueda
        const { query, tipo, minRating, maxRating } = req.query;

        // CONSTRUCCIÓN DE FILTROS
        const whereClause = {};

        if (query) {
            whereClause[Op.or] = [
                { nombre: { [Op.iLike]: `%${query}%` } },
                { tipo: { [Op.iLike]: `%${query}%` } }
            ];
        }

        if (tipo) {
            whereClause.tipo = tipo;
        }

        if (minRating || maxRating) {
            whereClause.rating = {};
            if (minRating) whereClause.rating[Op.gte] = parseFloat(minRating);
            if (maxRating) whereClause.rating[Op.lte] = parseFloat(maxRating);
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
