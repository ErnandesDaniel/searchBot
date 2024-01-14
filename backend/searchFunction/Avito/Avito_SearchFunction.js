
const{
	
	Avito_RequestModel,
	
}=require('../../models/models');

//Подключаем файл функции обработки запросов
const processRequest = require('./processRequest.js');

async function Avito_SearchFunction(){
		
	//Получаем из базы данных все запросы
	let requestsArray=await Avito_RequestModel.findAll();
		
	//Для каждого запроса выполняем код
	for(let request of requestsArray){
			
		await processRequest(request);
			
	}
		
	setTimeout(Avito_SearchFunction, 5000);
		
	
}

//Запускаем функцию поиска объявлений на Avito
Avito_SearchFunction();