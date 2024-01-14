
import { axios } from '@/shared/axios.js';

async function updateMainDataOfUser(mainDataOfUser){
		
	//Пытаемся отправить запрос на сервер
	let response=await axios.put('users/updateMainData', {...mainDataOfUser});

	console.log(response);

	if(response.data.actionMessage=='mainDataOfUserWasUpdated'){

		localStorage.setItem(

			'mainDataOfUser',

			JSON.stringify(mainDataOfUser)

		);
	
	}

}

export { updateMainDataOfUser };