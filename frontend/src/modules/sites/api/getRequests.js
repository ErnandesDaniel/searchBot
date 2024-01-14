
import { axios } from '@/shared/axios.js'

import { useRequestsStore } from '../stores/requests.js';

async function getRequests(siteName){
	
	const setRequestsList=useRequestsStore().setRequestsList;
			
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.get(`${siteName}Requests/getAll`);

	console.log(response);

	if(response.data.errorExist==false){
		
		//Получаем список запросов
		let requestsList=response.data.content.listOfObjects;
		
		//Устанавливаем список запросов
		setRequestsList(requestsList);

	}

	return response;

}

export { getRequests };
















