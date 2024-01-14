
//Подключаем файл функции поиска объявлений на Авито
//const Avito_SearchFunction = require('./Avito/Avito_SearchFunction.js');

//Подключаем файл функции поиска объявлений на FunPay
//const FunPay_SearchFunction = require('./FunPay/FunPay_SearchFunction.js');

//Подключаем класс для создания потоков
const { Worker }=require('worker_threads');

function searchFunction(){
	
	
	//let AvitoWorker = new Worker('./searchFunction/Avito/Avito_SearchFunction.js');

	//let FunPayWorker = new Worker('./searchFunction/FunPay/FunPay_SearchFunction.js');
	
}

//Экспортируем объект маршрутизации
module.exports= searchFunction;