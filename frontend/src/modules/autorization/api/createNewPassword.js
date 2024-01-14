
import { axios } from '@/shared/axios.js'

import router from '@/router'

async function createNewPassword(data){

		//Пытаемся отправить запрос на сервер
		let response=await axios.post('users/createNewPassword', {...data});
		
		console.log(response);
		
		if(response.data.errorExist==false && response.data.actionMessage=='passwordWasUpdated'){

			//Переходим на страницу входа
			router.replace({path: '/autorization'});

        }
				
		return response;


}

export { createNewPassword };