
import { useAutorizationStore } from '@/modules/autorization';

import { useMainDataStore } from '@/shared/stores/mainData.js';

import { getMainDataOfUser } from '@/modules/profile';

import { computed } from 'vue';

async function loading(){
	
	const mainDataStore=useMainDataStore();

	const autorizationStore=useAutorizationStore();

	const setMainDataOfUser=mainDataStore.setMainDataOfUser;

	const logIn=autorizationStore.logIn;		
	
	const statusOfAuthorization=localStorage.getItem('statusOfAuthorization');

	const authorizationToken=localStorage.getItem('authorizationToken');
	
	if(statusOfAuthorization!='true'){
			
		localStorage.setItem('statusOfAuthorization', 'false');

		localStorage.setItem('authorizationToken', '');

	}

	if(authorizationToken==null){

		localStorage.setItem('statusOfAuthorization', 'false');

		localStorage.setItem('authorizationToken', '');

	}

	//Если пользователь авторизован, то пытаемся получить данные с сервера
	if(statusOfAuthorization=='true' && authorizationToken!=''){

		//Авторизуем пользователя
		logIn(authorizationToken);
		
		let mainDataOfUser;
		
		try{
			
			mainDataOfUser=JSON.parse(localStorage.getItem('mainDataOfUser'));

			//Устнавливаем основные данные пользователя, сохраненные локально
			setMainDataOfUser(mainDataOfUser);
			
		}catch(error){
			
		}
		
		//Загрузка основных данных из интернета во время авторизации
		//uploadingDataDuringAuthorization();
					
		//Получаем данные о пользователе
		getMainDataOfUser();

	}
	
}


export { loading };