import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import  {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addItemToCart,
    applyPromoCode,
    placeOrder,
    trackOrderStatus,
    cancelOrder,
    simulatePayment,
} from './controllers/projetcontrollers.js';
import { middlewaresjwtVerify } from './middlewares/middlewaresjwtVerify.js';

// Import des contrôleurs
// Import du middleware JWT

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/restaurant", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connexion à MongoDB réussie !');
    })
    .catch((err) => console.error('Connexion à MongoDB échouée !', err));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Définir les routes pour le contrôleur de menu
app.post('/menu', addMenuItem); // Ajouter un élément au menu
app.put('/menu/:id', updateMenuItem); // Mettre à jour un élément du menu
app.delete('/menu/:id', deleteMenuItem); // Supprimer un élément du menu

// Routes pour le panier
app.post('/cart/:userId', addItemToCart); // Ajouter un article au panier
app.post('/cart/promo', applyPromoCode); // Appliquer un code promo

// Routes pour la commande
app.post('/order/:userId', placeOrder); // Passer une commande
app.get('/order/status/:orderId', trackOrderStatus); // Suivre le statut de la commande
app.delete('/order/:orderId', cancelOrder); // Annuler une commande
app.post('/order/payment/:orderId', simulatePayment); // Simuler un paiement

// Route d'accueil
app.get('/', (req, res) => {
    console.log("Headers:", req.headers);
    res.send('<h1>Bienvenue sur notre page d\'accueil!</h1>');
});

// Démarrer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
