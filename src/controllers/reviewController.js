// Importamos modelos necesarios para reseñas
import models from "../models/index.js";
const { Review, Product, User } = models;

// FUNCIÓN GETREVIEWS: obtener reseñas de un producto

export const getReviews = async (req, res) => {
    try {
        // EXTRACCIÓN DE PARÁMETROS: id del producto
        const { productId } = req.params;

        // CONSULTA CON JOIN: incluye datos del usuario
        const reviews = await Review.findAll({
            where: { productoId: productId },
            include: [{
                model: User,
                attributes: ['nombre', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN CREATEREVIEW: crear nueva reseña

export const createReview = async (req, res) => {
    try {
        // EXTRACCIÓN DE DATOS: datos de la reseña
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // ID del usuario autenticado

        // VALIDACIÓN: verificar si ya existe una reseña
        const existingReview = await Review.findOne({
            where: { productoId: productId, usuarioId: userId }
        });

        if (existingReview) {
            return res.status(400).json({ message: "Ya has realizado una reseña para este producto" });
        }

        // CREACIÓN: nueva reseña
        const review = await Review.create({
            productoId: productId,
            usuarioId: userId,
            puntuacion: rating,
            comentario: comment
        });

        // ACTUALIZACIÓN: promedio de calificaciones del producto
        const reviews = await Review.findAll({
            where: { productoId: productId }
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.puntuacion, 0) / reviews.length;

        await Product.update(
            { rating: avgRating },
            { where: { id: productId } }
        );

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN UPDATEREVIEW: actualizar reseña existente

export const updateReview = async (req, res) => {
    try {
        // EXTRACCIÓN DE DATOS
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // ACTUALIZACIÓN: solo si el usuario es el autor
        const updated = await Review.update(
            { puntuacion: rating, comentario: comment },
            {
                where: {
                    id,
                    usuarioId: userId // Asegura que solo el autor puede modificar
                }
            }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ message: "Reseña no encontrada o no autorizado" });
        }

        res.json({ message: "Reseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// FUNCIÓN DELETEREVIEW: eliminar reseña

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await Review.destroy({
            where: {
                id,
                usuarioId: userId // Asegura que solo el autor puede eliminar
            }
        });

        if (!deleted) {
            return res.status(404).json({ message: "Reseña no encontrada o no autorizado" });
        }

        res.json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
