
import { axios } from '@/shared/axios.js'


async function logInByLink(loginConfirmationToken){

		//Пытаемся отправить запрос на сервер
		let response=await axios.get('users/logInByLink', {

			params:{loginConfirmationToken:loginConfirmationToken}
					
		});
			
		console.log(response);

		return response;

}

export { logInByLink };