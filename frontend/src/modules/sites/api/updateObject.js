
import { axios } from '@/shared/axios.js';

import router  from '@/router/index.js'

async function updateObject(siteName, requestId, objectId, newState){
	
	//Пытаемся отправить запрос на сервер для изменения данных о товаре (видимости товара)
	let response=await axios.put(

		`${siteName}Objects/${requestId}/update/`,

		{objectId:objectId, ...newState}

	);
	
	console.log(response);

	return response;

}

export { updateObject };


















