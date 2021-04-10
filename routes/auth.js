const express= require('express');

const router = express.Router();

const Controller = require('../controllers/auth');

router.get('/login', Controller.getLogin);

router.get('/signup', Controller.getSignup);

router.post('/login', Controller.postLogin);

router.post('/signup', Controller.postSignup);

router.post('/logout', Controller.postLogout);

router.get('/reset', Controller.getReset);

router.post('/reset', Controller.postReset);

router.post('/reset/:token',  Controller.getNewPassword);

router.post('new-password', Controller.postNewPassword);


module.exports = router;
