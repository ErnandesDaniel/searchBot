
import { axios } from '@/shared/axios.js'

import router from '@/router'

import { useAutorizationStore } from '../stores/autorization.js';

async function registerNewUser(data){
	
	
	let setAutorizationData=useAutorizationStore().setAutorizationData;

		//Пытаемся отправить запрос на сервер
        let response=await axios.post('users/register', {...data});
			
		console.log(response);

		 if(response.data.errorExist==false && response.data.actionMessage=='checkEmail'){
			

			//Если ошибки нет, то:
			
			//Записываем логин и пароль в оперативную память для их использования
			//в другом компоненте
			setAutorizationData(data.email, data.password);
			
			//Переходим на страницу ввода кода подтверждения регистрации
			router.push({path: 'autorization/needForConfirmationEmail'});
				 
		}	
				
		return response;
	

}

export { registerNewUser };