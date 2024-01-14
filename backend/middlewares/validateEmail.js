
//Подключаем модуль для проверки email
const emailValidator = require('email-validator');

let validateEmail=async(req, res, next)=>{

	//Получаем ссылку на тело запроса пользователя
	let data=req.body;
	
	//Изменяем все буквы в email на строчные
	data.email=data.email.toLowerCase();
	
	//Проверяем email на корректность:
	
	//Если email некорректный, то отправляем сообщение об ошибке
	if(emailValidator.validate(data.email)==false){
		
		//Отправляем ответ пользователю о том, что email некорректный
		res.send({errorExist:true, actionMessage:'invalidEmail'});
	
	//Иначе дальше продолжаем работу и вызываем следующую функцию
	}else next();

}

//Экспортируем объект маршрутизации
module.exports= validateEmail;




