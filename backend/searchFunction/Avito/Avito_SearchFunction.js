//Подключаем модели

const{
	
	Avito_RequestModel,
	
}=require('../../models/models');

function wait(milliseconds) {
			
	return new Promise(resolve => setTimeout(resolve, milliseconds));
		
}

//Подключаем файл функции обработки запросов
const processRequest = require('./processRequest.js');

async function Avito_SearchFunction(){
		
	//Получаем из базы данных все запросы
	let requestsArray=await Avito_RequestModel.findAll();
		
	//Для каждого запроса выполняем код
	for(let request of requestsArray){
			
		await processRequest(request);
		
		await wait(20000);
			
	}
		
	setTimeout(Avito_SearchFunction, 60000);
		
	
}

//Запускаем функцию поиска объявлений на Avito
Avito_SearchFunction();