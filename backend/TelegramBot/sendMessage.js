
const { Telegraf } = require('telegraf');

//Создаем бота
const bot = new Telegraf(process.env.telegramBotAuthorizationToken);

async function sendMessage(chatId, nameOfSite, objectsAmount){
 
	await bot.telegram.sendMessage(chatId, `С сайта ${nameOfSite} было получено ${objectsAmount} объявлений`);	
	
}

//Экспортируем объект маршрутизации
module.exports= sendMessage;