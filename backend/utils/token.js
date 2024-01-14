
const jwt = require('jsonwebtoken');

//Параметры шифрования
const signOptions = {
	
	algorithm:  "HS256",//Указываем алгоритм шифрования
 
};

function createToken(payload){
	
	//let issuedAt = Date.now();//Нынешнее время (время создания токена)
	
	//Создаем нагрузку с email пользователя, временем создания токена и ролью пользователя
	//let payload = {id:Number(id), iat:issuedAt};
	
	let token = jwt.sign(payload, process.env.secretAuthorizationTokenKey, signOptions);
	
	return token;
	
}


//Создаем функцию для проверки токена аутентификации
let checkToken=(token)=>{
	
	//Результат проверки токена
	let result='';
	
	if(token!=null){
		
		try {
		
		  let decodedToken = jwt.verify(token, process.env.secretAuthorizationTokenKey, signOptions);
		  
			//если декодирование токена удастся, то токен действителен
			result='TokenIsValid';
			
			//Если токен устарел
			//result='TokenIsOutdated';
		  
		}catch(err){
			//Если произошла ошибка при декодировании токена:
			
			//Если декодирование токена не удастся, то токен недействителен
			result='TokenIsInvalid';
			
		}
	
	}else if(token==''){
		
		result='TokenIsEmpty';
		
	}

	return result;
	
}


let getDecodedToken=(token)=>{
	
	//Декодируем токен
	return jwt.decode(token, signOptions);
		
}

//Экспортируем объект с функциями для работы с токенами
module.exports={
	
	createToken,
	
	checkToken,
	
	getDecodedToken,
	
};









