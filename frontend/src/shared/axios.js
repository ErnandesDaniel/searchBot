
import { useMainDataStore } from '@/shared/stores/mainData.js';

//Создаем переменную для адреса REST API
let baseURL='';

//Настриваем значение REST API в зависимости от типа запуска приложения -
//в режиме разработки или в продакшн режиме
if(process.env.NODE_ENV=='development'){
	//Если приложение запущено в режиме разработки, то соединяемся с сервером API следующим образом:
	baseURL='http://'+window.location.hostname+':'+process.env.VUE_APP_PORT+'/api/';

}else{
//Если приложение запущено в продакшн режиме, то соединяеся с источником:

	baseURL=window.location.origin+'/api/';
}

let axiosConfig={
		 
	//baseURL: 'http://localhost:448/api/',  //Работа на локальном сервере для разработки

	baseURL:baseURL,

	timeout: 1500, 
		
	headers:{'Content-Type': 'application/json; charset=utf-8'},
		
};

import * as axiosLibrary from 'axios';

function createAxios(){
	
	let localAxios=axiosLibrary.create(axiosConfig);

	//Делаем обработку ошибок при проблемах со связью с сервером
	localAxios.interceptors.response.use(
		
		async (response)=>{return response},
	  
		async (error)=>{
			
			console.log(error.toJSON());
			
			let errorResponse={};

			//В случае ошибки подключения пишем, что сервер не допступен
			if(
			
				error.code=='ERR_NETWORK'|| 
				
				error.code=='ECONNABORTED'|| 
				
				error.message=='Network Error'||
				
				error.message=='Request failed with status code 404'
				
			){
						
				errorResponse.data={errorExist:true, actionMessage:'serverIsNotAvailable'};
				
				//Показываем в приложении сообщение об ошибке загрузки сети
				useMainDataStore().setErrorMessageText('Ошибка соединения с сервером. Попробуйте позже.');

				return errorResponse;

			}
			
		}
		
	);	
		
	return localAxios;
	
}

let axios=createAxios();


function setAxiosAuthorizationHeader(authorizationToken){

	//Перенастраиваем заголовки авторизации запросов
	axiosConfig.headers.Authorization=`Bearer ${authorizationToken}`;
	
	axios=createAxios();	
	
}


export { axios, setAxiosAuthorizationHeader, axiosConfig };


