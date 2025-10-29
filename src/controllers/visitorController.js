const Product = require('../models/Product');
const Review = require('../models/Review');

// Ver productos disponibles
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isAvailable: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// Buscar productos
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({
            $and: [
                { isAvailable: true },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error en la búsqueda', error: error.message });
    }
};

// Crear reseña de producto
const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment
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
        const reviews = await Review.find({ product: productId })
            .populate('user', 'username');
        
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
    }
};

module.exports = {
    getProducts,
    searchProducts,
    createReview,
    getProductReviews
};