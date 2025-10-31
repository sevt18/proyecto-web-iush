import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// Ver productos disponibles
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { isAvailable: true }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// Buscar productos
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.findAll({
            where: {
                isAvailable: true,
                [Op.or]: [
                    { nombre: { [Op.iLike]: `%${query}%` } },
                    { tipo: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error en la búsqueda', error: error.message });
    }
};

// Crear reseña de producto
const createReview = async (req, res) => {
    try {
        const { productId, puntuacion, comentario } = req.body;
        const userId = req.user.id;

        const review = await Review.create({
            productoId: productId,
            usuarioId: userId,
            puntuacion,
            comentario
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear reseña', error: error.message });
    }
};

// Ver reseñas de un producto
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findAll({
            where: { productoId: productId },
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
    }
};

export {
    getProducts,
    searchProducts,
    createReview,
    getProductReviews
};
