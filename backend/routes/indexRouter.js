const express = require('express');
const router = express.Router();

const FunPayRequestRouter = require('./FunPay/FunPayRequestRouter');
const FunPayObjectRouter = require('./FunPay/FunPayObjectRouter');

const AvitoRequestRouter = require('./Avito/AvitoRequestRouter');
const AvitoObjectRouter = require('./Avito/AvitoObjectRouter');

const userRouter = require('./userRouter');

router.use('/users', userRouter);

router.use('/FunPayRequests', FunPayRequestRouter);
router.use('/FunPayObjects', FunPayObjectRouter);

router.use('/AvitoRequests', AvitoRequestRouter);
router.use('/AvitoObjects', AvitoObjectRouter);

module.exports = router;
