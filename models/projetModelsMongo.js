import mongoose from 'mongoose'; // Requis pour les schémas et modèles

// Ajouter un article au menu
const addMenuItem = (menuItemData) => {
    const newItem = new MenuItem(menuItemData);
    newItem.save();
    return newItem;
};

// Obtenir tous les articles du menu
const getMenuItems = async () => {
    const items = await MenuItem.find();
    return items;
};

// Trouver un article par son identifiant
const findMenuItemById = async (id) => {
    const item = await MenuItem.findOne({ _id: id });
    return item;
};

// Ajouter un article au panier
const addItemToCart = async (userId, itemData) => {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
    }

    const item = await MenuItem.findById(itemData.itemId);

    if (!item) {
        throw new Error("Article non trouvé");
    }

    const existingItem = cart.items.find((cartItem) => cartItem.item.toString() === itemData.itemId.toString());

    if (existingItem) {
        existingItem.quantity += itemData.quantity;
    } else {
        cart.items.push({
            item: itemData.itemId,
            quantity: itemData.quantity,
            options: itemData.options,
        });
    }

    cart.total += item.price * itemData.quantity;

    await cart.save();
    return cart;
};

// Appliquer un code promo
const applyPromoCode = async (userId, promoCode) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new Error("Panier introuvable");
    }

    if (promoCode === "PROMO10") {
        cart.total *= 0.9; // Appliquer une réduction de 10%
    }

    await cart.save();
    return cart;
};

// Passer une commande
const placeOrder = async (userId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        throw new Error("Panier vide");
    }

    const order = new Order({
        userId,
        items: cart.items,
        total: cart.total,
    });

    await order.save();

    // Vider le panier après la commande
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return order;
};

// Suivi du statut de la commande
const trackOrderStatus = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Commande non trouvée");
    }

    return order.status;
};

// Annuler une commande avant validation
const cancelOrder = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Commande non trouvée");
    }

    if (order.status === "Préparation") {
        order.status = "Annulée";
        await order.save();
        return order;
    } else {
        throw new Error("Impossible d'annuler une commande déjà validée");
    }
};

// Simuler un paiement
const simulatePayment = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Commande non trouvée");
    }

    // Simuler un paiement réussi
    order.status = "Payée";
    await order.save();
    return order;
};

// Export des fonctions pour les rendre accessibles dans d'autres fichiers
export {
    addMenuItem,
    getMenuItems,
    findMenuItemById,
    addItemToCart,
    applyPromoCode,
    placeOrder,
    trackOrderStatus,
    cancelOrder,
    simulatePayment,
    
    
};
