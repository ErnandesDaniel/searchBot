
import { axios } from '@/shared/axios.js'

import { useRequestsStore } from '../stores/requests.js';

async function getObjects(siteName, requestId, page, size){
	
	const setRequestsList=useRequestsStore().setRequestsList;
			
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.get(`${siteName}Objects/${requestId}/getAll?page=${page}&size=${size}`);

	console.log(response);

	return response;

}

export { getObjects };
















