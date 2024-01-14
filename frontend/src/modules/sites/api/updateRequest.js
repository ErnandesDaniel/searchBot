
import { axios } from '@/shared/axios.js';

import router  from '@/router/index.js'

import { useRequestsStore } from '../stores/requests.js';

async function updateRequest(updatedRequest, siteName){

	console.log(updatedRequest);
	
	const updateRequest=useRequestsStore().updateRequest;

	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.put(`${siteName}Requests/update`, {...updatedRequest});

	console.log(response);

	if(response.data.errorExist==false &&  response.data.actionMessage=='requestWasUpdated'){
		
		//Добавляем новый запрос в список запросов
		updateRequest(updatedRequest);
		
		//Переходим на стартовую страницу
		router.push({path:`/siteList/${siteName}/requestsList/`, replace:true});
		
	}

}

export { updateRequest };


















