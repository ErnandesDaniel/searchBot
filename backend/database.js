
//Подключаем пакет dotenv для чтения переменных из файла .env в Node
require('dotenv').config();

const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.dataBase_databaseName, // Название БД
    process.env.dataBase_user, // Пользователь
    process.env.dataBase_password, // ПАРОЛЬ
    {
        dialect: 'mysql',
        host: process.env.dataBase_host,
        port: process.env.dataBase_port,
		
		logging:false,//Отключаем логирование Sequlize
		
		define:{
			
			timestamps:false,//Отключаем временные метки создания и удаления
			
		},
		
    }
)


