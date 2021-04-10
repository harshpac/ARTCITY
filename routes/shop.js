const path = require('path');

const express = require('express');

const router = express.Router();

const Controller = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', Controller.getEnter);

//router.get('/index', Controller.getIndex);

router.get('/products', Controller.getProducts);

router.get('/products/:productId', Controller.getProduct);

router.get('/cart',isAuth, Controller.getCart);

router.post('/cart',isAuth, Controller.postCart);

router.get('/trending', isAuth, Controller.getTrending);

router.get('/author/:authorId',isAuth,Controller.getAuthor); //new line

router.get('/check',isAuth,Controller.getCheck);

router.post('/cart-delete-item',isAuth, Controller.postcartDeleteProduct);

router.post('/create-order',isAuth, Controller.postOrder);

router.post('/like',isAuth, Controller.postLike);

router.get('/orders', isAuth, Controller.getOrders);

router.get('/checkout', Controller.getCheckout);


module.exports = router;
