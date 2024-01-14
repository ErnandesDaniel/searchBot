const express = require('express');
const router = express.Router();

//Подключаем модуль с контроллером пользователя
const сontroller = require('../controllers/userController');

//Пдключаем мидлвейр для авторизации
const isAuth= require('../middlewares/isAuth.js');

//Определяем обработку получения пользователем токена авторизации
router.get(

	'/getAuthorizationToken',

	сontroller.getAuthorizationToken

);

//Определяем обработку отправки пользователю на почту магической ссылки для входа
router.get(

	'/getAuthorizationLink',

	сontroller.getAuthorizationLink

);

//Определяем обработку авторизации пользователя через магическую ссылку
router.get(

	'/logInByLink',

	сontroller.logInByLink

);


//Определяем обработку запроса на регистрацию нового пользователя
router.post(

	'/register',

	сontroller.create

);


//Определяем обработку запроса на подтверждение регистрации пользователем
router.post(

	'/confirmRegistration',

	сontroller.confirmRegistration

);


//Определяем обработку запроса на восстановление пароля
router.post(

	'/recoverPassword',

	сontroller.recoverPassword

);

//Определяем обработку запроса на регистрацию нового пользователя
router.post(

	'/createNewPassword',

	сontroller.createNewPassword

);

//Определяем обработку запроса на регистрацию нового пользователя
router.put(

	'/updateMainData',
	
	isAuth,

	сontroller.updateMainData

);

//Определяем обработку запроса на регистрацию нового пользователя
router.get(

	'/getMainData',
	
	isAuth,

	сontroller.getMainData

);

//Определяем обработку получения пользователем токена для авторизации в телеграмм-боте
router.get(

	'/getTelegramAuthorizationToken',
	
	isAuth,

	сontroller.getTelegramAuthorizationToken

);

//Экспортируем объект маршрутизации
module.exports=router;

