//Подключаем модели

const{
	
	FunPay_RequestModel,
	
}=require('../../models/models');

//Подключаем файл функции обработки запросов
const processRequest = require('./processRequest.js');

async function FunPay_SearchFunction(){
		
	//Получаем из базы данных все запросы
	let requestsArray=await FunPay_RequestModel.findAll();
		
	//Для каждого запроса выполняем код
	for(let request of requestsArray){
			
		await processRequest(request);
			
	}
		
	//setTimeout(FunPay_SearchFunction, 1000);
		
	
}

//Запускаем функцию поиска объявлений на FunPay
FunPay_SearchFunction();