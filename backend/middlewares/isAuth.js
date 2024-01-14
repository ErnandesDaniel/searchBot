
//Подключаем функцию для работы с токенами доступа
const tokens=require('../utils/token.js');

let isAuth=async(req, res, next)=>{
	
	//Заголовок авторизации
	let authHeader=req.headers.authorization;
	
	//Токен авторизации
	let token='';
	
	//Если заголовок авторизации определен
	if(authHeader){
		
		//Получаем значение токена авторизации
		token = authHeader.split(' ')[1];
		
	}
	
	if(tokens.checkToken(token)!='TokenIsValid'){
		
		//Отправляем ответ пользователю о том, что токен недействителен
		res.send({errorExist:true, actionMessage:'invalidToken'});
		
	}else{
		
		req.token=token;
	
		next();
	
	}

}

//Экспортируем объект маршрутизации
module.exports= isAuth;














