
import { axios } from '@/shared/axios.js'

import { useMainDataStore } from '@/shared/stores/mainData.js';

async function getMainDataOfUser(){
	
	const setMainDataOfUser=useMainDataStore().setMainDataOfUser;
	
	let response;
	
	//Пытаемся отправить запрос на сервер для получения информации о пользователе
	response=await axios.get('users/getMainData');

	console.log(response);
	
	if(response.data.errorExist==false){
		
		let mainDataOfUser=response.data.content.mainDataOfUser;

		localStorage.setItem(

			'mainDataOfUser',

			JSON.stringify(mainDataOfUser)

		);

		setMainDataOfUser(mainDataOfUser);
		
	}
	
}

export { getMainDataOfUser };