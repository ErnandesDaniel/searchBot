
const { Telegraf } = require('telegraf');

//Подключаем функцию для работы с токенами
const tokens=require('../utils/token.js');

//Подключаем модели
const {userModel, TelegramChatsModel} = require('../models/models');

//Создаем бота
const bot = new Telegraf(process.env.telegramBotAuthorizationToken);

bot.start((ctx)=>{
	
	//Приветственное сообщение
	const welcomeMessage=`
	
	Привет! Введи токен авторизации, чтобы получать уведомления о найденных объявениях!
	
	`;
	
	//Отправка приветственного сообщения с клавиатурой
	ctx.reply(welcomeMessage);
	
});

//Обработка команды для деавторизации пользователя
bot.command('deauthorization', async(ctx)=>{

	const chatId = ctx.message.chat.id;	
	
	//Получаем массив чатов телеграм, связанных с данным аккаунтом
	let arrayOfUserTelegramChats=await TelegramChatsModel.findAll({
						
		where:{idOfChat:chatId},
						
	});
	
	if (arrayOfUserTelegramChats.length>0){

		for(userTelegramChat of arrayOfUserTelegramChats){
			
			console.log(userTelegramChat.update);

			
			//Указываем, что чат был деавторизован
			await userTelegramChat.update({authorizationStatus:false});
		}
		
		ctx.reply('Вы были отписаны от всех уведомлений.');
		
	}else{

		ctx.reply('Вы не найдены');		
		
	}
	
});


//Обработка любого текстового сообщения
bot.on('text', async(ctx)=>{
	
	//Получаем текст сообщения и информацию о пользователе
	const confirmationToken=ctx.message.text;
	const chatId = ctx.message.chat.id;
	
	//Поверка на то, что получаемый текст не является командой
	if(confirmationToken[0]!='/'){
		
		//Проверяем токен подтверждения на валидность
		if(tokens.checkToken(confirmationToken)=='TokenIsValid'){
			
			//Декодируем токен
			let decodedToken=tokens.getDecodedToken(confirmationToken);

			if(decodedToken.TelegramAuthorizationToken==true){
				
				//Получаем id пользователя
				let idOfUser=decodedToken.id;			
							
				//Находим пользователя в базе данных
				const user=await userModel.findOne({
													
					attributes:['id', 'name'],
													
					where:{id:idOfUser},
					
					include:TelegramChatsModel,
												
				});
				
				//Получаем массив чатов телеграм, связанных с данным аккаунтом
				let userTelegramChat=user.telegramChats.find((el)=>{
					
					return el.idOfChat==chatId
					
				});
				
				
				if(userTelegramChat==null){
					
					await user.createTelegramChat({
						
							idOfChat:chatId,
						
							authorizationStatus:true
						
					});

				}else{
					
					//Указываем, что чат был авторизован
					await userTelegramChat.update({authorizationStatus:true});
					
				}
				
				//Обрабатываем невалидный токен
				ctx.reply(`
				
Вы были подписаны на уведомления от пользователя ${user.name}. Ждите прихода уведомлений
				
				`);
				
				
			}
			
		}else{
			
			//Обрабатываем невалидный токен
			ctx.reply(`Отправленный вами токен невалидный, попробуйте отправить другой!`);
			
		}
		
	}

});


bot.telegram.setMyCommands([
	
	{ command: "start", description: "Запустить бота" },
	{ command: "deauthorization", description: "Разлогинится в боте" },

]);

//Экспортируем объект маршрутизации
module.exports= bot;