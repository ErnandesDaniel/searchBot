
import { useAutorizationStore } from '@/modules/autorization';

import router from '@/router/index.js'

async function disauthorize(){
	
	//Устанавливаем данные для входа в локальную память
    localStorage.setItem('statusOfAuthorization', 'false');

    localStorage.setItem('authorizationToken', '');

    localStorage.setItem('mainDataOfUser','');
	
	const logOut=useAutorizationStore().logOut;
	
	logOut();

	//Переходим на страницу авторизации
    router.replace('/');
	
}


export { disauthorize };