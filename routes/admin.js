const path = require('path');

const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const control = require('../controllers/admin');

router.get('/add-product',isAuth,control.getAddProduct);

router.get('/Aproducts',isAuth,control.getProducts);

router.post('/add-product',isAuth,control.postAddProduct);

router.get('/edit-product/:productId',isAuth,control.getEditProduct);

router.post('/edit-product', isAuth,control.postEditProduct);

router.post('/delete-product',isAuth, control.postDeleteProduct);

module.exports = router;
