
//Подключаем класс для создания потоков
const { Worker }=require('worker_threads');

function searchFunction(){
	
	let AvitoWorker = new Worker('./searchFunction/Avito/Avito_SearchFunction.js');

	let FunPayWorker = new Worker('./searchFunction/FunPay/FunPay_SearchFunction.js');
	
}

//Экспортируем объект маршрутизации
module.exports= searchFunction;