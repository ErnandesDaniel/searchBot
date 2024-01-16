//Подключаем модели

const{
	
	Avito_RequestModel,
	
}=require('../../models/models');

function wait(milliseconds) {
			
	return new Promise(resolve => setTimeout(resolve, milliseconds));
		
}

//Подключаем файл функции обработки запросов
const processRequest = require('./processRequest.js');

const { chromium }=require('playwright');

//Запускаем браузер
let browser = null;
			
//Открываем страницу
let searchPage = null;
	
async function Avito_SearchFunction(){
	
	//При первом запуске функции создаем браузер и страницу для поиска данных
	if(browser==null){
		
		//Запускаем браузер
		browser = await chromium.launch({headless:true,});
			
		//Открываем страницу
		searchPage = await browser.newPage();
		
	}
	
	//Получаем из базы данных все запросы
	let requestsArray=await Avito_RequestModel.findAll();


	//Для каждого запроса выполняем код
	for(let request of requestsArray){
			
		await processRequest(request, searchPage);
		
		await wait(5000);
			
	}
	
	
	setTimeout(Avito_SearchFunction, 10000);
		
	
}

//Запускаем функцию поиска объявлений на Avito
Avito_SearchFunction();