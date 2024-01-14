
import { axios } from '@/shared/axios.js'


async function getAutorizationToken(email, password){

		//Пытаемся отправить запрос на сервер
		let response=await axios.get('users/getAuthorizationToken', {

			params:{email:email, password:password}
					
		});
			
		console.log(response);

		return response;

}

export { getAutorizationToken };