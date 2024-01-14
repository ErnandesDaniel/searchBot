
import { getAutorizationToken } from '@/modules/autorization';

import { uploadingDataDuringAuthorization } from '@/shared/services/uploadingDataDuringAuthorization.js';

import { useAutorizationStore } from '@/modules/autorization';

import { getMainDataOfUser } from '@/modules/profile';

import router from '@/router';

import { computed } from 'vue';


async function authorize(email, password){
	
	const autorizationStore=useAutorizationStore();
	
	const logIn=autorizationStore.logIn;

	try{
		
		//Отправляем запрос на сервер для получения токена авторизации
		let response=await getAutorizationToken(email, password);

		console.log(response);
		
		if(response.data.errorExist==false && response.data.actionMessage=='tokenWasCreated'){

			let authorizationToken=response.data.content.token;

			//Устанавливаем значение статуса авторизации на правду
			localStorage.setItem('statusOfAuthorization', 'true');

			//Записываем токен авторизации
			localStorage.setItem('authorizationToken', authorizationToken);

            //Производим авторизацию в приложении
            logIn(authorizationToken);
			
            //Переходим на страницу списка сайтов
            router.push('/');
			
			//Получаем данные о пользователе
			getMainDataOfUser();
			
		}
		
		return response;
		
	}catch(error){

		console.log(error);

		//В случае ошибки подключения пишем, что сервер не допступен
		if(error.code=='ERR_NETWORK'){

			return {errorExist:true, actionMessage:'serverIsNotAvailable'};

		}
	
	}
	
}


export { authorize };