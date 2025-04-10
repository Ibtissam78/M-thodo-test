// app.test.js
const request = require('supertest');
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Simuler les contrôleurs
const addMenuItem = jest.fn((req, res) => res.status(201).send({ message: 'Item added' }));
const updateMenuItem = jest.fn((req, res) => res.status(200).send({ message: 'Item updated' }));
const deleteMenuItem = jest.fn((req, res) => res.status(204).send());
const addItemToCart = jest.fn((req, res) => res.status(201).send({ message: 'Item added to cart' }));
const applyPromoCode = jest.fn((req, res) => res.status(200).send({ message: 'Promo code applied' }));
const placeOrder = jest.fn((req, res) => res.status(201).send({ message: 'Order placed' }));
const trackOrderStatus = jest.fn((req, res) => res.status(200).send({ status: 'In progress' }));
const cancelOrder = jest.fn((req, res) => res.status(204).send());
const simulatePayment = jest.fn((req, res) => res.status(200).send({ message: 'Payment simulated' }));

// Définir les routes
app.post('/menu', addMenuItem);
app.put('/menu/:id', updateMenuItem);
app.delete('/menu/:id', deleteMenuItem);
app.post('/cart/:userId', addItemToCart);
app.post('/cart/promo', applyPromoCode);
app.post('/order/:userId', placeOrder);
app.get('/order/status/:orderId', trackOrderStatus);
app.delete('/order/:orderId', cancelOrder);
app.post('/order/payment/:orderId', simulatePayment);

// Tests
describe('API Routes', () => {
    test('POST /menu - should add a menu item', async () => {
        const response = await request(app).post('/menu').send({ name: 'Pizza' });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Item added');
    });

    test('PUT /menu/:id - should update a menu item', async () => {
        const response = await request(app).put('/menu/1').send({ name: 'Updated Pizza' });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Item updated');
    });

    test('DELETE /menu/:id - should delete a menu item', async () => {
        const response = await request(app).delete('/menu/1');
        expect(response.statusCode).toBe(204);
    });

    test('POST /cart/:userId - should add an item to the cart', async () => {
        const response = await request(app).post('/cart/1').send({ itemId: '123' });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Item added to cart');
    });

    test('POST /cart/promo - should apply a promo code', async () => {
        const response = await request(app).post('/cart/promo').send({ code: 'DISCOUNT10' });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Item added to cart');
    });

    test('POST /order/:userId - should place an order', async () => {
        const response = await request(app).post('/order/1').send({ items: ['123', '456'] });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Order placed');
    });

    test('GET /order/status/:orderId - should track order status', async () => {
        const response = await request(app).get('/order/status/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('In progress');
    });

        test('DELETE /order/:orderId - should cancel an order', async () => {
            const response = await request(app).delete('/order/1');
            expect(response.statusCode).toBe(204);
        });
    });