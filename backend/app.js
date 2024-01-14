//Подключаем пакет dotenv для чтения переменных из файла .env в Node
require('dotenv').config();
//Задаем общие настройки приложения и прописываем необходимые запросы к библиотекам
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

//Подключаем файлы моделей
const models = require('./models/models');

//Подключаем файл базы данных
const sequelize = require('./database');

//Подключаем файл телеграм-бота
const telegramBot = require('./TelegramBot/telegramBot.js');

//Подключаем файл функции поиска объявлений
const searchFunction = require('./searchFunction/searchFunction.js');

//Создаем приложение express
const app=express();

//Позволяем приложению использовать обработку JSON данных
app.use(express.json());

//Разрешаем CORS политику для запросов - можно обращаться к серверу с любого источника - сайта/мобильного приложения
app.use(cors());

//Подключаем модуль с определенными маршрутами
const router = require('./routes/indexRouter');

//Используем объект router с определенными маршрутами в экземпляре приложения
app.use('/api', router);

//Путь к папке с продакшн приложением Vue
const pathToFrontendDirectory=path.resolve(__dirname,process.env.pathToFrontendDirectory);

//Для внутренних запросов между файлами (запросы от index.html к css, js и другим) в папке с приложением vue
app.use(express.static(pathToFrontendDirectory))

//Обработка оставшихся get запросов, которые не подошли не к одному верхнему каналу
app.get('*',(req, res)=>{
	
	res.sendFile(pathToFrontendDirectory+'/'+process.env.nameOfIndexFile);
	
});


//Создаем функцию для запуска сервера
const start = async () => {
    try{
		
		//Авторизируем ORM sequelize
        await sequelize.authenticate();
		
		//Если нет необходимых таблиц, то мы их создаем
        await sequelize.sync();
		
		//Запускаем телеграм-бота
		telegramBot.launch();
		
		//Запускаем функцию поиска объявлений
		searchFunction();
		
		//Запускаем сервер на необходимом порту
        const server=app.listen(process.env.VUE_APP_PORT,async()=>{
			
			console.log(`Server started on port ${process.env.VUE_APP_PORT}`);
			
		});
		
	} catch (e) {
		console.log(e)
	}
}

//Запускаем сервер
start();











