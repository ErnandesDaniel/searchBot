
import { axios } from '@/shared/axios.js'

import router from '@/router'

import { useAutorizationStore } from '../stores/autorization.js';

async function recoverPassword(email){
	
		let setAutorizationData=useAutorizationStore().setAutorizationData;

		//Пытаемся отправить запрос на сервер
		let response=await axios.post('users/recoverPassword', {email:email});
		
		if(response.data.errorExist==false && response.data.actionMessage=='checkEmail'){
			
			//setAutorizationData(email,'');
	
			//router.push({path: '/autorization/createNewPassword'});
			
        }
				
		return response;

}

export { recoverPassword };