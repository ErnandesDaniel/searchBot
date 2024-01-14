
import { axios } from '@/shared/axios.js'

import router from '@/router'

import { authorize } from '@/shared/services/authorize.js';


async function sendRegistrationConfirmationCode(data){
	
	let {email, password, confirmationCode}=data;

		//Пытаемся отправить запрос на сервер
        let response=await axios.post('sendRegistrationConfirmationCode',{

			email:email,
		
			password:password,
		
			confirmationCode:confirmationCode,
			
        });

        console.log(response);
		
		if(response.data.errorExist==false && response.data.actionMessage=='emailHasBeenConfirmed'){

			//Если ошибки нет, то далее отправляем запрос на сервер для полученя токена авторизации
			//и производим авторизацию в приложении:
			authorize(email, password);
			
		}

		return response;
	

}

export { sendRegistrationConfirmationCode };