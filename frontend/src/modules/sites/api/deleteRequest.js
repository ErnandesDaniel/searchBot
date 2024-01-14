
import { axios } from '@/shared/axios.js'

import { useRequestsStore } from '../stores/requests.js';

async function deleteRequest(siteName, id){
	
	const deleteRequest=useRequestsStore().deleteRequest;
			
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	let response=await axios.delete(`${siteName}Requests/${id}`);

	console.log(response);

	if(response.data.errorExist==false){

		//Удаляем запрос по id
		deleteRequest(id);

	}

	return response;

}

export { deleteRequest };
















