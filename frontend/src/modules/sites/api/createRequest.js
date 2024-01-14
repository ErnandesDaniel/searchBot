
import { axios } from '@/shared/axios.js'

import router  from '@/router/index.js'

import { useRequestsStore } from '../stores/requests.js';

async function createRequest(newRequest, siteName){

	console.log(newRequest);
	
	const addRequest=useRequestsStore().addRequest;
			
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.post(`${siteName}Requests/create`, {...newRequest});

	console.log(response);

	if(response.data.errorExist==false &&  response.data.actionMessage=='requestWasCreated'){
		
		//Получаем id объекта запроса и добавляем его
		newRequest.id=response.data.content.id;
		
		//Добавляем новый запрос в список запросов
		addRequest(newRequest);
		
		//Переходим на стартовую страницу
		router.push({path:`/siteList/${siteName}/requestsList/`, replace:true});
		
	}

}

export { createRequest };