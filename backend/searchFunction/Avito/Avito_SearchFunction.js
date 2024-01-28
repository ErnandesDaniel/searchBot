//Подключаем модели
const{Avito_RequestModel,}=require('../../models/models');

//Подключаем файл функции обработки запросов
const processRequest = require('./processRequest.js');

const { chromium }=require('playwright');
	
async function Avito_SearchFunction(){
	
	//Получаем из базы данных все запросы
	let requestsArray=await Avito_RequestModel.findAll();
	
	//Запускаем браузер
	let browser=await chromium.launch({headless:false,});
	
	//Для каждого запроса выполняем код
	for(let request of requestsArray){
			
		await processRequest(request, browser);
			
	}
	
	//Выключаем браузер после конца его использования в данной итерации функции
	await browser.close();
	
	//Запускаем функцию снова через 10 секунд
	setTimeout(Avito_SearchFunction, 10000);
	
}

//Запускаем функцию поиска объявлений на Avito
Avito_SearchFunction();