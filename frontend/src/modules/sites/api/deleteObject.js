
import { axios } from '@/shared/axios.js'

import { useRequestsStore } from '../stores/requests.js';

async function deleteObject(siteName, requestId, objectId){
			
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.delete(`${siteName}Objects/${requestId}/delete/${objectId}`);

	console.log(response);

	return response;

}

export { deleteObject };
















