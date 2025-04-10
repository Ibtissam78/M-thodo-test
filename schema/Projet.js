import mongoose, { Schema as _Schema, model } from 'mongoose';

const { Schema } = mongoose;

// Schéma pour un article du menu
const menuItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Le nom de l\'article est obligatoire'],
    },
    description: {
        type: String,
        required: [true, 'La description de l\'article est obligatoire'],
    },
    price: {
        type: Number,
        required: [true, 'Le prix de l\'article est obligatoire'],
    },
    options: [{
        optionName: {
            type: String,
            required: [true, 'Le nom de l\'option est obligatoire'],
        },
        additionalPrice: {
            type: Number,
            required: [true, 'Le prix supplémentaire pour cette option est obligatoire'],
        }
    }],
});

// Schéma pour un panier
const cartSchema = new Schema({
    userId: {
        type: _Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assurez-vous que vous avez un modèle d'utilisateur (User)
    },
    items: [{
        item: {
            type: _Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La quantité doit être au moins 1'],
        },
        options: [{
            type: String,
        }],
    }],
    total: {
        type: Number,
        default: 0,
    },
});

// Schéma pour une commande
const orderSchema = new Schema({
    userId: {
        type: _Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assurez-vous que vous avez un modèle d'utilisateur (User)
    },
    items: [{
        item: {
            type: _Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        options: [{
            type: String,
        }],
    }],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Préparation', 'Prête', 'Livrée', 'Annulée'],
        default: 'Préparation',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Schéma pour la gestion des paiements
const paymentSchema = new Schema({
    orderId: {
        type: _Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['En attente', 'Payée', 'Échouée'],
        default: 'En attente',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
});

// Modèles
const MenuItem = model('MenuItem', menuItemSchema);
const Cart = model('Cart', cartSchema);
const Order = model('Order', orderSchema);
const Payment = model('Payment', paymentSchema);

export default {
    MenuItem,
    Cart,
    Order,
    Payment,
};
