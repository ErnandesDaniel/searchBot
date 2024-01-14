const express = require('express');
const router = express.Router();

//Подключаем модуль с контроллером запросов на сайте FunPay
const controller=require('../../controllers/FunPayRequestController');

const isAuth= require('../../middlewares/isAuth.js');

//Определяем обработку запроса на регистрацию нового пользователя
router.post(

	'/create',
	
	isAuth,

	controller.create

);


//Определяем обработку запроса на регистрацию нового пользователя
router.put(

	'/update',
	
	isAuth,

	controller.update

);




//Определяем обработку запроса на регистрацию нового пользователя
router.delete(

	'/:id',
	
	isAuth,

	controller.delete

);


//Определяем обработку запроса на регистрацию нового пользователя
router.get(

	'/getAll',
	
	isAuth,

	controller.getAll

);


//Экспортируем объект маршрутизации
module.exports=router;