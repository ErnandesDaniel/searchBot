
//import autorizationModule from '../../modules/autorization'

//console.log(autorizationModule);


//let useAutorizationStore=autorizationModule.useAutorizationStore;

//import { useAutorizationStore } from '@/modules/autorization';

//console.log(useAutorizationStore);


//import { getListOfMyOrders } from '@/shared/api/getListOfMyOrders.js';

//import { getMainDataOfUser } from '@/shared/api/getMainDataOfUser.js';

//import { getListOfUsersByRole } from '@/shared/api/getListOfUsersByRole.js';

//import { computed } from 'vue'

/*
export async function uploadingDataDuringAuthorization(data){

	const autorizationStore=useAutorizationStore();
		
	const role=computed(()=>autorizationStore.role);
				
	//Получаем список пользователей (Заказчиков или Исполнителей)
	let roleOfAnotherUsers='';

	if(role.value=='executor'){

		roleOfAnotherUsers='customer';

	}else if(role.value=='customer'){

		roleOfAnotherUsers='executor';

	}
				
	//Получаем заказы пользователя
	getListOfMyOrders();
	
	//Получение списка пользователей
	getListOfUsersByRole(roleOfAnotherUsers);
				
	//Получаем данные о пользователе
	getMainDataOfUser();
	
	
}

*/