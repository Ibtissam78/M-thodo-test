// const { body } = require('express-validator');
// import body from 'express-validator';

const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, options } = req.body;
        const newItem = await create({ name, description, price, options });

        res.status(200).send({
            message: 'Article du menu ajouté avec succès',
            data: newItem,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de l\'ajout de l\'article au menu', details: err.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, options } = req.body;

        const updatedItem = await findByIdAndUpdate(id, { name, description, price, options }, { new: true });
        
        if (!updatedItem) {
            return res.status(404).send({ error: 'Article non trouvé' });
        }

        res.status(200).send({
            message: 'Article du menu mis à jour avec succès',
            data: updatedItem,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la mise à jour de l\'article du menu', details: err.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).send({ error: 'Article non trouvé' });
        }

        res.status(200).send({
            message: 'Article du menu supprimé avec succès',
            data: deletedItem,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la suppression de l\'article du menu', details: err.message });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const { itemId, quantity, options } = req.body;
        const { userId } = req.params;

        const cart = await findOne({ userId });

        if (!cart) {
            return res.status(404).send({ error: 'Panier introuvable' });
        }

        const item = await findById(itemId);

        if (!item) {
            return res.status(404).send({ error: 'Article non trouvé' });
        }

        cart.items.push({ item, quantity, options });
        cart.total += item.price * quantity;

        await cart.save();

        res.status(200).send({
            message: 'Article ajouté au panier',
            data: cart,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de l\'ajout de l\'article au panier', details: err.message });
    }
};

const applyPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        const cart = await findOne({ userId });

        if (!cart) {
            return res.status(404).send({ error: 'Panier introuvable' });
        }

        if (promoCode === 'PROMO10') {
            cart.total = cart.total * 0.9; // Appliquer une réduction de 10%
        }

        await cart.save();

        res.status(200).send({
            message: 'Code promo appliqué avec succès',
            data: cart,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de l\'application du code promo', details: err.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ error: 'Panier vide' });
        }

        const order = new Order({
            userId,
            items: cart.items,
            total: cart.total,
            status: 'Préparation',
            createdAt: new Date(),
        });

        await order.save();

        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).send({
            message: 'Commande passée avec succès',
            data: order,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la passation de la commande', details: err.message });
    }
};

const trackOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await _findById(orderId);

        if (!order) {
            return res.status(404).send({ error: 'Commande non trouvée' });
        }

        res.status(200).send({
            message: 'Statut de la commande',
            status: order.status,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors du suivi de la commande', details: err.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await _findById(orderId);

        if (!order) {
            return res.status(404).send({ error: 'Commande non trouvée' });
        }

        if (order.status === 'Préparation') {
            order.status = 'Annulée';
            await order.save();

            res.status(200).send({
                message: 'Commande annulée avec succès',
                data: order,
            });
        } else {
            res.status(400).send({ error: 'Impossible d\'annuler une commande déjà validée' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de l\'annulation de la commande', details: err.message });
    }
};

const simulatePayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await _findById(orderId);

        if (!order) {
            return res.status(404).send({ error: 'Commande non trouvée' });
        }

        order.status = 'Payée';
        await order.save();

        res.status(200).send({
            message: 'Paiement simulé avec succès',
            data: order,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la simulation du paiement', details: err.message });
    }
};

export {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addItemToCart,
    applyPromoCode,
    placeOrder,
    trackOrderStatus,
    cancelOrder,
    simulatePayment,
};

