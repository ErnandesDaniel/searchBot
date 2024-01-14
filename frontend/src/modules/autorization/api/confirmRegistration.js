
import { axios } from '@/shared/axios.js'

async function confirmRegistration(data){
	
	let {confirmationToken}=data;
	
		//Пытаемся отправить запрос на сервер
		let response=await axios.post('users/confirmRegistration', {

			confirmationToken:confirmationToken,

		});

        console.log(response);
		
		return response;

}

export { confirmRegistration };