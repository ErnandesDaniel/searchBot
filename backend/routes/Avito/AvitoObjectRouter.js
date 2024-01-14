const express = require('express');
const router = express.Router();

//Подключаем модуль с контроллером запросов на сайте FunPay
const controller=require('../../controllers/AvitoObjectController');

const isAuth= require('../../middlewares/isAuth.js');

//Определяем обработку запроса на регистрацию нового пользователя
router.put(

	'/:requestId/update',
	
	isAuth,

	controller.update

);


//Определяем обработку запроса на регистрацию нового пользователя
router.delete(

	'/:requestId/delete/:objectId',
	
	isAuth,

	controller.delete

);


//Определяем обработку запроса на регистрацию нового пользователя
router.get(

	'/:requestId/getAll',
	
	isAuth,

	controller.getAll

);


//Экспортируем объект маршрутизации
module.exports=router;