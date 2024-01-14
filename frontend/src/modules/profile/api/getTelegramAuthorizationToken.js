
import { axios } from '@/shared/axios.js';

async function getTelegramAuthorizationToken(){

	//Пытаемся отправить запрос на сервер
	let response=await axios.get('users/getTelegramAuthorizationToken');

	console.log(response);
	
	return response;

}

export { getTelegramAuthorizationToken };